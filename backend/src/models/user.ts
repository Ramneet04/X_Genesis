import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
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
    },

    // Web3 Wallet
    walletAddress: {
      type: String,
      default: null,
    },

    // User Type
    role: {
      type: String,
      enum: ["Student", "Recruiter", "OrgUser", "Admin"],
      default: "Student",
    },

    // Optional Profile Fields
    profileImage: {
      type: String,
      default: null, // IPFS or CDN image URL
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    country: String,
    language: {
      type: String,
      default: "en",
    },

    // NFT Credentials (linked NFTs owned by the user)
    credentials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nft",
      },
    ],

    // Recruiter-specific fields (optional)
    company: String,
    designation: String,

    // For verifying login OTPs or email verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastLogin: Date,
    //social features
        friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", UserSchema);
