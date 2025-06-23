import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  nftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nft",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Like = mongoose.model("Like", LikeSchema);
export default Like;