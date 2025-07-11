"use client";

import React from "react";
import { Button } from "@heroui/react";

export default function SchoolItem({ school, onSelect }) {
  return (
    <Button
      className="w-full justify-start px-4 py-3 mb-2 hover:bg-default-100"
      variant="light"
      onClick={() => onSelect(school)}
    >
      <div className="flex flex-col items-start">
        <span className="text-base font-medium text-foreground">{school.name}</span>
      </div>
    </Button>
  );
}
