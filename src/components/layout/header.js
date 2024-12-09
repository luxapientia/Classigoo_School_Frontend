"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Avatar, Badge } from "@nextui-org/react";
import { useUser } from "@auth0/nextjs-auth0";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header({ avatar }) {
  const { user } = useUser();
  return (
    // <header className="border-b-1.5 dark:border-gray-800">
    <header>
      <div className="flex items-center">
        {/* <div className="flex-initial px-4">
          <Link href="/" className="py-1.5">
            <Image
              src="/images/brand/logo-t-b.png"
              alt="logo"
              width={187}
              height={35}
              className="dark:hidden block"
            />

            <Image
              src="/images/brand/logo-t-w.png"
              alt="logo"
              width={187}
              height={35}
              className="dark:block hidden"
            />
          </Link>
        </div> */}
        <div className="flex-auto"></div>
        <div className="flex-initial px-4">
          <div className="flex justify-end items-center h-full">
            <div className="flex-initial pr-3">
              <Badge color="danger" shape="circle" content="" size="sm">
                <button className="flex w-11 h-11 bg-gray-800 dark:bg-white rounded-full justify-center items-center">
                  <Icon
                    icon="solar:chat-round-line-bold"
                    className="w-6 h-6 text-white dark:text-gray-700"
                  />
                </button>
              </Badge>
            </div>
            <div className="flex-initial">
              <Badge color="danger" shape="circle" content="" size="sm">
                <button className="flex w-11 h-11 bg-gray-100 dark:bg-white/10 rounded-full justify-center items-center">
                  <Icon
                    icon="solar:bell-bold"
                    className="w-6 h-6 text-gray-900 dark:text-white"
                  />
                </button>
              </Badge>
            </div>
            <div className="flex-initial px-3">
              <ThemeSwitcher />
            </div>
            <div className="flex-initial flex justify-center content-center py-3">
              <Link href="/account/profile">
                <Avatar
                  size="md"
                  className="cursor-pointer"
                  isBordered
                  radius="full"
                  {...(avatar ? { src: avatar } : { name: user?.name })}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
