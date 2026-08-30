const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SmartBudget API running"
    });
});

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/income",
    require("./routes/incomeRoutes")
);

app.use(
    "/api/expenses",
    require("./routes/expenseRoutes")
);

app.use(
    "/api/dashboard",
    require("./routes/dashboardRoutes")
);

app.use(
    "/api/reports",
    require("./routes/reportRoutes")
);

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});