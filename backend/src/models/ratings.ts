import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
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
  rating: {
    type: Number, // e.g. 1 to 5
    required: true,
  },
  comment: {
    type: String, // optional
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", RatingSchema);
export default Rating;

