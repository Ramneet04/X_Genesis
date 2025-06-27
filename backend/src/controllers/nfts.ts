import { Request, Response } from "express";
import Nft from "../models/nfts";
import Like from "../models/likes";
import Rating from "../models/ratings";
import endorsement from "../models/endorsement";

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
      visibility = "Public",
      forSale,
      price,
      currentOwner
    } = req.body;

    const nft = await Nft.create({
      userId: (req as any).user.id,
      currentOwner: (req as any).user.id,
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
      forSale,
      price: forSale === true ? price : null
    });

    res.status(201).json({ success: true, data: nft });
  } catch (err) {
    console.error("Create NFT Error:", err);
    res.status(500).json({ success: false, message: "NFT creation failed." });
  }
};

export const getNftById = async(req:Request, res:Response)=>{
  try {
    const nft = await Nft.findById(req.params.id)
    .populate("userId", "userName email walletAddress")
    .populate("contributors.userId", "userName email walletAddress")
    .populate("organization", "name")

    if(!nft){
      return res.status(404).json({success:false, message:"NFT not found."})
    }

    const [likesCount, ratingStats, endorsements] = await Promise.all([
      Like.countDocuments({
        nftId:nft._id
      }),
      Rating.aggregate([
        {
          $match:{
            nftId:nft._id
          }
        },
        {
          $group:{
            _id:null,
            avgRating: {
              $avg: "$rating"
            },
            ratingCount: {
              $sum:1
            }
          }
        }
      ]),
      endorsement.find({nftId: nft._id}).
      populate("userId", "userName email")      
    ]);
    const ratingData = ratingStats[0] || {
      avgRating: 0,
      ratingCount: 0
    };
    
    return res.status(200).json({
      success: true,
      data: {
        ...nft.toObject(),
        likesCount,
        ratingData,
        endorsements
      }
    })
  } catch (error) {
    console.error("Error fetching NFT:", error);
    res.status(500).json({ success: false, message: "Failed to fetch NFT" });
  }
};

export const getAllNft = async (req:Request, res:Response)=>{
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page-1) * limit;
    const nfts = await Nft.find({
      visibility: "Public"
    })
    .skip(skip)
    .limit(limit)
    .sort({mintedAt:-1})
    .populate("userId", "userName email walletAddress")
    .populate("contributors.userId", "userName email walletAddress")
    .populate("organization", "name")

    const nftData = await Promise.all(
      nfts.map(async(nft)=>{
        const [likesCount, ratingStats, endorsements] = await Promise.all([
      Like.countDocuments({
        nftId:nft._id
      }),
      Rating.aggregate([
        {
          $match:{
            nftId:nft._id
          }
        },
        {
          $group:{
            _id:null,
            avgRating: {
              $avg: "$rating"
            },
            ratingCount: {
              $sum:1
            }
          }
        }
      ]),
      endorsement.find({nftId: nft._id}).
      populate("userId", "userName email")      
    ]);
     const ratingData = ratingStats[0] || {
      avgRating: 0,
      ratingCount: 0
    };

    return {
      ...nft.toObject(),
        likesCount,
        ratingData,
        endorsements
        }
     })
    )

    return res.json({
      message: "Nfts fetched successfully",
      success:true,
      data: nftData,
      page,
      totalNfts: nftData.length,
      totalPages: Math.ceil(nftData.length/limit)
    });

  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch NFTs" });
  }
};

export const getUsersNfts = async(req:Request, res:Response)=>{
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page-1) * limit;
    const userId = (req as any).user.id;
    const nfts = await Nft.find({ userId })
    .skip(skip)
    .limit(limit)
    .populate("organization", "name")
    .populate("contributors.userId", "userName email walletAddress")
    .sort({ mintedAt: -1 });

  const nftData = await Promise.all(
      nfts.map(async(nft)=>{
        const [likesCount, ratingStats, endorsements] = await Promise.all([
      Like.countDocuments({
        nftId:nft._id
      }),
      Rating.aggregate([
        {
          $match:{
            nftId:nft._id
          }
        },
        {
          $group:{
            _id:null,
            avgRating: {
              $avg: "$rating"
            },
            ratingCount: {
              $sum:1
            }
          }
        }
      ]),
      endorsement.find({nftId: nft._id}).
      populate("userId", "userName email")      
    ]);
     const ratingData = ratingStats[0] || {
      avgRating: 0,
      ratingCount: 0
    };

    return {
      ...nft.toObject(),
        likesCount,
        ratingData,
        endorsements
        }
     })
    )
    return res.status(200).json({
      message:"Nfts fetched for the User",
      success:true,
      data: nftData,
      page,
      totalNfts: nftData.length,
      totalPages: Math.ceil(nftData.length/limit)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Nfts",
      success: false,
    });
  }
};

export const getTopValuedNfts = async (req:Request, res:Response)=>{
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const nfts = await Nft.find({
      visibility: "Public"
    })
    .populate("userId", "userName email walletAddress")
    .populate("contributors.userId", "userName email walletAddress")
    .populate("organization", "name")

    const nftData = await Promise.all(
      nfts.map(async(nft)=>{
        const [likesCount, ratingStats, endorsements] = await Promise.all([
      Like.countDocuments({
        nftId:nft._id
      }),
      Rating.aggregate([
        {
          $match:{
            nftId:nft._id
          }
        },
        {
          $group:{
            _id:null,
            avgRating: {
              $avg: "$rating"
            },
            ratingCount: {
              $sum:1
            }
          }
        }
      ]),
      endorsement.find({nftId: nft._id}).
      populate("userId", "userName email")      
    ]);
     const ratingData = ratingStats[0] || {
      avgRating: 0,
      ratingCount: 0
    };
    const valueScore = likesCount * 1 + ratingData.avgRating * 5 + endorsement.length * 2;
    return {
      ...nft.toObject(),
        likesCount,
        ratingData,
        endorsements,
        valueScore
        }
     })
    )
    nftData.sort((a,b) =>{
      return b.valueScore - a.valueScore
    });
    const paginatedData = nftData.slice(skip, skip+limit);

    return res.status(200).json({
      success: true,
      message: "Top valued NFTs fetched",
      data: paginatedData,
      page,
      totalNfts: nftData.length,
      totalPages: Math.ceil(nftData.length/limit)

    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching top valued NFTs",
    })
  }
};

export const getFilteredNfts = async (req:Request, res:Response)=>{
  try {
    
  } catch (error) {
    
  }
};

export const updateNftVisibility = async (req:Request, res:Response)=>{
  try {
    const nftId = req.params.nftId;
    const userId = (req as any).user.id;
    const visibility = req.body;

    if(!["Public", "Private", "Unlisted"].includes(visibility)){
      return res.status(400).json({
        message: "Invalid visibility",
        success: false
        });
    }
    const nft = await Nft.findOne({_id: nftId});
    if(!nft){
      return res.status(404).json({
        message: "Nft not found",
        success: false
        });
    }
    if(nft.userId.toString() !== userId.toString()){
      return res.status(403).json({
        message: "You do not have permission to update this Nft",
        success: false
        });
    }
    nft.visibility=visibility;
    await nft.save();
    return res.status(200).json({
      message: "Nft visibility updated",
      success: true,
      data: {
         id: nft._id,
         visibility: nft.visibility
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error updating Nft visibility",
      success: false,
    })
  }
};
