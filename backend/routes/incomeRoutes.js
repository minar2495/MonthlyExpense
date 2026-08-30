const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addIncome,
    getIncome,
    deleteIncome
} = require("../controllers/incomeController");

router.post("/", protect, addIncome);
router.get("/", protect, getIncome);
router.delete("/:id", protect, deleteIncome);

module.exports = router;