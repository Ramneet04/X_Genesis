import {combineReducers} from "@reduxjs/toolkit"
import userSlice from "../slices/user"
import walletSlice from "../slices/wallet"
import nftSlice from "../slices/nft"
const rootReducer = combineReducers({
    user: userSlice,
    wallet: walletSlice,
    nft: nftSlice
});
export default rootReducer;