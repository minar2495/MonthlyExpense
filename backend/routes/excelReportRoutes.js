const router = require("express").Router();

const protect =
    require("../middleware/authMiddleware");

const {
    downloadMonthlyExcel
} = require("../controllers/excelReportController");

router.get(
    "/monthly",
    protect,
    downloadMonthlyExcel
);

module.exports = router;