const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    try {
        const {
            amount,
            description,
            category,
            type,
            date
        } = req.body;

        const expenseDate = date
            ? new Date(date)
            : new Date();

        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            description,
            category,
            type,
            date: expenseDate,
            month: expenseDate.getMonth() + 1,
            year: expenseDate.getFullYear()
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { month, year } = req.query;

        const expenses = await Expense.find({
            userId: req.user.id,
            month,
            year
        }).sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        res.json({
            message: "Expense deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};