import React, { useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { useAppDispatch } from "@/main";
import { checkUserName, sendOtp } from "@/services/operations/user";
import toast from "react-hot-toast";
import { setSignupData } from "@/slices/user";

const SignUpCard: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  // const [userRole, setUserRole] = useState("User"); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignUp = (e:FormEvent<HTMLFormElement>) =>{
    console.log("hii");
    e.preventDefault();
    if(password!==confirmPassword){
      toast.error("Passwords Do Not Match");
      return;
    }

    const signupData = {
      userName: username,
      email,
      password,
      confirmPassword,
      role:"User"
    }
    dispatch(setSignupData(signupData));
    dispatch(sendOtp(email,navigate));
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
  const handleBlur = async ()=>{
      if (!username.trim()) return;
  const available = await checkUserName(username);
  setIsAvailable(available);
  }
  return (
    <div className="bg-gray-950 flex justify-center flex-col lg:flex-row h-[100%]">
      {/* Left Column for Signup Form */}
      <div className="flex justify-center items-center w-[50%]">
        
        <Card className="w-full max-w-[500px] shadow-2xl border border-gray-700 bg-gray-800 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-3xl font-bold text-center">Create Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}
            className="space-y-6">
              <div className="flex justify-between">
                 <div>
                <Label htmlFor="username" className="text-gray-300 text-sm font-medium mb-1 block">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="john.doe"
                  className="mt-1 pr-10 bg-gray-700 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                  onBlur={handleBlur}
                />
                {isAvailable === false && (
  <p className="text-red-500 text-sm">Username is already taken</p>
)}
{isAvailable === true && (
  <p className="text-green-500 text-sm">Username is available</p>
)}
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium mb-1 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 pr-10 bg-gray-700 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
              </div>
              </div>
              <div className="flex justify-between">
                <div className="relative">
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium mb-1 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 pr-10 bg-gray-700 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium mb-1 block">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 pr-10 bg-gray-700 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-gray-400 hover:text-gray-200"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              </div>

              {/* {error && (
                <p className="text-red-400 text-sm text-center" role="alert">
                  {error}
                </p>
              )}
              {successMessage && (
                <p className="text-green-400 text-sm text-center" role="alert">
                  {successMessage}
                </p>
              )} */}

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </Button>
            </form>
            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-400 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

     <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex justify-center items-center p-4 lg:flex rounded-xl h-[60%] my-auto mr-20">
        <img
          src="https://placehold.co/600x400/374151/D1D5DB?text=Your+Awesome+Image"
          alt="Login Page Visual"
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default SignUpCard;
