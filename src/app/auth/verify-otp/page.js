"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "@heroui/react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@components/common/logo";
import axios from "@lib/axios";
import { setCookie } from 'cookies-next';
import Cookies from 'js-cookie';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(9).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setTimerActive(true);
    setCanResend(false);
    setTimeLeft(60);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (element, index) => {
    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (element.value && index < 8) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 9).split("");
    const newOtp = [...otp];
    
    pastedData.forEach((value, index) => {
      if (index < 9) {
        newOtp[index] = value;
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = value;
        }
      }
    });
    
    setOtp(newOtp);
    if (inputRefs.current[pastedData.length - 1]) {
      inputRefs.current[pastedData.length - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 9) {
      setError("Please enter all 9 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const session_token = localStorage.getItem("session_token");

      if (!session_token) {
        router.push("/auth/login");
        return;
      }

      const { data } = await axios.post("/v1/auth/otp/validate", {
        otp: otpValue,
        session_token,
        ip: "127.0.0.1" // This should be handled by the backend
      });

      if (data.status === "success" && data.token) {
        // Store token in localStorage for axios
        localStorage.setItem("token", data.token);
        
        // Calculate expiry time
        const maxAge = data.session_expiry 
          ? Math.floor((new Date(data.session_expiry).getTime() - Date.now()) / 1000)
          : 30 * 24 * 60 * 60; // 30 days default

        // Set cookie using js-cookie for immediate effect
        Cookies.set('token', data.token, {
          expires: maxAge / (24 * 60 * 60), // Convert seconds to days
        });
        
        // Also set using cookies-next for SSR
        // setCookie('token', data.token, {
        //   maxAge,
        //   path: '/',
        //   sameSite: 'lax'
        // });
        
        // Clean up session data
        localStorage.removeItem("session_token");
        localStorage.removeItem("email");
        
        // Redirect to home
        router.push("/");
        // router.refresh(); // Force middleware to re-run
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError("");
    startTimer();

    try {
      const session_token = localStorage.getItem("session_token");
      if (!session_token) {
        router.push("/auth/login");
        return;
      }

      const { data } = await axios.post("/v1/auth/otp/resend", {
        session_token,
        ip: "127.0.0.1", // This should be handled by the backend
      });

      if (data.status !== "success") {
        setError(data.message || "Failed to resend OTP");
        setCanResend(true);
        setTimerActive(false);
        return;
      }

      setError("OTP resent successfully");

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setCanResend(true);
      setTimerActive(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <LogoIcon size={60} />
          <p className="text-xl font-medium">Verify OTP</p>
          <p className="text-small text-default-500">Enter the code sent to your email</p>
        </div>
        <Form className="flex flex-col gap-3 items-center justify-center" validationBehavior="native" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2">
            {otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={otp[index]}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-12 w-12 rounded-md border border-default-200 bg-transparent text-center text-large focus:border-primary focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-center text-tiny text-danger">{error}</p>}
          <Button className="w-full" color="primary" type="submit" isLoading={loading}>
            Verify
          </Button>
        </Form>
        <div className="flex flex-col items-center gap-2">
          <p className="text-small text-default-500">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-primary hover:text-primary-500 focus:outline-none"
              >
                Resend OTP
              </button>
            ) : (
              timerActive && `Resend OTP in ${timeLeft}s`
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 