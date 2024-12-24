import React from "react";
import Link from "next/link";
import menuItems from "./menu-items";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function Footer() {
  // get the current path
  const path = usePathname();

  // get the menu items
  const mainList = menuItems.filter((item) => item.isMain);
  const secondaryList = menuItems.filter((item) => !item.isMain);

  // states
  const [opened, setOpened] = React.useState(false);

  const handleOpen = React.useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  return (
    <>
      <footer className="fixed bottom-0 w-full bg-blue-500 shadow-lg px-2 py-1 text-white z-50 md:hidden">
        <div className="flex">
          {mainList.map((item, index) => (
            <Link key={index} href={item.href} className="flex-1 px-1 py-0.5">
              <div
                className={`text-center grid grid-cols-1 gap-1 justify-center items-center hover:bg-white/10 rounded-xl py-2 sm:py-1
              ${path === item.href && !opened ? "bg-white/10" : ""}`}
              >
                <Icon icon={item.icon} className="w-8 h-8 mx-auto" />
                <span className="hidden sm:block">{item.name}</span>
              </div>
            </Link>
          ))}
          <button className="flex-1 px-1 py-0.5" onClick={() => handleOpen()}>
            <div
              className={`text-center grid grid-cols-1 gap-1 justify-center items-center hover:bg-white/10 rounded-xl py-2 sm:py-1 ${
                opened ? "bg-white/10" : ""
              }`}
            >
              <Icon
                icon={`${!opened ? "solar:library-bold-duotone" : "solar:close-square-bold-duotone"}`}
                className="w-8 h-8 mx-auto"
              />
              <span className="hidden sm:block">{!opened ? "More" : "Close"}</span>
            </div>
          </button>
        </div>
      </footer>
      {opened && (
        <section className="fixed bottom-0 top-0 left-0 right-0 bg-black/80 z-40 backdrop-blur-sm grid justify-center content-center">
          <div className="grid grid-cols-3 gap-5 sm:gap-10 p-2 justify-center content-center text-white pb-[100px] px-8">
            {secondaryList.map((item, index) =>
              item.dropdown.length > 0 ? (
                item.dropdown.map((subItem, subIndex) => (
                  <Link key={subIndex} href={subItem.href} className="flex-1 py-0.5" onClick={() => handleOpen()}>
                    <div
                      className={`text-center grid grid-cols-1 gap-1 justify-center items-center hover:bg-white/10 rounded-xl py-2 sm:py-1 px-2
                ${path === subItem.href ? "bg-white/10" : ""}`}
                    >
                      <Icon icon={subItem.icon} className="w-8 h-8 mx-auto" />
                      <span className="text-center">{subItem.name}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <Link key={index} href={item.href} className="flex-1 py-0.5" onClick={() => handleOpen()}>
                  <div
                    className={`text-center grid grid-cols-1 gap-1 justify-center items-center hover:bg-white/10 rounded-xl py-2 sm:py-1 px-2
                ${path === item.href ? "bg-white/10" : ""}`}
                  >
                    <Icon icon={item.icon} className="w-8 h-8 mx-auto" />
                    <span className="text-center">{item.name}</span>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      )}
    </>
  );
}
