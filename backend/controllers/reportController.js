const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getMonthlyReport = async (req, res) => {
    try {
        const year = Number(req.query.year);
        const month = Number(req.query.month);

        if (
            !year ||
            !month ||
            month < 1 ||
            month > 12
        ) {
            return res.status(400).json({
                message: "Valid year and month are required"
            });
        }

        // Month boundaries
        const startDate = new Date(
            year,
            month - 1,
            1
        );

        const endDate = new Date(
            year,
            month,
            1
        );

        /*
         * INCOME AGGREGATION
         */

        const incomeResult =
            await Income.aggregate([
                {
                    $match: {
                        userId: req.user.id,
                        date: {
                            $gte: startDate,
                            $lt: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);

        const totalIncome =
            incomeResult[0]?.total || 0;


        /*
         * EXPENSE AGGREGATION
         */

        const expenseResult =
            await Expense.aggregate([
                {
                    $match: {
                        userId: req.user.id,
                        date: {
                            $gte: startDate,
                            $lt: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);


        const categoryTotals = {
            Needs: 0,
            Wants: 0,
            Savings: 0
        };


        expenseResult.forEach((item) => {

            if (
                categoryTotals[item._id]
                !== undefined
            ) {
                categoryTotals[item._id] =
                    item.total;
            }

        });


        const totalExpenses =
            categoryTotals.Needs +
            categoryTotals.Wants +
            categoryTotals.Savings;


        const remaining =
            totalIncome -
            totalExpenses;


        /*
         * 50 / 30 / 20 TARGETS
         */

        const budget = {
            Needs: totalIncome * 0.50,
            Wants: totalIncome * 0.30,
            Savings: totalIncome * 0.20
        };


        /*
         * PERCENTAGE USED
         */

        const percentage = {
            Needs:
                budget.Needs > 0
                    ? (
                        categoryTotals.Needs /
                        budget.Needs
                    ) * 100
                    : 0,

            Wants:
                budget.Wants > 0
                    ? (
                        categoryTotals.Wants /
                        budget.Wants
                    ) * 100
                    : 0,

            Savings:
                budget.Savings > 0
                    ? (
                        categoryTotals.Savings /
                        budget.Savings
                    ) * 100
                    : 0
        };


        /*
         * RECENT INCOME
         */

        const recentIncome =
            await Income.find({
                userId: req.user.id,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            })
                .sort({ date: -1 })
                .limit(5)
                .lean();


        /*
         * RECENT EXPENSES
         */

        const recentExpenses =
            await Expense.find({
                userId: req.user.id,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            })
                .sort({ date: -1 })
                .limit(5)
                .lean();


        res.json({

            period: {
                year,
                month
            },

            income: {
                total: totalIncome,
                transactions: recentIncome
            },

            expenses: {
                total: totalExpenses,
                categories: categoryTotals,
                transactions: recentExpenses
            },

            budget,

            percentage,

            remaining

        });

    } catch (error) {

        console.error(
            "Report error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};