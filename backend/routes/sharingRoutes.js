const router = require("express").Router();

const protect = require("../middleware/authMiddleware");

const {
    getRequests,
    sendRequest,
    updateRequest,
    getSharedExpenses
} = require("../controllers/sharingController");

router.use(protect);

router.get("/requests", getRequests);
router.post("/requests", sendRequest);
router.patch("/requests/:id", updateRequest);
router.get("/expenses", getSharedExpenses);

module.exports = router;
