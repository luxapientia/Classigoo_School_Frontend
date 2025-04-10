// redirect to ./messages
import { redirect } from "next/navigation";

export default function NotePage() {
  redirect("./messages");
  return null;
}
