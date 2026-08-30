const Expense = require("../models/Expense");


exports.getExpenses = async (req, res) => {
    try {

        const {
            startDate,
            endDate,
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
            title,
            amount,
            category,
            date
        } = req.body;


        if (
            !title ||
            amount === undefined ||
            !category ||
            !date
        ) {

            return res.status(400).json({
                message:
                    "Title, amount, category and date are required"
            });

        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });

        }


        const expense =
            await Expense.create({

                userId: req.user.id,

                title: title.trim(),

                amount: Number(amount),

                category,

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

        const {
            title,
            amount,
            category,
            date
        } = req.body;


        if (
            !title ||
            amount === undefined ||
            !category ||
            !date
        ) {

            return res.status(400).json({
                message:
                    "Title, amount, category and date are required"
            });

        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });

        }


        const expense =
            await Expense.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.user.id
                },
                {
                    title: title.trim(),
                    amount: Number(amount),
                    category,
                    date: new Date(date)
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
            message:
                "Expense deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};