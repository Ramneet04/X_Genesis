import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FriendRequest {
    from: string
    sentAt: string
    status: 'pending' | 'accepted' | 'rejected'
};
export interface User {
    _id: string
  userName: string
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  walletAddress?: string | null
  role: 'User' | 'Recruiter' | 'OrgAdmin' | 'OrgUser' | 'SuperAdmin'
  resetPasswordExpires?: string | null
  profileImage?: string | null
  bio?: string | null
  country?: string | null
  language: string
  credentials: string[]
  pendingNfts: string[]
  company?: string | null
  designation?: string | null
  isVerified: boolean
  nftToken?: string | null
  createdAt?: string
  lastLogin?: string
  friends: string[]
  friendRequests: FriendRequest[]
}

interface UserState {
    user: User | null
    token: string | null
    loading: boolean,
    error: string | null
}

const initialState: UserState = {
    user: null,
    loading: false,
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
    error: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action : PayloadAction<User>){
            state.user = action.payload
            state.error = null
        },
        setToken(state, action : PayloadAction<string>){
            state.token = action.payload;
            localStorage.setItem("token", action.payload)
        },
        setLoading(state, action: PayloadAction<boolean>){
            state.loading = action.payload
        },
        setError(state, action: PayloadAction<string | null>){
            state.error = action.payload
        },
        clearUser(state){
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
        },
        updateUser(state, action:PayloadAction<Partial<User>>){
            if(state.user){
                state.user = {...state.user, ...action.payload};
            }
        }
    }
})

export const {
    setUser,
    setToken,
    setError,
    setLoading,
    clearUser,
    updateUser
} = userSlice.actions;

export default userSlice.reducer;
