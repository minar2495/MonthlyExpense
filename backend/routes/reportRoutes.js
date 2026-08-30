const router = require("express").Router();

const protect =
    require("../middleware/authMiddleware");

const {
    getMonthlyReport
} = require("../controllers/reportController");


router.get(
    "/monthly",
    protect,
    getMonthlyReport
);


module.exports = router;