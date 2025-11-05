import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/main";
import { apiConnector } from "@/services/apiConnector";
import toast from "react-hot-toast";
import { getContractInstance } from "@/utils/getContract";
import { ethers } from "ethers";

interface NFT {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  walletAddress: string;
  price: string;
  currency: string;
  userId?: {
    userName?: string;
    email?: string;
    walletAddress?: string;
  };
  isListed?: boolean;
  tokenId: string;
}

const NFTGallery: React.FC = () => {
  const { address } = useAppSelector((state) => state.wallet);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const token = useAppSelector((state) => state.user.token);
  const fetchNFTs = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          `${import.meta.env.VITE_API_BASE_URL}/nft/all-nfts?page=1&limit=20`
        );

        if (response.data.success) {
          const listedNfts = response.data.data.filter(
            (nft: NFT) => nft.isListed === true
          );
          setNfts(listedNfts);
        } else {
          toast.error("Failed to load NFTs");
        }
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        toast.error("Something went wrong while loading NFTs");
      }
      setLoading(false);
    };

  useEffect(() => {
    fetchNFTs();
  }, []);
  const handleBuy = async (nft: NFT) => {
    if (!address) {
      toast.error("Please connect your wallet to buy.");
      return;
    }

    const contractInstance = await getContractInstance();
    setContract(contractInstance);
    if(!contractInstance){
        toast.error("Contract not initialized");
        return;
    }
    const toastId = toast.loading("Processing your purchase...");
    try {
        const tx= await contractInstance.buyNFT(nft.tokenId, {
        value: ethers.parseEther(nft.price.toString())
    });
    await tx.wait();
    await apiConnector("POST", `${import.meta.env.VITE_API_BASE_URL}/nft/buy`, {
            tokenId: nft.tokenId,
            walletAddress: address
          }, { Authorization: `Bearer ${token}` });
        toast.dismiss(toastId);
        toast.success(`Bought ${nft.title} for ${nft.price} ${nft.currency}`);
    } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to process purchase");
        console.error("Purchase error:", error);
    }
    await fetchNFTs();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-300 flex items-center justify-center">
        <p>Loading NFTs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <section>
          <h2 className="text-3xl font-semibold mb-6 border-l-4 border-indigo-500 pl-3">
            NFT Gallery
          </h2>

          {nfts.length === 0 ? (
            <p className="text-gray-500 italic">No NFTs available for sale.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nfts.map((nft) => (
                <Dialog key={nft._id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-indigo-500/20 transition-all">
                      <div className="h-[220px] overflow-hidden">
                        <img
                          src={nft.fileUrl}
                          alt={nft.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-lg font-semibold">{nft.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {nft.description}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-indigo-400 font-medium">
                            {nft.price} {nft.currency || "ETH"}
                          </span>

                          {address?.toLowerCase() ===
                          nft.walletAddress?.toLowerCase() ? (
                            <Button
                              disabled
                              className="bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl"
                            >
                              Your NFT
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuy(nft);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
                            >
                              Buy
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>

                  {/* NFT Details Dialog */}
                  <DialogContent className="max-w-lg bg-gray-900 border border-gray-700 text-gray-100 rounded-2xl shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {nft.title}
                      </DialogTitle>
                      <DialogDescription>
                        {nft.userId?.userName || "Unknown Creator"}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="h-[280px] mb-4">
                      <img
                        src={nft.fileUrl}
                        alt={nft.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Description:</strong> {nft.description}
                      </p>
                      <p>
                        <strong>Owner:</strong>{" "}
                        <span className="text-indigo-400 font-mono">
                          {nft.walletAddress
                            ? `${nft.walletAddress.slice(0, 6)}...${nft.walletAddress.slice(-4)}`
                            : "Unknown"}
                        </span>
                      </p>
                      <p>
                        <strong>Price:</strong> {nft.price} {nft.currency || "ETH"}
                      </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                      {address?.toLowerCase() ===
                      nft.walletAddress?.toLowerCase() ? (
                        <Button
                          disabled
                          className="bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl"
                        >
                          You Own This
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleBuy(nft)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
                        >
                          Buy Now
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NFTGallery;
