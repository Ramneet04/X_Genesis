import type React from "react";
// import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/main";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/services/operations/user";


const ProfileDropDown:React.FC = ()=>{
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const logoutHandler = ()=>{
        dispatch(logOut(navigate));
    }
    return (
        <div>
            Profile
            <Button onClick={logoutHandler}>Log-out</Button>
        </div>
    )
}
export default ProfileDropDown;