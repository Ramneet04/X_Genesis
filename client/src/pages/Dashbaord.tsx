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
import { apiConnector } from "@/services/apiConnector";
import { setLoading, setNfts } from "@/slices/nft";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { getContractInstance } from "@/utils/getContract";

const Dashboard: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.user);
  const { address } = useAppSelector((state) => state.wallet);
  const { nfts } = useAppSelector((state) => state.nft);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const dispatch = useAppDispatch();

  const [listDialog, setListDialog] = useState<any>(null);
  const [priceNft, setPriceNft] = useState<string>("");

  const handleOpenPriceDialog = (nft: any) => {
    setListDialog(nft);
  };
  const fetchUserNfts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiConnector(
          "GET",
          `${import.meta.env.VITE_API_BASE_URL}/nft/user-nfts?page=1&limit=10`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        if (response.data.success) {
          dispatch(setNfts(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
      dispatch(setLoading(false));
    };
  useEffect(() => {
    fetchUserNfts();
  }, []);

  const listedNfts = nfts.filter((n) => n.isListed);
  const unlistedNfts = nfts.filter((n) => !n.isListed);

  const handleConfirmListing = async () => {
    if(!address){
      toast.error("Connect your wallet first");
      return;
    }
    if (!listDialog || !priceNft) return;
    const toastId = toast.loading("Listing NFT...");
    try {
      console.log("Listing NFT:", listDialog.tokenId, "Price:", priceNft);
      const priceInWei = ethers.parseEther(priceNft.toString());
      const contractInstance = await getContractInstance();
      setContract(contractInstance);

      if (!contract) {
        toast.dismiss(toastId);
        toast.error("Contract not initialized");
        return;
      }
      try {
        const listingTx = await contract.listing(
        listDialog.tokenId,
        priceInWei
      );
      await listingTx.wait();
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Blockchain transaction failed");
        console.error("Blockchain transaction error:", error);
        return;
      }
      console.log("NFT listed on blockchain:", listDialog.tokenId);
      await apiConnector("POST", `${import.meta.env.VITE_API_BASE_URL}/nft/list`, {
        tokenId: listDialog.tokenId,
        price: priceNft,
      }, { Authorization: `Bearer ${token}` });

      setListDialog(null);
      setPriceNft("");
      toast.dismiss(toastId);
      toast.success("NFT listed!");
      await fetchUserNfts();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error listing NFT");
      console.error("Error listing NFT:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* PROFILE SECTION */}
        <section className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-md">
            <img
              src={user?.profileImage}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-1">
              {user?.userName || "User Name"}
            </h2>
            <p className="text-gray-400 mb-1">{user?.email || "user@email.com"}</p>
            <p className="text-sm text-gray-500">
              Wallet:{" "}
              <span className="text-indigo-400 font-mono">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Not connected"}
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
                      <img
                        src={nft.fileUrl}
                        alt={nft.title}
                        className="w-full h-48 object-center"
                      />
                      <div className="p-4 space-y-2">
                        <h4 className="text-lg font-semibold">{nft.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {nft.description}
                        </p>
                        <div className="text-gray-600 pt-1">
                          Price: {nft.price} {nft.currency}
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg bg-gray-900 border border-gray-700 text-gray-100 rounded-2xl shadow-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {nft.title}
                      </DialogTitle>
                      <DialogDescription>{nft.category}</DialogDescription>
                    </DialogHeader>

                    <img
                      src={nft.fileUrl}
                      alt={nft.title}
                      className="w-full h-64 object-cover rounded-xl my-4"
                    />

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Description:</strong> {nft.description}
                      </p>
                      <p>
                        <strong>Verified By:</strong> {nft.verifiedBy}
                      </p>
                      <p>
                        <strong>Owner:</strong> {nft.walletAddress}
                      </p>
                      <p>
                        <strong>Transaction:</strong>{" "}
                        {nft.transactionHash.slice(0, 12)}...
                      </p>
                      <p>
                        <strong>Chain ID:</strong> {nft.chainId}
                      </p>
                      <p>
                        <strong>Visibility:</strong> {nft.visibility}
                      </p>
                      <p>
                        <strong>Price:</strong> {nft.price} {nft.currency}
                      </p>
                      <p>
                        <strong>Minted At:</strong>{" "}
                        {new Date(nft.mintedAt).toLocaleString()}
                      </p>
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
                        <img
                          src={nft.fileUrl}
                          alt={nft.title}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-lg font-semibold">{nft.title}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {nft.description}
                        </p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPriceDialog(nft);
                          }}
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
                      <DialogTitle className="text-2xl font-bold">
                        {nft.title}
                      </DialogTitle>
                      <DialogDescription>{nft.category}</DialogDescription>
                    </DialogHeader>

                    <div className="h-[280px] mb-4">
                      <img
                        src={nft.fileUrl}
                        alt={nft.title}
                        className="w-full h-full object-center rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Description:</strong> {nft.description}
                      </p>
                      <p>
                        <strong>Verified By:</strong> {nft.verifiedBy}
                      </p>
                      <p>
                        <strong>Owner:</strong> {nft.walletAddress}
                      </p>
                      <p>
                        <strong>Transaction:</strong>{" "}
                        {nft.transactionHash.slice(0, 12)}...
                      </p>
                      <p>
                        <strong>Chain ID:</strong> {nft.chainId}
                      </p>
                      <p>
                        <strong>Visibility:</strong> {nft.visibility}
                      </p>
                      <p>
                        <strong>Minted At:</strong>{" "}
                        {new Date(nft.mintedAt).toLocaleString()}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* PRICE INPUT DIALOG */}
      <Dialog open={!!listDialog} onOpenChange={() => setListDialog(null)}>
        <DialogContent className="max-w-md bg-gray-900 border border-gray-700 text-gray-100 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">List NFT for Sale</DialogTitle>
            <DialogDescription>
              Set a price for{" "}
              <span className="text-yellow-400 font-semibold">
                {listDialog?.title}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <img
              src={listDialog?.fileUrl}
              alt={listDialog?.title}
              className="w-full h-48 object-cover rounded-xl"
            />

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Price (ETH)
              </label>
              <input
                type="number"
                value={priceNft}
                onChange={(e) => setPriceNft(e.target.value)}
                className="w-full pl-3 h-10 bg-gray-800 text-gray-100 border border-gray-700 rounded-xl focus:ring-0 focus:outline-none 
             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Enter price..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setListDialog(null)}
                className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmListing}
                className="bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white"
              >
                Confirm Listing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
