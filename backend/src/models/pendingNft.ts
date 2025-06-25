import mongoose from "mongoose";

const PendingNftSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  tags: [String], // tech stack, skills, etc.

  category: {
     type: String, // "Course Certificate", "Project", "Hackathon", etc.
  },

  fileUrl: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  reasonForRejection: String,

  submittedAt: {
    type: Date,
    default: Date.now
  },

  reviewedAt: Date,

  mintedNFT: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nft" // once minted, linked here
  }
});

const PendingNft = mongoose.model("PendingNft", PendingNftSchema);
export default PendingNft;
