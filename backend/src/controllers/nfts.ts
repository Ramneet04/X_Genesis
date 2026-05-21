import { Request, Response } from "express";
import Nft from "../models/nfts";
import Like from "../models/likes";
import Rating from "../models/ratings";
import Endorsement from "../models/endorsement";
import User from "../models/user";

/** Attach likes / ratings / endorsements to a single NFT document */
async function attachStats(nft: any) {
  const [likesCount, ratingStats, endorsements] = await Promise.all([
    Like.countDocuments({ nftId: nft._id }),
    Rating.aggregate([
      { $match: { nftId: nft._id } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } },
    ]),
    Endorsement.find({ nftId: nft._id }).populate("userId", "userName email"),
  ]);

  const ratingData = ratingStats[0] ?? { avgRating: 0, ratingCount: 0 };

  return {
    ...nft.toObject(),
    likesCount,
    ratingData,
    endorsements,
  };
}

// ─── create NFT ─────────────────────────────────────────────────────────────

export const createNft = async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      tags,
      category,
 
      documentUrl,
      metadataUrl,
      verifiedBy = "Self",
      organization = null,
      walletAddress,
      tokenId,
      transactionHash,
      chainId,
    } = req.body;

    if (!title || !description || !fileUrl || !metadataUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const nft = await Nft.create({
      userId: req.user.id,
      currentOwner: req.user.id,
      walletAddress,
      transactionHash,
      chainId,
      tokenId,
      title,
      description,
      tags,
      category,
      fileUrl,
      documentUrl: documentUrl || null,
      metadataUrl,
      verifiedBy,
      // only persist org when it is actually set by an org verification
      organization: verifiedBy === "Self" ? null : organization,
      contributors: [], // contributors handled separately if needed
      mintedAt: new Date(),
    });

    return res.status(201).json({ success: true, data: nft });
  } catch (err) {
    console.error("Create NFT Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "NFT creation failed." });
  }
};

// ─── get single NFT ──────────────────────────────────────────────────────────

export const getNftById = async (req: Request, res: Response) => {
  try {
    const nft = await Nft.findById(req.params.id)
      .populate("userId", "userName email walletAddress")
      .populate("contributors.userId", "userName email walletAddress")
 

    if (!nft) {
      return res
        .status(404)
        .json({ success: false, message: "NFT not found." });
    }

    const data = await attachStats(nft);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch NFT" });
  }
};

// ─── get all public NFTs (paginated) ────────────────────────────────────────

export const getAllNft = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
 

    // Count total BEFORE pagination so totalPages is correct
    const totalNfts = await Nft.countDocuments({ visibility: "Public" });

    const nfts = await Nft.find({ visibility: "Public" })
      .sort({ mintedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "userName email")
      .populate("contributors.userId", "userName email");

    const nftData = await Promise.all(nfts.map(attachStats));

    return res.json({
      success: true,
      message: "NFTs fetched successfully",
      data: nftData,
      page,
      totalNfts,
      totalPages: Math.ceil(totalNfts / limit),
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch NFTs" });
  }
};

// ─── get current user's NFTs ─────────────────────────────────────────────────

export const getUsersNfts = async (req: any, res: any) => {
  try {
 
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const totalNfts = await Nft.countDocuments({ currentOwner: userId });

    const nfts = await Nft.find({ currentOwner: userId })
      .sort({ mintedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("contributors.userId", "userName email walletAddress");

    const nftData = await Promise.all(nfts.map(attachStats));

    return res.status(200).json({
      success: true,
      message: "NFTs fetched for the user",
      data: nftData,
      page,
      totalNfts,
      totalPages: Math.ceil(totalNfts / limit),
    });
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching NFTs" });
  }
};

// ─── get top-valued NFTs ─────────────────────────────────────────────────────

export const getTopValuedNfts = async (req: Request, res: Response) => {
 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const nfts = await Nft.find({ visibility: "Public" })
      .populate("userId", "userName email walletAddress")
      .populate("contributors.userId", "userName email walletAddress")
      .populate("organization", "name");

    const nftData = await Promise.all(
      nfts.map(async (nft) => {
        const data = await attachStats(nft);
        // BUG FIX: was using `endorsement.length` (the imported model) instead
        // of the actual fetched `endorsements.length`
        const valueScore =
          data.likesCount * 1 +
          data.ratingData.avgRating * 5 +
          data.endorsements.length * 2;
        return { ...data, valueScore };
      })
    );

    nftData.sort((a, b) => b.valueScore - a.valueScore);

    const paginatedData = nftData.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      message: "Top valued NFTs fetched",
      data: paginatedData,
      page,
      totalNfts: nftData.length,
      totalPages: Math.ceil(nftData.length / limit),
    });
  } catch (error) {
    console.error("Error fetching top valued NFTs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching top valued NFTs" });
  }
};

 

export const getFilteredNfts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      verifiedBy,
      search,
      tags,
      page: pageStr = "1",
      limit: limitStr = "20",
    } = req.query as Record<string, string>;

    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const skip = (page - 1) * limit;

    // Build a dynamic filter
    const filter: Record<string, any> = { visibility: "Public" };

    if (category) filter.category = category;
    if (verifiedBy) filter.verifiedBy = verifiedBy;
    if (tags) filter.tags = { $in: (tags as string).split(",") };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const totalNfts = await Nft.countDocuments(filter);

    const nfts = await Nft.find(filter)
      .sort({ mintedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "userName email")
      .populate("contributors.userId", "userName email");

    const nftData = await Promise.all(nfts.map(attachStats));

    return res.status(200).json({
      success: true,
      message: "Filtered NFTs fetched",
      data: nftData,
      page,
      totalNfts,
      totalPages: Math.ceil(totalNfts / limit),
    });
  } catch (error) {
    console.error("Error filtering NFTs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error filtering NFTs" });
  }
 

// ─── update visibility ───────────────────────────────────────────────────────

export const updateNftVisibility = async (req: any, res: any) => {
  try {
    const { nftId } = req.params;
    const userId = req.user.id;
    // BUG FIX: was `const visibility = req.body` — missing `.visibility`
    const { visibility } = req.body;

    if (!["Public", "Private", "Unlisted"].includes(visibility)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid visibility value." });
    }

    const nft = await Nft.findById(nftId);
    if (!nft) {
      return res
        .status(404)
        .json({ success: false, message: "NFT not found." });
    }

    if (nft.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this NFT.",
      });
    }

    nft.visibility = visibility;
    await nft.save();

    return res.status(200).json({
      success: true,
      message: "NFT visibility updated.",
      data: { id: nft._id, visibility: nft.visibility },
    });
  } catch (error) {
    console.error("Error updating NFT visibility:", error);
    return res
      .status(500)
 
  }
};

// ─── list NFT for sale ───────────────────────────────────────────────────────

export const listNftForSale = async (req: any, res: any) => {
  try {
    const { tokenId, price } = req.body;

    if (!tokenId || !price) {
      return res
        .status(400)
        .json({ success: false, message: "tokenId and price are required." });
    }

    const nft = await Nft.findOne({ tokenId });
    if (!nft) {
      return res
        .status(404)
        .json({ success: false, message: "NFT not found." });
    }

    nft.isListed = true;
    nft.price = price;
    await nft.save();

    return res.status(200).json({
      success: true,
      message: "NFT listed for sale successfully.",
      data: { id: nft._id, tokenId: nft.tokenId, isListed: nft.isListed, price: nft.price },
    });
  } catch (error) {
    console.error("Error listing NFT for sale:", error);
    return res
 
      .json({ success: false, message: "Server error listing NFT for sale." });
  }
};

// ─── buy NFT ─────────────────────────────────────────────────────────────────

export const buyNft = async (req: any, res: any) => {
  try {
    const { tokenId, walletAddress } = req.body;

    if (!tokenId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "tokenId and walletAddress are required.",
      });
    }

    const nft = await Nft.findOne({ tokenId });
    if (!nft) {
      return res
        .status(404)
        .json({ success: false, message: "NFT not found." });
    }

    const userId = req.user.id;
    const newOwner = await User.findById(userId);

    nft.walletAddress = walletAddress;
    if (newOwner) nft.currentOwner = newOwner._id;
    nft.isListed = false;
    nft.price = "0";
    await nft.save();

    return res.status(200).json({
      success: true,
      message: "NFT ownership updated successfully.",
      data: {
        id: nft._id,
        tokenId: nft.tokenId,
        newOwnerWallet: nft.walletAddress,
        currentOwner: nft.currentOwner,
      },
    });
  } catch (error) {
    console.error("Error buying NFT:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while buying NFT." });
  }
};