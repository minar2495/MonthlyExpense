const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["needs", "wants", "savings"],
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        month: {
            type: Number,
            required: true
        },

        year: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Expense", expenseSchema);