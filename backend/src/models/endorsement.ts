import mongoose from "mongoose";

const EndorsementSchema = new mongoose.Schema(
  {
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
    message: {
      type: String,
      maxlength: 500,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Endorsement", EndorsementSchema);
