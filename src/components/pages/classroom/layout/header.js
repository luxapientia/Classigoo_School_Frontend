"use client";
import * as NProgress from "nprogress";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import { usePathname } from "next/navigation";
import { Avatar, Tabs, Tab } from "@heroui/react";

export default function ClassroomHeader({ id, img, name, subject, section, room, owner, currentUser }) {
  const pathname = usePathname();
  const router = useRouter();

  // logic setter
  let selected_key;
  const split_path = pathname.split("/");
  if (split_path.includes("home")) {
    selected_key = `/classroom/${id}/home`;
  }
  if (split_path.includes("members")) {
    selected_key = `/classroom/${id}/members`;
  }
  if (split_path.includes("exams") || split_path.includes("exam")) {
    selected_key = `/classroom/${id}/exams`;
  }
  if (split_path.includes("results")) {
    selected_key = `/classroom/${id}/results`;
  }
  if (split_path.includes("notes")) {
    selected_key = `/classroom/${id}/notes`;
  }
  if (split_path.includes("assignments") || split_path.includes("assignment")) {
    selected_key = `/classroom/${id}/assignments`;
  }
  if (split_path.includes("settings")) {
    selected_key = `/classroom/${id}/settings`;
  }

  return (
    <header>
      <div className="border-3 p-2 rounded-3xl dark:bg-gray-800 bg-gray-100 dark:border-gray-800 border-gray-200 relative mb-12">
        <div
          className="bg-gray-800 h-56 bg-cover bg-center bg-no-repeat rounded-2xl p-5"
          style={{ backgroundImage: `url(${img})` }}
        >
          <div>
            <h2 className="text-white text-4xl font-bold" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
              {name}
            </h2>
            <p className="text-white text-xl font-medium mt-2">{subject}</p>
            <p className="text-white text-xl ">
              {section}
              {section && room && " - "}
              {room}
            </p>
          </div>
        </div>

        <div className="hidden xl:block absolute -bottom-10 right-10">
          <Avatar src={owner?.avatar} alt={owner?.name} className="w-24 h-24 border-2" isBordered />
        </div>
        <div className="xl:flex justify-center items-center">
          <Tabs
            className="mt-3 w-full flex-auto bg-transparent"
            variant="solid"
            fullWidth={true}
            selectedKey={selected_key}
            onSelectionChange={(value) => {
              NProgress.start();
              router.push(value);
            }}
          >
            <Tab key={`/classroom/${id}/home`} title="Home" />
            <Tab key={`/classroom/${id}/members`} title="Members" />
            <Tab key={`/classroom/${id}/exams`} title="Exams" />
            {currentUser?.role === "student" && <Tab key={`/classroom/${id}/results`} title="Results" />}
            <Tab key={`/classroom/${id}/notes`} title="Notes" />
            <Tab key={`/classroom/${id}/assignments`} title="Assignments" />
            {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
              <Tab key={`/classroom/${id}/settings`} title="Settings" />
            )}
          </Tabs>
          <div className="flex-initial w-52"></div>
        </div>
      </div>
    </header>
  );
}
