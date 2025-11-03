import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  address: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    index: true 
  },
  chainId: Number,
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: Date
});

export default mongoose.model("Wallet", walletSchema);
