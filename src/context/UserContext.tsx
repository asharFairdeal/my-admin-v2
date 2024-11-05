"use client"; // Ensure this component only runs on the client
import apiService from '@/service/apiService';
import apiUrls from '@/service/apiUrls';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type User = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    contact?: string;
    role?: string;

    // Add more fields as needed
};

interface UserContextType {
    user: User | null;
    token: string | null;
    setUser: (userData: { user: User; token: string }) => void;
    logout: () => void;
    sendOTP: (data: { contact: string }) => Promise<void>;
    verifyOTP: (data: { contact: string; otp: number }) => Promise<void>;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('_u');
            const storedToken = localStorage.getItem('_t');
            if (storedUser && storedToken) {
                setUserState(JSON.parse(storedUser));
                setTokenState(storedToken);
            }
        }
        setIsLoading(false);
    }, []);

    const setUser = (userData: { user: User; token: string }) => {
        setUserState(userData.user);
        setTokenState(userData.token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('_u', JSON.stringify(userData.user));
            localStorage.setItem('_t', userData.token);
        }
    };

    const logout = () => {
        apiService.post(apiUrls.authUrl + 'logout', {});
        if (typeof window !== 'undefined') {
            localStorage.removeItem('_u');
            localStorage.removeItem('_t');
        }
        setUserState(null);
        setTokenState(null);
    };

    const showToast = (message: string) => {
        const toast = document.createElement('div');
        toast.className = 'toast toast-top toast-end'; // Daisy UI toast classes
        toast.innerHTML = `
            <div class="alert alert-error">
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000); // Remove toast after 3 seconds
    };

    const sendOTP = async (data: { contact: string }) => {
        try {
            await apiService.post(apiUrls.authUrl + 'otp/send', data);
            toast.success('OTP sent successfully!'); // Use toast for success
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.'); // Use toast for error
            console.error('Send OTP Error:', error);
            throw error;
        }
    };

    const verifyOTP = async (data: { contact: string; otp: number }) => {
        try {
            const response = await apiService.post(apiUrls.authUrl + 'otp/verify', data);
            setUser( response &&  response.data && response.data.data);
            router.push('/home');
        } catch (error) {
            toast.error('Failed to verify OTP. Please try again.');
            console.error('Verify OTP Error:', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, token, setUser, logout, sendOTP, verifyOTP, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

