import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user";

export const auth = async (req:Request, res:Response, next: NextFunction)=>{
    try {
        const token = req.body || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({message:"Unauthorized", success:false});
        }

        try {
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in environment variables");
            }
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            (req as any).user = decode;
        } catch (error) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while Validatig the token",
            success: false
        })
    }
}
export const isUser = async (req:Request,res:Response,next: NextFunction)=>{
    try {
        const  {email} = (req as any).user;
        const userDetails = await User.findOne({email});
        if(!userDetails){
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }
        if(userDetails.role !== "User") {
            return res.status(401).json({
                message: "You are not authorized to access this route for User",
                success: false
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while validating the user",
            success: false
        })
    }
}
export const isRecruiter = async (req:Request,res:Response,next: NextFunction)=>{
    try {
        const  {email} = (req as any).user;
        const userDetails = await User.findOne({email});
        if(!userDetails){
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }
        if(userDetails.role !== "Recruiter") {
            return res.status(401).json({
                message: "You are not authorized to access this route for Recruiter",
                success: false
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while validating the user",
            success: false
        })
    }
}
export const isSuperAdmin = async (req:Request,res:Response,next: NextFunction)=>{
    try {
        const  {email} = (req as any).user;
        const userDetails = await User.findOne({email});
        if(!userDetails){
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }
        if(userDetails.role !== "SuperAdmin") {
            return res.status(401).json({
                message: "You are not authorized to access this route for SuperAdmin",
                success: false
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while validating the user",
            success: false
        })
    }
}