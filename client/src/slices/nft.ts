import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Nft = {
  _id: string;
  userId: string;
  currentOwner: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  fileUrl: string;
  metadataUrl: string;
  verifiedBy: string;
  walletAddress: string;
  organization: string | null;
  tokenId: number;
  transactionHash: string;
  chainId: number;
  isListed: boolean;
  mintedAt: string;
  contributors: string[];
  visibility: "Public" | "Private";
  price: number;
  currency: string;
  __v: number;
};

type NftState = {
  nfts: Nft[];
  loading: boolean;
  error: string | null;
};

const initialState: NftState = {
  nfts: [],
  loading: false,
  error: null,
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    setNfts(state, action: PayloadAction<Nft[]>) {
      state.nfts = action.payload;
    },
    addNft(state, action: PayloadAction<Nft>) {
      state.nfts.push(action.payload);
    },
    updateNft(state, action: PayloadAction<Nft>) {
      const index = state.nfts.findIndex(nft => nft._id === action.payload._id);
      if (index !== -1) state.nfts[index] = action.payload;
    },
    removeNft(state, action: PayloadAction<string>) {
      state.nfts = state.nfts.filter(nft => nft._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setNfts, addNft, updateNft, removeNft, setLoading, setError } =
  nftSlice.actions;

export default nftSlice.reducer;
