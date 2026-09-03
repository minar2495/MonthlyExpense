const router = require("express").Router();

const protect = require("../middleware/authMiddleware");

const {
    getRequests,
    sendRequest,
    updateRequest,
    stopSharing,
    getSharedExpenses
} = require("../controllers/sharingController");

router.use(protect);

router.get("/requests", getRequests);
router.post("/requests", sendRequest);
router.patch("/requests/:id", updateRequest);
router.delete("/requests/:id", stopSharing);
router.get("/expenses", getSharedExpenses);

module.exports = router;
