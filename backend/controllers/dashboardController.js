const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboard = async (req, res) => {
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
         * ============================
         * INCOME AGGREGATION
         * ============================
         */

        const incomeAggregation =
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
            incomeAggregation[0]?.total || 0;


        /*
         * ============================
         * EXPENSE AGGREGATION
         * ============================
         */

        const expenseAggregation =
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


        expenseAggregation.forEach(
            (item) => {

                if (
                    Object.prototype.hasOwnProperty.call(
                        categoryTotals,
                        item._id
                    )
                ) {
                    categoryTotals[item._id] =
                        item.total;
                }

            }
        );


        const totalExpenses =
            categoryTotals.Needs +
            categoryTotals.Wants +
            categoryTotals.Savings;


        /*
         * ============================
         * 50 / 30 / 20
         * ============================
         */

        const budget = {
            Needs: totalIncome * 0.50,
            Wants: totalIncome * 0.30,
            Savings: totalIncome * 0.20
        };


        /*
         * ============================
         * REMAINING BALANCE
         * ============================
         */

        const remaining =
            totalIncome -
            totalExpenses;


        /*
         * ============================
         * BUDGET USAGE
         * ============================
         */

        const usage = {
            Needs: budget.Needs > 0
                ? (categoryTotals.Needs / budget.Needs) * 100
                : 0,

            Wants: budget.Wants > 0
                ? (categoryTotals.Wants / budget.Wants) * 100
                : 0,

            Savings: budget.Savings > 0
                ? (categoryTotals.Savings / budget.Savings) * 100
                : 0
        };


        /*
         * ============================
         * RECENT INCOME
         * ============================
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
         * ============================
         * RECENT EXPENSES
         * ============================
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


        /*
         * ============================
         * TRANSACTION COUNT
         * ============================
         */

        const incomeCount =
            await Income.countDocuments({
                userId: req.user.id,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            });


        const expenseCount =
            await Expense.countDocuments({
                userId: req.user.id,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            });


        res.json({

            period: {
                year,
                month
            },

            income: {
                total: totalIncome,
                count: incomeCount
            },

            expenses: {
                total: totalExpenses,
                count: expenseCount,

                categories: categoryTotals
            },

            budget,

            usage,

            remaining,

            transactions: {
                income: recentIncome,
                expenses: recentExpenses
            }

        });

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }
};