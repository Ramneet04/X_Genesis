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

  tags: [String],

  category: {
  type: String,
  enum: ["Project", "Internship", "Certificate", "Hackathon", "ResearchPaper", "OpenSource", "Resume", "Skill"],
  },


  fileUrl: {
    type: String, // IPFS URL of certificate or project image
    required: true,
  },

  metadataUrl: {
    type: String, // IPFS URL of metadata JSON
    required: true,
  },

  verifiedBy: {
    type: String,
    enum: ["Self", "AI", "Organization"],
    default: "Self",
  },
  organization: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization"
  },

  // NFT info
  tokenId: {
    type: Number,    
    default: null,
  },
  walletAddress:{
    type: String,
  },
  transactionHash:{
    type: String,
  },
  chainId:{
    type: Number,
  },

  isListed: {
  type: Boolean,
  default: false,
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
    enum: ["Public", "Private"],
    default: "Public"
  },
  price: {
    type: String, // or String if in crypto
    default: 0,
  },
  currency: {
    type: String,
    enum: ["MATIC", "ETH", "USDT"],
    default: "ETH",
  }

})

const Nft= mongoose.model("Nft",NftSchema);

export default Nft;