"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useQuery } from "@apollo/client";
// import { useUser } from "@auth0/nextjs-auth0";
import { useAuth } from "@contexts/AuthContext";
import { ThemeSwitcher } from "./theme-switcher";
import { Avatar, Badge } from "@heroui/react";
import { useContext, createContext, useState, useEffect, useMemo, useCallback } from "react";

// queries
import { GET_AVATAR } from "@graphql/queries";
import { useSuspenseQuery } from "@apollo/client";
import { client } from "@lib/apolloClient";

const HeaderSlotContext = createContext();

export const HeaderSlotProvider = ({ children }) => {
  const [slots, setSlots] = useState({});

  const registerSlot = useCallback((name, component) => {
    setSlots((prev) => {
      if (prev[name] !== component) {
        return { ...prev, [name]: component };
      }
      return prev;
    });
  }, []);

  const clearSlot = useCallback((name) => {
    setSlots((prev) => {
      if (prev[name]) {
        const newSlots = { ...prev };
        delete newSlots[name];
        return newSlots;
      }
      return prev;
    });
  }, []);

  return <HeaderSlotContext.Provider value={{ slots, registerSlot, clearSlot }}>{children}</HeaderSlotContext.Provider>;
};

export const useSlot = () => useContext(HeaderSlotContext);

export function HeaderSlot({ children }) {
  const { registerSlot, clearSlot } = useSlot();

  const memoizedChildren = useMemo(() => children, [children]);

  useEffect(() => {
    registerSlot("specificHeader", memoizedChildren);

    return () => clearSlot("specificHeader");
  }, [memoizedChildren, registerSlot, clearSlot]);

  return null;
}

export default function Header() {
  const { user, loading } = useAuth();
  const { slots } = useSlot();
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    if (user?.avatar?.url) {
      setUserAvatar(user.avatar.url);
    }
  }, [user]);

  if (loading) {
    return (
      <header>
        <div className="flex items-center">
          <div className="md:hidden flex-initial pl-5">
            <Image src="/images/brand/logo-c.png" alt="logo" width={50} height={50} className="" />
          </div>
          <div className="flex-auto"></div>
          <div className="flex-initial px-4">
            <div className="flex justify-end items-center h-full gap-3">
              <div className="w-11 h-11 bg-gray-100 dark:bg-white/10 rounded-full animate-pulse"></div>
              <div className="w-11 h-11 bg-gray-100 dark:bg-white/10 rounded-full animate-pulse"></div>
              <div className="w-11 h-11 bg-gray-100 dark:bg-white/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="flex items-center">
        {slots.specificHeader && <div className="hidden md:block flex-initial pl-5">{slots.specificHeader}</div>}
        <div className="md:hidden flex-initial pl-5">
          <Image src="/images/brand/logo-c.png" alt="logo" width={50} height={50} className="" />
        </div>
        <div className="flex-auto"></div>
        <div className="flex-initial px-4">
          <div className="flex justify-end items-center h-full">
            {slots.specificHeader && <div className="md:hidden flex-initial pr-3">{slots.specificHeader}</div>}
            <div className="flex-initial">
              <Badge color="danger" shape="circle" content="" size="sm">
                <button className="flex w-11 h-11 bg-gray-100 dark:bg-white/10 rounded-full justify-center items-center">
                  <Icon icon="solar:bell-bold" className="w-6 h-6 text-gray-900 dark:text-white" />
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
                  src={userAvatar}
                  name={user?.name}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
