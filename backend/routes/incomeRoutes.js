const router = require("express").Router();

const protect =
    require("../middleware/authMiddleware");

const {
    getIncome,
    createIncome,
    updateIncome,
    deleteIncome
} = require("../controllers/incomeController");


router.get(
    "/",
    protect,
    getIncome
);


router.post(
    "/",
    protect,
    createIncome
);


router.put(
    "/:id",
    protect,
    updateIncome
);


router.delete(
    "/:id",
    protect,
    deleteIncome
);


module.exports = router;