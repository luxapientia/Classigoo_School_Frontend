// hooks/useSidebar.ts
import { useState, useEffect } from "react";

export default function useAISidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setCollapsed(savedState === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return { collapsed, toggleSidebar };
}
