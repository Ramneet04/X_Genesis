import mongoose from "mongoose";

const PendingNftSchema = new mongoose.Schema({
 user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: String,

  tags: [String], // e.g. skills, tech, etc.

  category: {
    type: String,
    enum: ["Project", "Internship", "Certificate", "Hackathon", "ResearchPaper"],
    required: true,
  },

  fileUrl: {
    type: String,
    required: true, // IPFS file link (PDF/image)
  },

  metadataUrl: {
    type: String,
    default: null, // Generated after approval (can be filled later)
  },

  isSoulBound: {
    type: Boolean,
    default: false, // Optional: can be set by user
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  reasonForRejection: {
    type: String,
    default: null,
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },

  reviewedAt: Date,

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Or admin/reviewer model if applicable
  },

  mintedNFT: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nft", // Once approved and minted
    default: null,
  }
});

const PendingNft = mongoose.model("PendingNft", PendingNftSchema);
export default PendingNft;
