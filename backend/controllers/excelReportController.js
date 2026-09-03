const ExcelJS = require("exceljs");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.downloadMonthlyExcel = async (req, res) => {
    try {
        const year = Number(req.query.year);
        const month = Number(req.query.month);

        if (!year || !month || month < 1 || month > 12) {
            return res.status(400).json({
                message: "Valid year and month are required"
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const userId = req.user._id;

        // Get income
        const incomes = await Income.find({
            userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        })
            .sort({ date: 1 })
            .lean();

        // Get expenses
        const expenses = await Expense.find({
            userId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        })
            .sort({ date: 1 })
            .lean();

        // Totals
        const totalIncome = incomes.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const totalExpenses = expenses.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const remaining = totalIncome - totalExpenses;

        // Category totals
        const categoryTotals = {
            Needs: 0,
            Wants: 0,
            Savings: 0
        };

        expenses.forEach((expense) => {
            if (
                Object.prototype.hasOwnProperty.call(
                    categoryTotals,
                    expense.category
                )
            ) {
                categoryTotals[expense.category] +=
                    Number(expense.amount || 0);
            }
        });

        // 50 / 30 / 20
        const budget = {
            Needs: totalIncome * 0.50,
            Wants: totalIncome * 0.30,
            Savings: totalIncome * 0.20
        };

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "SmartBudget";
        workbook.created = new Date();

        /*
         * ==========================
         * SUMMARY SHEET
         * ==========================
         */

        const summary = workbook.addWorksheet("Summary");

        summary.columns = [
            {
                header: "Financial Summary",
                key: "name",
                width: 30
            },
            {
                header: "Amount",
                key: "amount",
                width: 20
            }
        ];

        summary.addRows([
            {
                name: "Month",
                amount: `${month}/${year}`
            },
            {
                name: "Total Income",
                amount: totalIncome
            },
            {
                name: "Total Expenses",
                amount: totalExpenses
            },
            {
                name: "Remaining Balance",
                amount: remaining
            }
        ]);

        summary.getRow(1).font = {
            bold: true,
            size: 14
        };

        summary.getRow(1).alignment = {
            vertical: "middle"
        };

        summary.getColumn(2).numFmt =
            '₹#,##0.00';


        /*
         * ==========================
         * BUDGET SHEET
         * ==========================
         */

        const budgetSheet =
            workbook.addWorksheet("50-30-20 Budget");

        budgetSheet.columns = [
            {
                header: "Category",
                key: "category",
                width: 20
            },
            {
                header: "Target %",
                key: "targetPercent",
                width: 15
            },
            {
                header: "Target Amount",
                key: "target",
                width: 20
            },
            {
                header: "Actual",
                key: "actual",
                width: 20
            },
            {
                header: "Difference",
                key: "difference",
                width: 20
            }
        ];

        const budgetRows = [
            {
                category: "Needs",
                targetPercent: 50,
                target: budget.Needs,
                actual: categoryTotals.Needs,
                difference:
                    budget.Needs -
                    categoryTotals.Needs
            },
            {
                category: "Wants",
                targetPercent: 30,
                target: budget.Wants,
                actual: categoryTotals.Wants,
                difference:
                    budget.Wants -
                    categoryTotals.Wants
            },
            {
                category: "Savings",
                targetPercent: 20,
                target: budget.Savings,
                actual: categoryTotals.Savings,
                difference:
                    budget.Savings -
                    categoryTotals.Savings
            }
        ];

        budgetSheet.addRows(budgetRows);

        budgetSheet.getRow(1).font = {
            bold: true
        };

        budgetSheet.getColumn(3).numFmt =
            '₹#,##0.00';

        budgetSheet.getColumn(4).numFmt =
            '₹#,##0.00';

        budgetSheet.getColumn(5).numFmt =
            '₹#,##0.00';


        /*
         * ==========================
         * EXPENSES SHEET
         * ==========================
         */

        const expenseSheet =
            workbook.addWorksheet("Expenses");

        expenseSheet.columns = [
            {
                header: "Date",
                key: "date",
                width: 15
            },
            {
                header: "Title",
                key: "title",
                width: 30
            },
            {
                header: "Category",
                key: "category",
                width: 20
            },
            {
                header: "Amount",
                key: "amount",
                width: 20
            }
        ];

        expenses.forEach((expense) => {

            expenseSheet.addRow({
                date: expense.date,
                title: expense.title,
                category: expense.category,
                amount: Number(expense.amount || 0)
            });

        });

        expenseSheet.getRow(1).font = {
            bold: true
        };

        expenseSheet.getColumn(1).numFmt =
            "dd-mm-yyyy";

        expenseSheet.getColumn(4).numFmt =
            '₹#,##0.00';


        /*
         * ==========================
         * INCOME SHEET
         * ==========================
         */

        const incomeSheet =
            workbook.addWorksheet("Income");

        incomeSheet.columns = [
            {
                header: "Date",
                key: "date",
                width: 15
            },
            {
                header: "Source",
                key: "source",
                width: 30
            },
            {
                header: "Amount",
                key: "amount",
                width: 20
            }
        ];

        incomes.forEach((income) => {

            incomeSheet.addRow({
                date: income.date,
                source: income.source,
                amount: Number(income.amount || 0)
            });

        });

        incomeSheet.getRow(1).font = {
            bold: true
        };

        incomeSheet.getColumn(1).numFmt =
            "dd-mm-yyyy";

        incomeSheet.getColumn(3).numFmt =
            '₹#,##0.00';


        /*
         * ==========================
         * RESPONSE
         * ==========================
         */

        const filename =
            `SmartBudget-${year}-${String(month).padStart(2, "0")}.xlsx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        console.error(
            "Excel report error:",
            error
        );

        res.status(500).json({
            message: "Failed to generate Excel report"
        });
    }
};

exports.downloadAllExpensesExcel = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user._id
        })
            .sort({ date: 1 })
            .lean();

        const workbook = new ExcelJS.Workbook();
        const expenseSheet = workbook.addWorksheet("Expenses");

        expenseSheet.columns = [
            {
                header: "Date",
                key: "date",
                width: 15
            },
            {
                header: "Title",
                key: "title",
                width: 30
            },
            {
                header: "Category",
                key: "category",
                width: 20
            },
            {
                header: "Amount",
                key: "amount",
                width: 20
            }
        ];

        expenses.forEach((expense) => {
            expenseSheet.addRow({
                date: expense.date,
                title: expense.title,
                category: expense.category,
                amount: Number(expense.amount || 0)
            });
        });

        expenseSheet.getRow(1).font = {
            bold: true
        };

        expenseSheet.getColumn(1).numFmt = "dd-mm-yyyy";
        expenseSheet.getColumn(4).numFmt = '₹#,##0.00';

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="SmartBudget-All-Expenses.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("All expenses Excel error:", error);

        res.status(500).json({
            message: "Failed to generate expenses Excel file"
        });
    }
};