const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const userResponse = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must contain at least 6 characters"
            });
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            token: createToken(user._id),
            user: userResponse(user)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const valid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!valid) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        res.json({
            token: createToken(user._id),
            user: userResponse(user)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};