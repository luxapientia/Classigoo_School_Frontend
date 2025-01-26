"use client";
import { usePathname } from "next/navigation";
import { Avatar, Tabs, Tab } from "@heroui/react";

export default function ClassroomHeader({ id, img, name, subject, section, room, owner }) {
  const pathname = usePathname();
  const active_path = pathname.split("/").pop();

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

        <div className="absolute -bottom-10 right-10">
          <Avatar src={owner?.avatar} alt={owner?.name} className="w-24 h-24 border-2" isBordered />
        </div>
        <div className="flex justify-center items-center">
          <Tabs
            className="mt-3 w-full flex-auto bg-transparent"
            variant="solid"
            fullWidth={true}
            selectedKey={active_path}
          >
            <Tab key="home" title="Home" href={`/classroom/${id}/home`} />
            <Tab key="members" title="Members" href={`/classroom/${id}/members`} />
            <Tab key="exams" title="Exams" href={`/classroom/${id}/exams`} />
            <Tab key="grades" title="Grades" href={`/classroom/${id}/grades`} />
            <Tab key="notes" title="Notes" href={`/classroom/${id}/notes`} />
            <Tab key="assignments" title="Assignments" href={`/classroom/${id}/assignments`} />
            <Tab key="settings" title="Settings" href={`/classroom/${id}/settings`} />
          </Tabs>
          <div className="flex-initial w-52"></div>
        </div>
      </div>
    </header>
  );
}
