const router = require("express").Router();

const protect =
    require("../middleware/authMiddleware");

const {
    downloadMonthlyExcel,
    downloadAllExpensesExcel
} = require("../controllers/excelReportController");

router.get(
    "/all",
    protect,
    downloadAllExpensesExcel
);

router.get(
    "/monthly",
    protect,
    downloadMonthlyExcel
);

module.exports = router;