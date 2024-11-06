"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

function Login() {
    const { sendOTP, verifyOTP } = useUser();
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState<number | null>(null); // OTP as a number
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [otpError, setOtpError] = useState(false); // State to track if OTP sending failed
    const router = useRouter();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendOTP({ contact });
            setIsOTPSent(true);
            setOtpError(false); // Reset any previous error state
        } catch (error) {
            console.error('Send OTP Error: Login', error);
            setOtpError(true); // Set error state if sending OTP fails
            setIsOTPSent(false); // Reset isOTPSent state if there's an error
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp !== null) {
             await verifyOTP({ contact, otp }); 
            // Handle user data after successful verification
            // You can add further error handling here if needed
        }
    };

    const { token, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && token) {
            // If user is authenticated, redirect to home and clear history
            router.replace('/home'); // Prevent access to the login page
        }
    }, [router, token, isLoading]);

    if (isLoading) {
        return <div>Loading...</div>; // Optional loading state while checking authentication
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                    <Image
                        src="/logo.svg"
                        alt="Fairdeal.Market Logo"
                        className="w-20 h-20 mb-4"
                        width={80}
                        height={80}
                    />
                    <h1 className="text-3xl font-semibold text-gray-700">Fairdeal.Market</h1>
                </div>

                <form className="space-y-4" onSubmit={isOTPSent ? handleVerifyOTP : handleSendOTP}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contact Number</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter your contact number"
                            className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                            required
                            maxLength={10} // Restrict max length to 10 characters
                            value={contact}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                                setContact(value); // Set only digits
                            }}
                        />
                    </div>

                    {/* Only show the OTP input if it was successfully sent and no error occurred */}
                    {isOTPSent && !otpError && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Enter OTP</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter OTP"
                                className="input input-bordered w-full focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                                required
                                value={otp ?? ""}
                                maxLength={6}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                                    setOtp(value ? parseInt(value, 10) : null); // Set as number or null if empty
                                }}
                            />
                        </div>
                    )}

                    {/* Show an error message if OTP sending fails */}
                    {otpError && <p className="text-red-500">Failed to send OTP. Please try again.</p>}

                    <button type="submit" className="btn btn-primary w-full mt-4 transition transform hover:scale-105">
                        {isOTPSent ? 'Verify OTP' : 'Send OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
