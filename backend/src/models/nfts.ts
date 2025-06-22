import mongoose from "mongoose";

const NftSchema = new mongoose.Schema({
studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  documentUrl: {
    type: String, // IPFS or server file URL
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "AI-Verified", "Institute-Verified", "Rejected", "Minted"],
    default: "Pending",
  },
  verifiedBy: {
    type: String,
    enum: ["Self", "AI", "Institute", "Both"],
    default: "Self",
  },
  metadataUrl: {
    type: String, // IPFS URL (e.g. ipfs://QmXYZ...)
    default: null,
  },
  nftTokenId: {
    type: String, // From your smart contract mint result
    default: null,
  },
  issuedAt: {
    type: Date, // When NFT was minted
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Nft= mongoose.model("Nft",NftSchema);

export default Nft;