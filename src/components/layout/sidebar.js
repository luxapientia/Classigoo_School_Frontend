"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    name: "Home",
    icon: "solar:home-smile-angle-bold-duotone",
    href: "/",
    dropdown: [],
  },
  {
    name: "Classrooms",
    icon: "solar:book-2-bold-duotone",
    href: "/classrooms",
    dropdown: [],
  },
  {
    name: "Parential Control",
    icon: "raphael:parent",
    href: "#",
    dropdown: [
      {
        name: "Parents",
        icon: "solar:user-hands-bold-duotone",
        href: "/parential-control/parents",
      },
      {
        name: "Children",
        icon: "solar:people-nearby-bold-duotone",
        href: "/parential-control/children",
      },
    ],
  },
  {
    name: "Learning",
    icon: "solar:lightbulb-bold-duotone",
    href: "/learning",
    dropdown: [],
  },
  {
    name: "Study Helper",
    icon: "solar:chat-round-like-bold-duotone",
    href: "#",
    dropdown: [
      {
        name: "Physics Buddy",
        icon: "solar:ruler-pen-bold-duotone",
        href: "/buddy/physics",
      },
      {
        name: "Chemistry Buddy",
        icon: "solar:test-tube-bold-duotone",
        href: "/buddy/chemistry",
      },
      {
        name: "Math Buddy",
        icon: "solar:calculator-minimalistic-bold-duotone",
        href: "/buddy/math",
      },
    ],
  },
  {
    name: "Labs & Tools",
    icon: "tabler:tools",
    href: "#",
    dropdown: [
      {
        name: "Circuit Simulator",
        icon: "solar:cpu-bolt-bold-duotone",
        href: "/tools/circuit-simulator",
      },
    ],
  },
  {
    name: "Games",
    icon: "solar:gameboy-bold-duotone",
    href: "/games",
    dropdown: [],
  },
  {
    name: "Settings",
    icon: "solar:settings-bold-duotone",
    href: "/settings",
    dropdown: [],
  },
];

export default function Sidebar() {
  const path = usePathname();

  const [open, setOpen] = React.useState(null);

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

  return (
    <div className="min-w-[300px] h-[100vh]">
      <div className="flex flex-col h-full">
        <div className="flex-initial flex items-center justify-center py-5">
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
                    <Link
                      href={item.href}
                      className="flex items-center p-3 text-gray-900 dark:text-white"
                    >
                      <span className="flex-initial">
                        <Icon icon={item.icon} className="w-5 h-5" />
                      </span>
                      <span
                        className={`flex-auto ${
                          item.dropdown.length == 0 ? "pl-3" : "px-3"
                        }`}
                      >
                        {item.name}
                      </span>
                      {item.dropdown.length > 0 && (
                        <span className="flex-initial">
                          <Icon
                            icon="solar:alt-arrow-down-broken"
                            className="w-6 h-6"
                          />
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
                      <span
                        className={`flex-auto text-left ${
                          item.dropdown.length == 0 ? "pl-3" : "px-3"
                        }`}
                      >
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
                            ${
                              path === subItem.href
                                ? "bg-gray-200 dark:bg-white/10"
                                : ""
                            }
                            `}
                        >
                          <Link
                            href={subItem.href}
                            className="flex items-center p-3 text-gray-900 dark:text-white"
                          >
                            <span className="flex-initial">
                              <Icon icon={subItem.icon} className="w-5 h-5" />
                            </span>
                            <span className="flex-auto pl-3">
                              {subItem.name}
                            </span>
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
                      <Icon
                        icon="solar:help-bold-duotone"
                        className="w-5 h-5"
                      />
                    </span>
                    <span className={`flex-auto pl-3`}>Help & Support</span>
                  </Link>
                </li>
                <li
                  className={`flex-initial px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl my-1 font-semibold`}
                >
                  <Link
                    href="/auth/logout"
                    className="flex items-center p-3 text-gray-900 dark:text-white"
                  >
                    <span className="flex-initial">
                      <Icon
                        icon="solar:logout-3-bold-duotone"
                        className="w-5 h-5"
                      />
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
