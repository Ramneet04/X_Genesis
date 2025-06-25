import mongoose from "mongoose";

const OrgUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // linked to login identity
    required: true
  },

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },

  role: {
    type: String,
    enum: ["OrgAdmin", "OrgUser"],
    default: "OrgUser"
  },

  isActive: { type: Boolean, default: true },
  joinedAt: { type: Date, default: Date.now }
});
OrgUserSchema.index({ user: 1, organization: 1 }, { unique: true });
const OrgUser = mongoose.model("OrgUser", OrgUserSchema);
export default OrgUser;