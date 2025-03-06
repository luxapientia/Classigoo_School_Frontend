// redirect to ../notes
import { redirect } from "next/navigation";

export default function NotePage() {
  redirect("../");
  return null;
}
