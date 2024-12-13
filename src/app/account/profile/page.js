"use client";

import { Tabs, Tab, Button } from "@nextui-org/react";
import ProfileSetting from "../../../components/pages/account/profile/profile";
import AddressSetting from "../../../components/pages/account/profile/address";

export default function ProfilePage() {
  return (
    <div className="w-full max-w-2xl flex-1 p-4">
      <div className="flex items-center gap-x-3">
        <h1 className="text-3xl font-bold leading-9 text-default-foreground">Profile Settings</h1>
      </div>
      <h2 className="mt-2 text-small text-default-500">See your profile information and manage your settings.</h2>
      <Tabs
        fullWidth
        classNames={{
          base: "mt-6",
          cursor: "bg-content1 dark:bg-content1",
          panel: "w-full p-0 pt-4",
        }}
      >
        <Tab key="profile" title="Profile">
          <ProfileSetting
            className="mt-0 bg-content1 dark:bg-content1"
            avatar="https://avatars.dicebear.com/api/human/1223.svg"
            name="Kate Moore"
            email="kate@cl.com"
            is_plus="true"
          />
        </Tab>
        <Tab key="address" title="Address">
          <AddressSetting className="mt-0 bg-content1 dark:bg-content1" />
        </Tab>
        <Tab key="cards" title="Saved Cards"></Tab>
      </Tabs>
    </div>
  );
}
