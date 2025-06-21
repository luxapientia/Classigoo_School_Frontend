import { redirect } from "next/navigation";
import CircuitSimulatorComponent from "@components/pages/tools/circuit-simulator/component";
import { getUser } from "@lib/auth";

export const metadata = {
  title: "Circuit Simulator - Classigoo",
  description: "Simulate circuits with Classigoo",
};

export default async function CircuitSimulatorPage() {
  const user = await getUser();

  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  return <CircuitSimulatorComponent />;
}
