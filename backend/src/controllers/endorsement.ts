import { Request, response, Response } from "express";
import Endorsement from "../models/endorsement";

export const createEndorsement = async (req:Request, res:Response) =>{
    try {
        const nftId = req.params.nftId;
        const userId = (req as any).user.id;
        const {message} = req.body;

        if(!message){
            return res.status(400).json({message: "message is required", success:false});
        }
        const endorsementExist = await Endorsement.findOne({
            nftId,
            userId
        });
        if(endorsementExist){
            endorsementExist.message =message;
            await endorsementExist.save();
            return res.status(200).json({
                message: "Endorsement updated successfully",
                success: true
            })
        }
        const newEndorsement = new Endorsement({
            nftId,
            userId,
            message
        });
        await newEndorsement.save();
        return res.status(200).json({
            message: "Endorsement created successfully",
            success: true
        });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to endorse NFT." });
    }
};