import mongoose from "mongoose";

const NftSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentOwner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
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

  // NFT info
  tokenId: {
    type: String,
    default: null,
  },

  mintedAt: {
    type: Date, // When NFT is minted
    default: Date.now(),
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
  enum: ["Public", "Private", "Unlisted"],
  default: "Public"
},
forSale: {
  type: Boolean,
  default: false,
},
price: {
  type: Number, // or String if in crypto
  default: null,
},
currency: {
  type: String,
  enum: ["MATIC", "ETH", "USDT"],
  default: "MATIC",
}

})

const Nft= mongoose.model("Nft",NftSchema);

export default Nft;