const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
    try {
        const {
            amount,
            source,
            date
        } = req.body;

        const incomeDate = date ? new Date(date) : new Date();

        const income = await Income.create({
            userId: req.user.id,
            amount,
            source,
            date: incomeDate,
            month: incomeDate.getMonth() + 1,
            year: incomeDate.getFullYear()
        });

        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getIncome = async (req, res) => {
    try {
        const { month, year } = req.query;

        const income = await Income.find({
            userId: req.user.id,
            month,
            year
        }).sort({ date: -1 });

        res.json(income);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        await Income.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        res.json({
            message: "Income deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};