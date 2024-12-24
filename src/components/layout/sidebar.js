"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import menuItems from "./menu-items";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const [open, setOpen] = React.useState(null);
  const [toggle, setToggle] = React.useState(false);

  const handleDropdown = React.useCallback(
    (index) => {
      if (open == index) {
        setOpen(null);
      } else {
        setOpen(index);
      }
    },
    [open]
  );

  const handleToggle = React.useCallback(() => {
    setToggle(!toggle);
  }, [toggle]);

  return (
    <div className={`${toggle ? "" : ""}min-w-[300px] h-[100vh] hidden md:block`}>
      <div className="flex flex-col h-full">
        <div className="flex-initial flex items-center justify-center py-5">
          <Link href="/" className="py-1.5">
            <Image src="/images/brand/logo-t-b.png" alt="logo" width={187} height={35} className="dark:hidden block" />

            <Image src="/images/brand/logo-t-w.png" alt="logo" width={187} height={35} className="dark:block hidden" />
          </Link>
        </div>
        <div className="flex-auto overflow-x-hidden overflow-y-auto">
          <nav>
            <ul className="flex flex-col px-4">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`flex-initial px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl my-1 font-semibold
                    ${path === item.href ? "bg-gray-100 dark:bg-white/10" : ""}
                    ${open == index ? "dark:bg-white/10" : ""}
                    `}
                >
                  {item.dropdown.length === 0 ? (
                    <Link href={item.href} className="flex items-center p-3 text-gray-900 dark:text-white">
                      <span className="flex-initial">
                        <Icon icon={item.icon} className="w-5 h-5" />
                      </span>
                      <span className={`flex-auto ${item.dropdown.length == 0 ? "pl-3" : "px-3"}`}>{item.name}</span>
                      {item.dropdown.length > 0 && (
                        <span className="flex-initial">
                          <Icon icon="solar:alt-arrow-down-broken" className="w-6 h-6" />
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleDropdown(index)}
                      className="flex items-center p-3 text-gray-900 dark:text-white  w-full"
                    >
                      <span className="flex-initial">
                        <Icon icon={item.icon} className="w-5 h-5" />
                      </span>
                      <span className={`flex-auto text-left ${item.dropdown.length == 0 ? "pl-3" : "px-3"}`}>
                        {item.name}
                      </span>
                      <span className="flex-auto"></span>
                      {item.dropdown.length > 0 && (
                        <span className="flex-initial">
                          <Icon
                            icon="solar:alt-arrow-down-broken"
                            className={`w-5 h-5 transition-all ease-in-out duration-500
                              ${open == index ? "-rotate-180" : ""}
                              `}
                          />
                        </span>
                      )}
                    </button>
                  )}

                  {item.dropdown.length > 0 && open == index && (
                    <ul className="flex flex-col px-4">
                      {item.dropdown.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className={`flex-initial px-2 py-1 hover:bg-gray-200 hover:dark:bg-white/10 rounded-xl my-1 font-semibold
                            ${path === subItem.href ? "bg-gray-200 dark:bg-white/10" : ""}
                            `}
                        >
                          <Link href={subItem.href} className="flex items-center p-3 text-gray-900 dark:text-white">
                            <span className="flex-initial">
                              <Icon icon={subItem.icon} className="w-5 h-5" />
                            </span>
                            <span className="flex-auto pl-3">{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex-initial">
          <div className="">
            <nav>
              <ul className="flex flex-col px-4">
                <li
                  className={`flex-initial px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl my-1 font-semibold`}
                >
                  <Link
                    href="https://help.classigoo.com"
                    className="flex items-center p-3 text-gray-900 dark:text-white"
                  >
                    <span className="flex-initial">
                      <Icon icon="solar:help-bold-duotone" className="w-5 h-5" />
                    </span>
                    <span className={`flex-auto pl-3`}>Help & Support</span>
                  </Link>
                </li>
                <li
                  className={`flex-initial px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl my-1 font-semibold`}
                >
                  <Link href="/auth/logout" className="flex items-center p-3 text-gray-900 dark:text-white">
                    <span className="flex-initial">
                      <Icon icon="solar:logout-3-bold-duotone" className="w-5 h-5" />
                    </span>
                    <span className={`flex-auto pl-3`}>Logout</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
