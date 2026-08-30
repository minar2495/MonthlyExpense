const Expense = require("../models/Expense");
const Income = require("../models/Income");

exports.getDashboard = async (req, res) => {
    try {
        const {
            startDate,
            endDate
        } = req.query;

        const userId = req.user.id;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const dateFilter = {
            userId,
            date: {
                $gte: start,
                $lt: end
            }
        };

        const incomeResult =
            await Income.aggregate([
                {
                    $match: dateFilter
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

        const expenseResult =
            await Expense.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $group: {
                        _id: "$type",
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);

        const categoryResult =
            await Expense.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $group: {
                        _id: "$category",
                        total: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $sort: {
                        total: -1
                    }
                }
            ]);

        const dailyResult =
            await Expense.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$date"
                            }
                        },
                        total: {
                            $sum: "$amount"
                        }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]);

        const income =
            incomeResult[0]?.total || 0;

        const byType = {
            needs: 0,
            wants: 0,
            savings: 0
        };

        expenseResult.forEach(item => {
            byType[item._id] = item.total;
        });

        const totalExpenses =
            byType.needs +
            byType.wants +
            byType.savings;

        const budgets = {
            needs: income * 0.50,
            wants: income * 0.30,
            savings: income * 0.20
        };

        res.json({
            income,
            totalExpenses,

            balance:
                income - totalExpenses,

            budgets,

            spent: byType,

            remaining: {
                needs:
                    budgets.needs -
                    byType.needs,

                wants:
                    budgets.wants -
                    byType.wants,

                savings:
                    budgets.savings -
                    byType.savings
            },

            percentages: {
                needs: income
                    ? (byType.needs / income) *
                      100
                    : 0,

                wants: income
                    ? (byType.wants / income) *
                      100
                    : 0,

                savings: income
                    ? (byType.savings / income) *
                      100
                    : 0
            },

            categories:
                categoryResult.map(item => ({
                    category: item._id,
                    amount: item.total
                })),

            daily:
                dailyResult.map(item => ({
                    date: item._id,
                    amount: item.total
                }))
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};