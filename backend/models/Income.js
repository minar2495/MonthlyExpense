const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
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

        source: {
            type: String,
            required: true,
            trim: true
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

incomeSchema.index({
    userId: 1,
    date: 1
});

module.exports = mongoose.model(
    "Income",
    incomeSchema
);