const express = require("express");

const protect = require("../middleware/authMiddleware");
const chatUpload = require("../middleware/chatUpload");
const {
  listMyChats,
  listMessages,
  startChat,
  sendMessage,
  respondMeetupProposal,
  confirmMeetupHandover,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/", protect, listMyChats);
router.post("/", protect, startChat);
router.get("/:chatId/messages", protect, listMessages);
router.post(
  "/:chatId/messages",
  protect,
  chatUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  sendMessage
);
router.post("/:chatId/meetup-proposals/:messageId/respond", protect, respondMeetupProposal);
router.post("/:chatId/meetup-proposals/:messageId/handover", protect, confirmMeetupHandover);

module.exports = router;
