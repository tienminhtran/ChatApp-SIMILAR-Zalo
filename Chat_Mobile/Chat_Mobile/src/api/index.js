
export const chatApi = {    
    login: () => '/api/v1/auth/sign-in',
    logout: () => '/api/v1/auth/logout',
    signUp: () => '/api/v1/auth/sign-up',
    refreshToken: () => '/api/v1/auth/refresh-token',
    sendOtp: () => '/api/v1/auth/send-otp',
    verifyOtp: () => '/api/v1/auth/verify-otp-sns',
    changePassword: () => '/api/v1/user/change-password',
    
}