import { Request, Response } from "express";
import Nft from "../models/nfts";

export const createNft = async (req:Request, res:Response) => {
  try {
    const {
      title,
      description,
      tags,
      category,
      fileUrl,
      metadataUrl,
      verifiedBy = "Self",
      organization = null,
      contributors = [],
      visibility = "public"
    } = req.body;

    const nft = await Nft.create({
      userId: req.user.id,
      title,
      description,
      tags,
      category,
      fileUrl,
      metadataUrl,
      verifiedBy,
      organization: verifiedBy === "Self" ? null : organization,
      contributors,
      visibility,
      mintedAt: new Date(),
    });

    res.status(201).json({ success: true, data: nft });
  } catch (err) {
    console.error("Create NFT Error:", err);
    res.status(500).json({ success: false, message: "NFT creation failed." });
  }
};

