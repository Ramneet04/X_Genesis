// components/shared/ProfileDropDown.tsx
import type React from "react";
import { useAppDispatch, useAppSelector } from "@/main";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/services/operations/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfileDropDown: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const greetings = ["👋", "😊", "🚀", "💻", "🌟", "🏆", "🧭"];
  const randomEmoji = greetings[Math.floor(Math.random() * greetings.length)];
  const logoutHandler = () => {
    dispatch(logOut(navigate));
  };

  if (!user) return null;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-[2px] border border-gray-800 hover:ring-2 hover:ring-gray-600 transition focus-visible:outline-none"
            title="Open Profile Menu"
          >
            <img
              src={user.profileImage || "/placeholder.png"}
              alt="Profile"
              className="aspect-square w-[38px] rounded-full object-cover shadow-sm"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-52 bg-black text-gray-200 shadow-xl border border-gray-900 rounded-2xl"
          align="end"
        >
          <DropdownMenuLabel className="text-gray-400 text-sm px-3 py-1">
           Hello, {user.firstName || user.userName} {randomEmoji}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem asChild>
            <button
             onClick={() => navigate("/dashboard")}
             className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors duration-200"
           >
             My Dashboard
           </button>
                   </DropdownMenuItem>
                   <DropdownMenuItem asChild>
           <button
             onClick={() => navigate("/settings")}
             className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors duration-200"
           >
             Settings
           </button>
         </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            onClick={logoutHandler}
            className="px-3 py-2 rounded-md text-red-500 font-medium hover:bg-red-600 hover:text-white transition-all duration-200 cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropDown;
