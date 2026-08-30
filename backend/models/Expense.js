const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
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
            enum: [
                "needs",
                "wants",
                "savings"
            ],
            required: true
        },

        date: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

expenseSchema.index({
    userId: 1,
    date: 1
});

expenseSchema.index({
    userId: 1,
    type: 1,
    date: 1
});

module.exports = mongoose.model(
    "Expense",
    expenseSchema
);