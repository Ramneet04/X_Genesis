import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { useAppDispatch } from "@/main";
import { login } from "@/services/operations/user";

const LoginCard: React.FC = () => {
  const [formData, setFormData] = useState({
    email:"",
    password: ""
  });
  const handleOnChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setFormData((prevData)=>({
      ...prevData,
      [e.target.name]:e.target.value
    }))
  }
  const {email, password} = formData;
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleOnSubmit = (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    dispatch(login(email,password,navigate));
  }

  return (
    <div className="h-screen overflow-y-hidden bg-gray-950 flex flex-col lg:flex-row">
      {/* Left Column for Login Form */}
      <div className="flex justify-center items-center p-4 w-[50%]">
        <Card className="w-full max-w-md shadow-2xl border border-gray-700 bg-gray-800 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-3xl font-bold text-center">Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOnSubmit}
            className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium mb-1 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                  placeholder="Enter your email"
                  className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                  aria-describedby="email-error"
                />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium mb-1 block">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Enter your password"
                  className="mt-1 pr-10 bg-gray-700 text-white border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                  required
                  aria-describedby="password-error"
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

              <Button
                type="submit"
                className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Login
              </Button>
            </form>
            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-yellow-400 hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex justify-center items-center p-4 lg:flex rounded-xl h-[60%] my-auto">
        <img
          src="https://placehold.co/600x400/374151/D1D5DB?text=Your+Awesome+Image"
          alt="Login Page Visual"
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default LoginCard;
