import { Request, response, Response } from "express";
import Rating from "../models/ratings";

export const createRating = async (req:Request, res:Response) =>{
    try {
        const nftId = req.params.nftId;
        const userId = (req as any).user.id;
        const {rating, comment} = req.body;

        if(!rating || rating <1 || rating >5){
            return res.status(400).json({message: "rating must be between 1 and 5.", success:false});
        }
        const ratingExists = await Rating.findOne({
            nftId,
            userId
        });
        if(ratingExists){
            ratingExists.rating = rating;
            ratingExists.comment = comment;
            await ratingExists.save();
            return res.status(200).json({
                message: "Rating updated successfully",
                success: true
            })
        }
        const newRating = new Rating({
            nftId,
            userId,
            rating,
            comment
        });
        await newRating.save();
        return res.status(200).json({
            message: "Rating created successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to rate NFT." });
    }
}