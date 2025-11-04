import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../api";
import toast from "react-hot-toast";
import { setLoading, setToken, setUser } from "@/slices/user";
import type {AppDispatch} from "../../main"

const {
    LOGIN_API,
    SIGNUP_API,
    SEND_OTP_API,
    CHECK_USERNAME_API
} = authEndpoints;

export function sendOtp(email:string, navigate:(path:string)=>void){
    return async (dispatch: AppDispatch)=>{
        const toasId = toast.loading("Loading...");
        dispatch(setLoading({key:"auth", value:true}));

        try {
            const response = await apiConnector("POST", SEND_OTP_API,{email});
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("OTP sent Successfully");
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
            toast.error("Could not send OTP");
        }
        dispatch(setLoading({key:"auth", value:false}));
        toast.dismiss(toasId);
    }
}

export function signUp(userName:string,email:string,password:string,confirmPassword:string,role:string,otp:string,navigate:(path:string)=>void){
    return async (dispatch: AppDispatch) =>{
        const toasId = toast.loading("Loading...");
        dispatch(setLoading({key:"auth", value:true}));
        console.log(userName);
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                role,
                userName,
                email,
                password,
                confirmPassword,
                otp
            })
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful");
            navigate("/login");
        } catch (error) {
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading({key:"auth", value:false}));
        toast.dismiss(toasId);
    }
}

export function login(email:string, password:string, navigate:(path:string)=>void){
    return async (dispatch: AppDispatch) =>{
        const toasId = toast.loading("Loading...");
        dispatch(setLoading({key:"auth", value:true}));
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            });
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.dismiss(toasId);
            toast.success("Login Successful");
            dispatch(setToken(response.data.token));
            const userImage = response.data?.user?.profileImage ? response.data.user.profileImage : 
            `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.userName}`;
            dispatch(setUser({ ...response.data.user, profileImage:userImage}));
            console.log("token-->",response.data.token);
            localStorage.setItem("token",  JSON.stringify(response.data.token));
            localStorage.setItem("user",  JSON.stringify({...response.data.user, profileImage:userImage}));
            navigate("/dashboard")
        } catch (error) {
            console.log(error);
            toast.dismiss(toasId);
            toast.error("Could not login");
        }
        dispatch(setLoading({key:"auth", value:false}));
    }
}

export function logOut(navigate:(path:string)=>void){
    return async (dispatch: AppDispatch) =>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Loged Out");
        navigate("/");
    }
}
export async function checkUserName(userName: string): Promise<boolean | null> {
    console.log("userName: ",userName);
  try {
    const response = await apiConnector(
      "GET",
      CHECK_USERNAME_API,
      null,               
      null,               
      { userName: userName }        
    );

    return response.data.available; 
  } catch (error) {
    console.error("Error checking username:", error);
    toast.error("Failed to check username");
    return null;
  }
}