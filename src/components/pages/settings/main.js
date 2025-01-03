"use client";

import React from "react";
import ActionCard from "./action-cards";

const menuItems = [
  {
    title: "Account settings",
    description: "Update your account settings.",
    icon: "solar:user-bold-duotone",
    color: "primary",
    link: "/account/profile",
  },
  {
    title: "Subscription settings",
    description: "Update your subscription settings.",
    icon: "solar:document-medicine-linear",
    color: "primary",
    link: "/subscriptions",
  },
  {
    title: "Delete account",
    description: "Delete your account permanently.",
    icon: "solar:trash-bin-minimalistic-linear",
    color: "danger",
    link: "/account/delete",
  },
];

export default function SettingsMainComponent() {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <div className="mt-8">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="">
            {menuItems.map((item, index) => (
              <ActionCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
