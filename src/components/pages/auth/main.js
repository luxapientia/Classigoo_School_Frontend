"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthDashboard() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Image src="/images/brand/logo-c.png" alt="logo" width={50} height={50} className="mb-4" />
          <p className="text-xl font-medium">Welcome to Classigoo</p>
          <p className="text-small text-default-500">Choose your account type to continue</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            className="w-full h-20 flex-col gap-1 py-2"
            color="primary"
            variant="bordered"
            onClick={() => router.push('/auth/teacher/login')}
            startContent={
              <Icon icon="mdi:teacher" width={24} height={24} />
            }
          >
            <span className="text-base">School Staff</span>
            <span className="text-xs text-default-500">For Teachers, Staff & Administrators</span>
          </Button>

          <Button
            className="w-full h-20 flex-col gap-1 py-2"
            color="primary"
            variant="bordered"
            onClick={() => router.push('/auth/parent/login')}
            startContent={
              <Icon icon="mdi:account-child" width={24} height={24} />
            }
          >
            <span className="text-base">Student / Parent</span>
            <span className="text-xs text-default-500">For Students & Parents</span>
          </Button>
        </div>

        <p className="text-center text-small text-default-500 mt-4">
          Choose the appropriate option to access your account
        </p>
      </div>
    </div>
  );
}
