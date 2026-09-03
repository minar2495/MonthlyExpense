const mongoose = require("mongoose");

const shareRequestSchema = new mongoose.Schema(
    {
        requesterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        },

        approvedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

shareRequestSchema.index(
    {
        requesterId: 1,
        recipientId: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "ShareRequest",
    shareRequestSchema
);
