const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  listMyNotifications,
  readNotification,
  readAllNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, listMyNotifications);
router.post("/read-all", protect, readAllNotifications);
router.post("/:notificationId/read", protect, readNotification);

module.exports = router;
