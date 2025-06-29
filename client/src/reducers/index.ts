import {combineReducers} from "@reduxjs/toolkit"
import userSlice from "../slices/user"
import walletSlice from "../slices/wallet"
const rootReducer = combineReducers({
    user: userSlice,
    wallet: walletSlice
});
export default rootReducer;