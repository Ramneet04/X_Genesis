const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authEndpoints = {
    SIGNUP_API: `${BASE_URL}/auth/signup`,
    LOGIN_API: `${BASE_URL}/auth/login`,
    SEND_OTP_API: `${BASE_URL}/auth/send-otp`,
    CHECK_USERNAME_API: `${BASE_URL}/auth/check-username`
}