import mongoose from "mongoose";
import type { CallbackError } from "mongoose";
import { mailSender } from "../utils/mailSender";
import otpTemplate from "../mail/otpMail";
import { NextFunction } from "express";
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

const sendOtpMail = async (email:string, otp:string): Promise<void>=>{
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            otpTemplate(otp)
        );

        console.log("mail sent successfully", (mailResponse as any).response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
		throw error;
    }
}
otpSchema.pre("save", async function (next:(err ?: CallbackError)=>void){
    if(this.isNew){
        await sendOtpMail(this.email as string,this.otp as string);
    }
    next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
