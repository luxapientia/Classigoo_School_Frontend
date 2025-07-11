"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
// import { LogoIcon } from "@components/common/logo";
import Image from "next/image";
import axios from "@lib/axios";

export default function LoginMain({ role: userRole }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("/v1/auth/otp/send", {
        email,
        isSignup: false,
        role: userRole,
        ip: "127.0.0.1", // This should be handled by the backend
        platform: navigator.platform,
        os: navigator.userAgent,
        device: "web",
        remember_me: rememberMe,
      });

      if (data.status === "success" && data.session_token) {
        // Store session token and email for OTP verification
        localStorage.setItem("session_token", data.session_token);
        localStorage.setItem("email", email);
        // Navigate to OTP verification page
        router.push(`/auth/${userRole}/verify-otp`);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          {/* <LogoIcon size={60} /> */}
          <Image src="/images/brand/logo-c.png" alt="logo" width={50} height={50} className="mb-4" />
          <p className="text-xl font-medium">Welcome Back</p>
          <p className="text-small text-default-500">Log in to your account to continue</p>
        </div>
        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="w-full px-1 py-2">
            <Checkbox name="remember" size="sm" checked={rememberMe} onChange={handleRememberMe}>
              Remember me
            </Checkbox>
          </div>
          {error && <p className="text-tiny text-danger">{error}</p>}
          <Button className="w-full" color="primary" type="submit" isLoading={loading}>
            Log In
          </Button>
        </Form>
        {/* <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continue with Google
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
          >
            Continue with Github
          </Button>
        </div> */}
        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href={`/auth/${userRole}/signup`} size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
} 