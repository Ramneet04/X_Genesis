import { useEffect, useState, type FormEvent } from 'react'
import OTPInput from 'react-otp-input';
import { Link, useNavigate, } from 'react-router-dom';
import { FaClockRotateLeft } from "react-icons/fa6";
import { IoArrowBackSharp } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from '@/main';
import { sendOtp, signUp } from '@/services/operations/user';
const VerifyEmail = () => {
    const {signupData} = useAppSelector((state) => state.user );
    const authLoading = useAppSelector((state) => state.user.loading.auth);
    const [otp, setOtp] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!signupData){
            navigate("/signup");
        }
    },[signupData, navigate])
    if (!signupData) {
  navigate("/signup");
  return null;
}
    const {
        userName,
        email,
        password,
        confirmPassword,
        role
    } = signupData!;

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(signUp(
             userName ?? "",
             email ?? "",
             password ?? "",
             confirmPassword ?? "",
             role ?? "User", 
             otp ?? "",
            navigate
        ));
    }
  return (
    <div className='flex justify-center items-center h-[100%] my-auto mx-auto'>
        {
            authLoading ? (
                <div>Loading ...</div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-sky-600 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-200">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleOnSubmit}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-gray-400 flex items-center gap-x-2">
                <IoArrowBackSharp /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-600 gap-x-2"
              onClick={() => dispatch(sendOtp(email ?? "",navigate))}
            >
              <FaClockRotateLeft />
              Resend it
            </button>
          </div>
        </div>
            )
        }
    </div>
  )
}

export default VerifyEmail