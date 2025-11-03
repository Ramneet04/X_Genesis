import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/main";
import { Button } from "@/components/ui/button";

interface NFT {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  listed: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const { address } = useAppSelector((state) => state.wallet);
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    setNfts([
      { _id: "1", title: "AI Art", description: "Cool generative art", fileUrl: "https://via.placeholder.com/300", listed: true },
      { _id: "2", title: "Project NFT", description: "My portfolio project", fileUrl: "https://via.placeholder.com/300", listed: false },
      { _id: "3", title: "Certificate NFT", description: "Completion badge", fileUrl: "https://via.placeholder.com/300", listed: false },
    ]);
  }, []);

  const listedNfts = nfts.filter((nft) => nft.listed);
  const unlistedNfts = nfts.filter((nft) => !nft.listed);

  const handleListNft = (id: string) => {
    console.log("Listing NFT:", id);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* PROFILE SECTION */}
        <section
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-md">
            {user?.userName?.charAt(0)?.toUpperCase() || "U"}
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
            <p className="text-gray-500 italic">No NFTs listed yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listedNfts.map((nft) => (
                <div
                  key={nft._id}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-indigo-500/20 transition-all"
                >
                  <img
                    src={nft.fileUrl}
                    alt={nft.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold">{nft.title}</h4>
                    <p className="text-gray-400 text-sm">{nft.description}</p>
                    <div className="text-green-400 font-medium pt-1">Listed ✅</div>
                  </div>
                </div>
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
                <div
                  key={nft._id}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-yellow-500/20 transition-all"
                >
                  <img
                    src={nft.fileUrl}
                    alt={nft.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <h4 className="text-lg font-semibold">{nft.title}</h4>
                    <p className="text-gray-400 text-sm">{nft.description}</p>
                    <Button
                      onClick={() => handleListNft(nft._id)}
                      className="w-full bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-all"
                    >
                      List NFT
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
