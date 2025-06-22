import mongoose, { mongo } from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: String,
  domain: String,
  approved: { type: Boolean, default: false }, // system-level admin approval
  logoUrl: String,
  description: String,
  
  orgUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrgUser"
    }
  ],
  
  createdAt: { type: Date, default: Date.now },
})

const Organization = mongoose.model("Organization", OrganizationSchema);
export default Organization;