import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/main";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { apiConnector } from "@/services/apiConnector";
import { setLoading, setNfts } from "@/slices/nft";

const Dashboard: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.user);
  const { address } = useAppSelector((state) => state.wallet);
  // const [nfts, setNfts] = useState<NFT[]>([]);
  const {nfts} = useAppSelector((state)=>state.nft);
  const dispatch = useAppDispatch();

  useEffect(()=> {
    const fetchUserNfts = async () => {
      console.log("hello");
      dispatch(setLoading(true));
      try {
          const response = await apiConnector("GET", `${import.meta.env.VITE_API_BASE_URL}/nft/user-nfts?page=1&limit=10`,null,
          { Authorization: `Bearer ${token}` }
          );
          console.log(response);
          if (response.data.success) {
            dispatch(setNfts(response.data.data));
          }
      } catch (error) {
          console.error("Error fetching NFTs:", error);
      }
      dispatch(setLoading(false));
    }
    fetchUserNfts();
  }, []);

  const listedNfts = nfts.filter((n) => n.isListed);
  const unlistedNfts = nfts.filter((n) => !n.isListed);

  const handleListNft = (id: string) => {
    console.log("Listing NFT:", id);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* PROFILE SECTION */}
        <section className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg">
          <div className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md">
              <img src={user?.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-1">{user?.userName || "User Name"}</h2>
            <p className="text-gray-400 mb-1">{user?.email || "user@email.com"}</p>
            <p className="text-sm text-gray-500">
              Wallet:{" "}
              <span className="text-indigo-400 font-mono">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
              </span>
            </p>
          </div>

          <Button className="bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl px-6">
            Edit Profile
          </Button>
        </section>

        {/* LISTED NFTs */}
        <section>
          <h3 className="text-2xl font-semibold mb-5 border-l-4 border-green-500 pl-3">
            Listed NFTs
          </h3>

          {listedNfts.length === 0 ? (
            <p className="text-gray-600 rounded-xl italic">No NFTs listed yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listedNfts.map((nft) => (
                <Dialog key={nft._id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-green-500/20 transition-all">
                      <div>
                        <img src={nft.fileUrl} alt={nft.title} className="w-full h-48 object-center" />
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-lg font-semibold">{nft.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">{nft.description}</p>
                        <div className="text-green-400 font-medium pt-1">Listed ✅</div>
                      </div>
                    </div>
                  </DialogTrigger>

                  {/* NFT DETAIL POPUP */}
                  <DialogContent className="max-w-lg bg-gray-900 border border-gray-700 text-gray-100  rounded-2xl shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{nft.title}</DialogTitle>
                      <DialogDescription>{nft.category}</DialogDescription>
                    </DialogHeader>

                    <img
                      src={nft.fileUrl}
                      alt={nft.title}
                      className="w-full h-64 object-cover rounded-xl my-4"
                    />

                    <div className="space-y-2 text-sm">
                      <p><strong>Description:</strong> {nft.description}</p>
                      <p><strong>Verified By:</strong> {nft.verifiedBy}</p>
                      <p><strong>Owner:</strong> {nft.walletAddress}</p>
                      <p><strong>Transaction:</strong> {nft.transactionHash.slice(0, 12)}...</p>
                      <p><strong>Chain ID:</strong> {nft.chainId}</p>
                      <p><strong>Visibility:</strong> {nft.visibility}</p>
                      <p><strong>Price:</strong> {nft.price} {nft.currency}</p>
                      <p><strong>Minted At:</strong> {new Date(nft.mintedAt).toLocaleString()}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </section>

        {/* UNLISTED NFTs */}
        <section>
          <h3 className="text-2xl font-semibold mb-5 border-l-4 border-yellow-500 pl-3">
            Unlisted NFTs
          </h3>

          {unlistedNfts.length === 0 ? (
            <p className="text-gray-500 italic">All NFTs are listed.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {unlistedNfts.map((nft) => (
                <Dialog key={nft._id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-yellow-500/20 transition-all">
                      <div className="h-[220px] rounded-xl">
                        <img src={nft.fileUrl} alt={nft.title} className="w-full h-full" />
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-lg font-semibold">{nft.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">{nft.description}</p>
                        <Button
                          onClick={() => handleListNft(nft._id)}
                          className="w-full bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-all"
                        >
                          List NFT
                        </Button>
                      </div>
                    </div>
                  </DialogTrigger>

                  {/* NFT DETAIL POPUP */}
                  <DialogContent className="max-w-lg bg-gray-900 border border-gray-700 text-gray-100 rounded-2xl shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{nft.title}</DialogTitle>
                      <DialogDescription>{nft.category}</DialogDescription>
                    </DialogHeader>

                    <div className="h-[280px] mb-4" >
                      <img
                      src={nft.fileUrl}
                      alt={nft.title}
                      className="w-full h-full object-center rounded-xl"
                    />
                    </div>

                    <div className="space-y-2 text-sm">
                      <p><strong>Description:</strong> {nft.description}</p>
                      <p><strong>Verified By:</strong> {nft.verifiedBy}</p>
                      <p><strong>Owner:</strong> {nft.walletAddress}</p>
                      <p><strong>Transaction:</strong> {nft.transactionHash.slice(0, 12)}...</p>
                      <p><strong>Chain ID:</strong> {nft.chainId}</p>
                      <p><strong>Visibility:</strong> {nft.visibility}</p>
                      <p><strong>Minted At:</strong> {new Date(nft.mintedAt).toLocaleString()}</p>
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

export default Dashboard;
