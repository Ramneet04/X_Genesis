import { useAppDispatch, useAppSelector } from "@/main";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BrowserProvider, ethers } from "ethers";
import { resetWallet, setWallet } from "@/slices/wallet";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/services/contract";
import { RefreshCcw } from "lucide-react";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const WalletConnectButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAppSelector((state) => state.wallet);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("✅ MetaMask detected");
    } else {
      console.warn("❌ MetaMask not available");
    }
  }, []);

  const ensureSepoliaNetwork = async () => {
    const sepoliaChainId = "0xaa36a7"; // 11155111 in hex

    const currentChainId = await window.ethereum!.request({
      method: "eth_chainId",
    });

    if (currentChainId !== sepoliaChainId) {
      try {
        await window.ethereum!.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: sepoliaChainId }],
        });
        toast.success("Switched to Sepolia Network ✅");
      } catch (switchError: any) {
        // If the Sepolia network is not added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum!.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: sepoliaChainId,
                  chainName: "Sepolia Test Network",
                  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.sepolia.org"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
            toast.success("Added Sepolia Network ✅");
          } catch (addError) {
            console.error("Failed to add Sepolia:", addError);
            toast.error("Failed to switch to Sepolia");
            throw addError;
          }
        } else {
          console.error("Switch network error:", switchError);
          toast.error("Please switch to Sepolia network manually");
          throw switchError;
        }
      }
    }
  };

  const handleConnect = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found!");
      return;
    }

    try {
      await ensureSepoliaNetwork(); // 🧠 Ensure Sepolia before connecting

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const network = await provider.getNetwork();

      dispatch(setWallet({ address: userAddress, chainid: network.chainId.toString() }));

      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);

      console.log("✅ Wallet connected:", userAddress);
      toast.success("Wallet connected to Sepolia");
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      toast.error("Wallet connection failed");
    }
  };

  const handleDisconnect = () => {
    dispatch(resetWallet());
    setContract(null);
    toast.success("Wallet disconnected");
  };
  const changeWallet = async () => {
    if(!window.ethereum) {
      toast.error("MetaMask not found!");
      return;
    }
  try {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });

const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (!accounts || accounts.length === 0) {
      toast.error("No accounts found after permission request.");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const network = await provider.getNetwork();

    // ✅ Update your Redux state
    dispatch(setWallet({ address: userAddress, chainid: network.chainId.toString() }));

    toast.success("Wallet switched successfully");
    // update your redux/store here
  } catch (error) {
    console.error("User denied permission:", error);
  }
};


  return (
    <>
      {isConnected && address ? (
        <div className="flex gap-2">
          <button
          onClick={handleDisconnect}
          className="px-3 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-xl transition duration-200"
        >
          Disconnect ({address.slice(0, 6)}...{address.slice(-4)})
        </button>
         <button onClick={changeWallet} className=" text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 rounded-xl p-2 flex items-center justify-center">
            <RefreshCcw/>
       </button>
        </div>

      ) : (
        <button
          onClick={handleConnect}
          className="px-3 py-2 bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800
          hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition duration-200"
        >
          Connect Wallet
        </button>
      )}
    </>
  );
};

export default WalletConnectButton;
