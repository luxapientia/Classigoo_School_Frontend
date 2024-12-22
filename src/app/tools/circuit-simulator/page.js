"use client";

import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { HeaderSlot } from "@components/layout/header";
import { useState, useCallback } from "react";

export default function CircuitSimulatorPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  return (
    <div className={`${isFullScreen ? "fixed inset-0 z-50 top-0 left-0 right-0 bottom-0" : "w-full h-[calc(100%)]"}`}>
      <HeaderSlot>
        <Button
          size="small"
          onClick={handleFullScreen}
          radius="large"
          variant="ghost"
          className="flex items-center bg-content2 text:content1"
        >
          <Icon icon="solar:full-screen-bold-duotone" />
          Full Screen
        </Button>
      </HeaderSlot>

      <iframe
        src="https://www.falstad.com/circuit/circuitjs.html"
        title="Circuit Simulator"
        className={`w-full h-[calc(100%)] ${isFullScreen ? "" : "rounded-2xl border-2"}`}
      />
      {isFullScreen && (
        <Button
          size="small"
          onClick={handleFullScreen}
          radius="large"
          variant="ghost"
          color="danger"
          className="fixed top-1 right-1 bg-content2 text:content1 h-6 text-xs font-semibold"
        >
          <Icon icon="solar:exit-full-screen-bold-duotone" />
          Exit Full Screen
        </Button>
      )}
    </div>
  );
}
