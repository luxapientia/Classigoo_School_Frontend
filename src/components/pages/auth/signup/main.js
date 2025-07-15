"use client";

import React, { useState, useMemo } from "react";
import { Button, Input, Link, Form, Checkbox, Divider, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
// import { LogoIcon } from "@components/common/logo";
import Image from "next/image";
import axios from "@lib/axios";

export default function SignupMain({ role: userRole }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const roleOptions = useMemo(() => {
    if (userRole === 'teacher') {
      return [
        { value: 'principal', label: 'Principal' },
        { value: 'assistant-principal', label: 'Assistant Principal' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'staff', label: 'Staff' }
      ];
    } else {
      return [
        { value: 'student', label: 'Student' },
        { value: 'parent', label: 'Parent' }
      ];
    }
  }, [userRole]);

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !selectedRole) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (userRole === 'teacher') {
        // Store form data in localStorage for school selection page
        const formData = {
          email,
          name,
          role: selectedRole,
          rememberMe,
          platform: navigator.platform,
          os: navigator.userAgent,
          device: "web",
        };
        localStorage.setItem("teacherSignupData", JSON.stringify(formData));
        router.push(`/auth/teacher/select-school`);
        return;
      }
      const { data } = await axios.post("/v1/auth/otp/send", {
        email,
        name,
        isSignup: true,
        role: 'parent',
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
          <p className="text-xl font-medium">Welcome</p>
          <p className="text-small text-default-500">Create an account to get started</p>
        </div>
        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            type="text"
            variant="bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          {userRole === 'teacher' && (
          <Select
            isRequired
            label="Role"
            placeholder={`Select your ${userRole === 'teacher' ? 'staff' : 'account'} role`}
            variant="bordered"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roleOptions.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </Select>
          )}
          <div className="w-full px-1 py-2">
            <Checkbox name="remember" size="sm" checked={rememberMe} onChange={handleRememberMe}>
              Remember me
            </Checkbox>
          </div>
          {error && <p className="text-tiny text-danger">{error}</p>}
          <Button className="w-full" color="primary" type="submit" isLoading={loading}>
            {userRole === 'teacher' ? 'Continue' : 'Sign Up'}
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
            Sign Up with Google
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
          >
            Sign Up with Github
          </Button>
        </div> */}
        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link href={`/auth/${userRole}/login`} size="sm">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
} 