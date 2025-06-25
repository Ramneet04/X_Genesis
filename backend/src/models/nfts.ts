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

  category: {
     type: String, // "Course Certificate", "Project", "Hackathon", etc.
  },

  fileUrl: {
    type: String, // IPFS URL of certificate or project image
    required: true,
  },

  metadataUrl: {
    type: String, // IPFS URL of metadata JSON
    default: null,
  },

  verifiedBy: {
    type: String,
    enum: ["Self", "AI", "Institute", "Both"],
    default: "Self",
  },
  organization: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization"
  },

  // Ratings out of 5, average and count
  rating: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating"
  }],

  // Number of likes from recruiters or public
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Like"
  }],

  // Array of endorsements (text + who endorsed)
  endorsements: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Endorsement"
  }],

  // NFT info
  tokenId: {
    type: String,
    default: null,
  },

  mintedAt: {
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
visibility: {
  type: String,
  enum: ["public", "private", "unlisted"],
  default: "public"
}

})

const Nft= mongoose.model("Nft",NftSchema);

export default Nft;