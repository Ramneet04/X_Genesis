import mongoose, { mongo } from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  domain: {
    type: String,
    trim: true
  },

  approved: { //system level aproove
    type: Boolean,
    default: false
  },
  pendingNfts:{
         type: [mongoose.Schema.Types.ObjectId],
         ref:"PendingNft",
         default: []
  },
  logo: {
    type: String,
    default: null
  },

  description: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Organization = mongoose.model("Organization", OrganizationSchema);
export default Organization;