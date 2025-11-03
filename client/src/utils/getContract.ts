import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/services/contract";

export const getContractInstance = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }

  // Create a provider and signer
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Create contract instance
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  return contract;
};
