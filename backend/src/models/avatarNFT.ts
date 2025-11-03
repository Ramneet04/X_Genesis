import mongoose from "mongoose";

const avatarNFTSchema = new mongoose.Schema({
    category:{
        type:String,
    },
    image:{
        type:String,
    }
});
const avatarNFT = mongoose.model("avatarNFT", avatarNFTSchema);
export default avatarNFT;