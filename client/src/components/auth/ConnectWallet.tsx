import { useAppDispatch, useAppSelector } from "@/main";
import type React from "react";
import toast from "react-hot-toast";
import {BrowserProvider } from "ethers"
import { resetWallet, setWallet } from "@/slices/wallet";
import type { MetaMaskInpageProvider  } from "@metamask/providers";
import { useEffect } from "react";


declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}
const WalletConnectButton:React.FC = ()=>{
    const dispatch = useAppDispatch();
    const { address, isConnected } = useAppSelector((state)=>state.wallet);
    useEffect(() => {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is available ✅");
  } else {
    console.warn("MetaMask is not available ❌");
  }
}, []);
    
    const handleConnect = async ()=>{
        console.log("hi");
        if(!window.ethereum){
            toast.error("MetaMask not found!");
            return;
        }
        console.log("hello");
        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            dispatch(setWallet({address, chainid:network.chainId.toString()}));
            toast.success("Wallet connected")
        } catch (error) {
            console.error("Wallet connection failed:", error);
            toast.error("Wallet connection failed");
        }
    }

    const handleDisconnect = ()=>{
        dispatch(resetWallet());
        toast.success("Wallet disconnected")
    }
    return (
        <>
      {isConnected && address ? (
        <button
          onClick={handleDisconnect}
          className="px-3 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-xl transition duration-200"
        >
          Disconnect ({address.slice(0, 6)}...{address.slice(-4)})
        </button>
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
    )
}
export default WalletConnectButton;