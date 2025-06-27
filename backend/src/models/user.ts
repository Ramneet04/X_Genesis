import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Basic Info
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: null,
      trim: true,
    },

    lastName: {
      type: String,
      default: null,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: null
    },

    // Web3 Wallet
    walletAddress: {
      type: String,
      default: null,
    },

    // User Type
    role: {
      type: String,
      enum: ["User", "Recruiter", "OrgAdmin", "OrgUser", "SuperAdmin"],
      default: "User",
    },

    resetPasswordExpires: {
      type: Date,
    },

    // Optional Profile Fields
    profileImage: {
      type: String,
      default: null, // IPFS or CDN image URL
    },

    bio: {
      type: String,
      maxlength: 500,
      default:null
    },

    country: {
      type: String,
      default: null
    },

    language: {
      type: String,
      default: "en",
    },

    // NFT Credentials (linked NFTs owned by the user)
    credentials:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Nft",
        default: []
    },
    pendingNfts:{
       type: [mongoose.Schema.Types.ObjectId],
       ref:"PendingNft",
       default: []
    },
    company: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },

    // For verifying login OTPs or email verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    nftToken: {
      type: String,
      default: null
    },
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastLogin: Date,
    //social features
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
       default: [],
    },

    friendRequests: {
  type: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    sentAt: { type: Date, default: Date.now },
  }],
  default: [],
}
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", UserSchema);
