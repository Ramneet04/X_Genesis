import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WalletState = {
    address: string | null
    chainId: string | null
    isConnected: boolean
}

const initialState: WalletState = {
    address: null,
    chainId: null,
    isConnected: false,
}

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWallet(state, action:PayloadAction<{address: string, chainid: string}>){
            state.address = action.payload.address
            state.chainId = action.payload.chainid
            state.isConnected = true
        },
        resetWallet(state){
            state.address = null
            state.chainId = null
            state.isConnected = false
        }
    }
})

export const {
    setWallet,
    resetWallet
} = walletSlice.actions;
export default walletSlice.reducer;