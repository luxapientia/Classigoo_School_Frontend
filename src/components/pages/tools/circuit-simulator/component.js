"use client";

import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useCallback, useState } from "react";
import { HeaderSlot } from "@components/layout/header";

export default function CircuitSimulatorComponent() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  return (
    <div
      className={`${isFullScreen ? "fixed inset-0 z-[250] top-0 left-0 right-0 bottom-0" : "w-full h-[calc(100%)]"}`}
    >
      <HeaderSlot>
        <Button
          size="small"
          onPress={handleFullScreen}
          radius="large"
          variant="ghost"
          className="hidden md:flex items-center bg-content2 text:content1 px-4 py-2 border-2 rounded-xl"
        >
          <Icon icon="solar:full-screen-bold-duotone" />
          <span className="ml-1">Full Screen</span>
        </Button>
        <button
          onClick={handleFullScreen}
          className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
        >
          <Icon icon="solar:full-screen-bold-duotone" />
        </button>
      </HeaderSlot>

      <iframe
        src="https://www.falstad.com/circuit/circuitjs.html"
        title="Circuit Simulator"
        className={`w-full h-[calc(100%)] ${isFullScreen ? "" : "rounded-2xl border-2"}`}
      />
      {isFullScreen && (
        <Button
          size="small"
          onPress={handleFullScreen}
          radius="large"
          variant="ghost"
          color="danger"
          className="fixed top-1 right-1 bg-white text:content1 h-6 text-xs font-semibold"
        >
          <Icon icon="solar:exit-full-screen-bold-duotone" />
          Exit Full Screen
        </Button>
      )}
    </div>
  );
}
