const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getPublicProfile
} = require("../controllers/userController");

const router = express.Router();

router.get("/:userId/public", getPublicProfile);
router.get("/me", protect, getMyProfile);
router.patch("/me", protect, upload.single("avatar"), updateMyProfile);
router.delete("/me", protect, deleteMyProfile);

module.exports = router;
