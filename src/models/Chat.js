const mongoose = require("mongoose");

const meetupProposalSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "",
      trim: true,
    },
    proposedBy: {
      type: String,
      default: "",
      trim: true,
    },
    proposedAt: {
      type: String,
      default: "",
    },
    responseLocation: {
      type: String,
      default: "",
      trim: true,
    },
    respondedBy: {
      type: String,
      default: "",
      trim: true,
    },
    respondedAt: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const chatMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "meetup_proposal"],
      default: "text",
      trim: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    meetupProposal: {
      type: meetupProposalSchema,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
    ownerLastReadAt: {
      type: Date,
      default: null,
    },
    buyerLastReadAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

chatSchema.index({ productId: 1, ownerId: 1, buyerId: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
