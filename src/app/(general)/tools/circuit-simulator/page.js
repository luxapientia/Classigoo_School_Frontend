import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import CircuitSimulatorComponent from "@components/pages/tools/circuit-simulator/component";

export const metadata = {
  title: "Circuit Simulator - Classigoo",
  description: "Simulate circuits with Classigoo",
};

export default async function CircuitSimulatorPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <CircuitSimulatorComponent />;
}
