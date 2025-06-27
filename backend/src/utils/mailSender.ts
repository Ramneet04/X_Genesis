import nodemailer from "nodemailer"
import "dotenv/config"
import { Request } from "express"

export const mailSender = async (email : string, title : string, body:string) =>{
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASSWORD,
                },
            secure: false,
        })
        let info = await transporter.sendMail({
            from: `"X Genesis Team" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log("Message sent: %s", info.response);
        return info;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return error.message;
        } else {
            console.log("Unknown error", error);
            return "Unknown error";
        }
    }
}