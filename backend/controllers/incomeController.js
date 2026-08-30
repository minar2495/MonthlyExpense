const Income = require("../models/Income");

exports.getIncome = async (req, res) => {
    try {
        const {
            startDate,
            endDate
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

        const income = await Income
            .find(filter)
            .sort({ date: -1 });

        res.json(income);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createIncome = async (req, res) => {
    try {
        const {
            amount,
            source,
            date
        } = req.body;

        if (
            !amount ||
            !source ||
            !date
        ) {
            return res.status(400).json({
                message:
                    "Amount, source and date are required"
            });
        }

        const income = await Income.create({
            userId: req.user.id,
            amount: Number(amount),
            source,
            date: new Date(date)
        });

        res.status(201).json(income);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const income =
            await Income.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.user.id
                },
                {
                    amount: Number(
                        req.body.amount
                    ),
                    source: req.body.source,
                    date: new Date(
                        req.body.date
                    )
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!income) {
            return res.status(404).json({
                message: "Income not found"
            });
        }

        res.json(income);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const income =
            await Income.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id
            });

        if (!income) {
            return res.status(404).json({
                message: "Income not found"
            });
        }

        res.json({
            message: "Income deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};