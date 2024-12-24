import { auth0 } from "@lib/auth0";
import CircuitSimulatorComponent from "@components/pages/tools/circuit-simulator/component";

export default async function CircuitSimulatorPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <CircuitSimulatorComponent />;
}
