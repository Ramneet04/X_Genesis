import { Request, Response } from "express";
import User from "../models/user";
import OTP from "../models/otp";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import 'dotenv/config';
export const signup =async (req:any,res:any)=>{
    try {
        const {
            userName,
            email,
            password,
            confirmPassword,
            role,
            otp
        } = req.body;

        if(!userName ||
            !email ||
            !password ||
            !confirmPassword ||
            !role ||
            !otp
        ){
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false
            });
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match",
                success:false
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists",
                success:false
            })
        }
        const otpResponse = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        if (otpResponse.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== otpResponse[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            role
        });
        
        return res.status(200).json({
            message: "User created successfully",
            success: true,
            user
        })
    } catch (error) {
         console.error("Signup Error:", error);
         return res.status(500).json({
         message: "Error occurred while creating user",
         success: false,
         error: error instanceof Error ? error.message : "Unknown error"
         });
    }
}

export const login = async (req:any, res:any)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
                })
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({
                success: false,
                message: "Invalid password"
                })
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
          }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        )
        const userData = user.toObject() as any;
        userData.token = token;
        userData.password = "";

        const options = {
            expires: new Date(Date.now()+3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            user : userData,
            token
        });

    } catch (error) {
        console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
    }
}

export const sendotp = async (req:any, res:any) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
        return res.status(500).json({ success: false, error: err.message });
      } else {
        console.error(err);
        return res.status(500).json({ success: false, error: "An unknown error occurred." });
      }
  }
}

export const checkUserName = async (req:any, res:any) => {
  try {
    const { userName } = req.query;
    console.log("hello",userName);
    
  const user = await User.findOne({ userName: userName });
  if (user) {
    return res.status(200).json({ success:true,available: false });
  }
  return res.status(200).json({ success:true,available: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An unknown error occurred",
    })
  }
}