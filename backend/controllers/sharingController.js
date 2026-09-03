const User = require("../models/User");
const Expense = require("../models/Expense");
const ShareRequest = require("../models/ShareRequest");

const userResponse = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});

const requestResponse = (request) => ({
    id: String(request._id),
    status: request.status,
    createdAt: request.createdAt,
    requester: userResponse(request.requesterId),
    recipient: userResponse(request.recipientId)
});

const approvedPartnerIds = async (userId) => {
    const requests = await ShareRequest.find({
        status: "approved",
        $or: [
            { requesterId: userId },
            { recipientId: userId }
        ]
    });

    return requests.map((request) =>
        String(request.requesterId) === String(userId)
            ? request.recipientId
            : request.requesterId
    );
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await ShareRequest.find({
            $or: [
                { requesterId: req.user.id },
                { recipientId: req.user.id }
            ]
        })
            .populate("requesterId", "name email")
            .populate("recipientId", "name email")
            .sort({ createdAt: -1 });

        res.json({
            requests: requests.map(requestResponse),
            approved: requests.some((request) => request.status === "approved")
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendRequest = async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        if (!email) {
            return res.status(400).json({
                message: "Partner email is required"
            });
        }

        const recipient = await User.findOne({ email });

        if (!recipient) {
            return res.status(404).json({
                message: "No SmartBudget user found with that email"
            });
        }

        if (String(recipient._id) === String(req.user.id)) {
            return res.status(400).json({
                message: "You cannot send a sharing request to yourself"
            });
        }

        const existing = await ShareRequest.findOne({
            $or: [
                {
                    requesterId: req.user.id,
                    recipientId: recipient._id
                },
                {
                    requesterId: recipient._id,
                    recipientId: req.user.id
                }
            ]
        });

        if (existing) {
            return res.status(409).json({
                message: existing.status === "approved"
                    ? "Sharing is already approved"
                    : "A sharing request already exists"
            });
        }

        const request = await ShareRequest.create({
            requesterId: req.user.id,
            recipientId: recipient._id
        });

        await request.populate("requesterId", "name email");
        await request.populate("recipientId", "name email");

        res.status(201).json({
            request: requestResponse(request),
            recipient: userResponse(recipient)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRequest = async (req, res) => {
    try {
        const status = req.body.status;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected"
            });
        }

        const request = await ShareRequest.findOne({
            _id: req.params.id,
            recipientId: req.user.id,
            status: "pending"
        });

        if (!request) {
            return res.status(404).json({
                message: "Pending sharing request not found"
            });
        }

        request.status = status;
        request.approvedAt = status === "approved" ? new Date() : undefined;
        await request.save();
        await request.populate("requesterId", "name email");
        await request.populate("recipientId", "name email");

        res.json({ request: requestResponse(request) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.stopSharing = async (req, res) => {
    try {
        const request = await ShareRequest.findOneAndDelete({
            _id: req.params.id,
            status: "approved",
            $or: [
                { requesterId: req.user.id },
                { recipientId: req.user.id }
            ]
        });

        if (!request) {
            return res.status(404).json({
                message: "Approved sharing relationship not found"
            });
        }

        res.json({
            message: "Sharing stopped successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSharedExpenses = async (req, res) => {
    try {
        const partnerIds = await approvedPartnerIds(req.user.id);

        if (partnerIds.length === 0) {
            return res.status(403).json({
                message: "Sharing permission is required to view joint expenses"
            });
        }

        const userIds = [req.user.id, ...partnerIds];
        const filter = {
            userId: { $in: userIds }
        };

        if (req.query.startDate && req.query.endDate) {
            filter.date = {
                $gte: new Date(req.query.startDate),
                $lt: new Date(req.query.endDate)
            };
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const expenses = await Expense.find(filter)
            .populate("userId", "name email")
            .sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
