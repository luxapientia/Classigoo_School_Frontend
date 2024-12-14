"use client";

import ProfileSetting from "./profile";
import AddressSetting from "./address";
import { Tabs, Tab } from "@nextui-org/react";

export default function ProfileTabs({ data }) {
  return (
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
          id={data?.id}
          avatar={data?.avatar}
          name={data?.name}
          email={data?.email}
          phone={data?.phone}
          birthday={data?.birthday}
          bio={data?.bio}
          institution={data?.institution}
          is_plus={data?.is_plus}
        />
      </Tab>
      <Tab key="address" title="Address">
        <AddressSetting className="mt-0 bg-content1 dark:bg-content1" id={data?.id} address={data?.address} />
      </Tab>
      <Tab key="cards" title="Saved Cards"></Tab>
    </Tabs>
  );
}
