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
export interface SignupData {
    email: string | null
    password: string | null
    confirmPassword: string | null
    role: string | null
    userName: string | null
}
interface UserState {
    user: User | null
    token: string | null
    loading: {
    auth: boolean
    profile: boolean
    friends: boolean
  }
    error: string | null
    signupData: SignupData | null
}

const initialState: UserState = {
    user: null,
    loading: {
    auth: false,
    profile: false,
    friends: false,
    },
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
    error: null,
    signupData: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action : PayloadAction<User | null>){
            state.user = action.payload
            state.error = null
        },
        setToken(state, action : PayloadAction<string | null>){
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem("token", action.payload);
            }
        },
       setLoading(state, action: PayloadAction<{ key: keyof UserState['loading'], value: boolean }>) {
          const { key, value } = action.payload;
          state.loading[key] = value;
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
        },
        setSignupData(state, action:PayloadAction<SignupData | null>){
            state.signupData = action.payload
        }
    }
})

export const {
    setUser,
    setToken,
    setError,
    setLoading,
    clearUser,
    updateUser,
    setSignupData
} = userSlice.actions;

export default userSlice.reducer;
