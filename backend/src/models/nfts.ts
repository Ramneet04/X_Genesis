import mongoose from "mongoose";

const NftSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  tags: [String], // tech stack, skills, etc.

  fileUrl: {
    type: String, // IPFS URL of certificate or project image
    required: true,
  },

  metadataUrl: {
    type: String, // IPFS URL of metadata JSON
    default: null,
  },

  status: {
    type: String,
    enum: ["Pending", "AI-Verified", "Institute-Verified", "Ready", "Minted"],
    default: "Pending",
  },

  verifiedBy: {
    type: String,
    enum: ["Self", "AI", "Institute", "Both"],
    default: "Self",
  },

  // Ratings out of 5, average and count
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  // Number of likes from recruiters or public
  likes: {
    type: Number,
    default: 0,
  },
  submittedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // university, company, bootcamp, etc.
  },

  // Array of endorsements (text + who endorsed)
  endorsements: [
    {
      endorsedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // could be institute/recruiter
      },
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],

  // NFT info
  tokenId: {
    type: String,
    default: null,
  },

  issuedAt: {
    type: Date, // When NFT is minted
    default: null,
  },
  contributors: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: String, // Optional: "Lead", "Developer", "Designer", etc.
  }
],

})

const Nft= mongoose.model("Nft",NftSchema);

export default Nft;