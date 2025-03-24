import { redirect } from "next/navigation";

export default function RedirectLanguage() {
  redirect("/es"); // Redirect to Spanish by default
}