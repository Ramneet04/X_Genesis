import { Request, Response } from "express";
import Like from "../models/likes";

export const toggleLike = async (req:Request, res:Response)=>{
    try {
        const nftId = req.params.nftId;
        const userId = (req as any).user.id;
        const like = await Like.findOne({nftId, userId});
    if(like){
        await Like.deleteOne({_id:like._id});
        return res.status(200).json({
            message: "Like removed",
            success: true,
            liked: false
        })
    }
    await Like.create({
        nftId,
        userId
    });
    return res.status(200).json({
        message: "Like added",
        success: true,
        liked: true
    })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to toggle like",
            success: false
        })
    }
}