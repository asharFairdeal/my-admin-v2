"use client";
import Image from 'next/image';
import React, { useState, ChangeEvent, FormEvent } from 'react';

const OTPVerify: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // Manage six input fields

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, ''); // Allow only digits
    setOtp(newOtp);

    // Automatically focus on the next input field if current field is filled
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    } else if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle OTP verification logic here
    alert(`OTP Submitted: ${otp.join('')}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.svg"
            alt="Fairdeal.Market Logo"
            className="w-20 h-20 mb-4"
            width={80}
            height={80}
          />
          <h1 className="text-3xl font-semibold text-gray-700">OTP Verification</h1>
        </div>

        {/* OTP Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="tel"
                id={`otp-input-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index)}
                className="input input-bordered flex-1 w-12 h-12 text-center text-3xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out shadow-md"
                placeholder="-"
                aria-label={`OTP digit ${index + 1}`} // Accessibility
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4 transition transform hover:scale-105 active:scale-95 shadow-lg">
            Verify OTP
          </button>
        </form>

        {/* Resend OTP Option */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Didn’t receive the code?{' '}
            <button className="text-blue-600 hover:underline transition duration-200" onClick={() => alert('Resend OTP')}>
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
