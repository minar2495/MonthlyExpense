const Expense = require("../models/Expense");

const validTypes = [
    "needs",
    "wants",
    "savings"
];

exports.getExpenses = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            type,
            category
        } = req.query;

        const filter = {
            userId: req.user.id
        };

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lt: new Date(endDate)
            };
        }

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        const expenses =
            await Expense.find(filter)
                .sort({ date: -1 });

        res.json(expenses);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createExpense = async (req, res) => {
    try {
        const {
            amount,
            description,
            category,
            type,
            date
        } = req.body;

        if (
            !amount ||
            !description ||
            !category ||
            !type ||
            !date
        ) {
            return res.status(400).json({
                message:
                    "All expense fields are required"
            });
        }

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                message: "Invalid expense type"
            });
        }

        const expense =
            await Expense.create({
                userId: req.user.id,
                amount: Number(amount),
                description,
                category,
                type,
                date: new Date(date)
            });

        res.status(201).json(expense);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        if (
            !validTypes.includes(
                req.body.type
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid expense type"
            });
        }

        const expense =
            await Expense.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.user.id
                },
                {
                    amount: Number(
                        req.body.amount
                    ),
                    description:
                        req.body.description,
                    category:
                        req.body.category,
                    type: req.body.type,
                    date: new Date(
                        req.body.date
                    )
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!expense) {
            return res.status(404).json({
                message:
                    "Expense not found"
            });
        }

        res.json(expense);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense =
            await Expense.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id
            });

        if (!expense) {
            return res.status(404).json({
                message:
                    "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};