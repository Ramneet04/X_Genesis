import mongoose, { mongo } from "mongoose";

const otpSchema = new mongoose.Schema({
    otp:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 60*5 // 5 minute
    }
})

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
