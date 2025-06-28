import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, removeToken } from '../utils/authHelper';
import { useNavigation } from '@react-navigation/native';
import { sendOtp, verifyOtp } from '../api/authApi';
import { getCurrentUser } from '../api/userApi';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    const sendOTP = async (phone) => {
        try {
           const response = await sendOtp(phone);
            if (response.status === "ERROR") {
                throw new Error(response.message);
            }
            return response;

        } catch (error) {
            console.log("Error sending OTP:", error);
        }
    };

    const verify = async (phone, otp) => {
        try {
            const response = await verifyOtp(phone, otp);
            if (response.status === "ERROR") {
                throw new Error(response.message);
            }
            return response;
        } catch (error) {
            console.log("Error verifying OTP:", error);
        }
    };


    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getToken();
            if (token) {
                setIsLoggedIn(true);

            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading, sendOTP, verify }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);