import { redirect } from "next/navigation";

export default function RootEntrypoint() {
  // Strict architectural enforcement: The root path must NEVER host UI or business logic.
  // It acts exclusively as an instantaneous, server-side gateway to the authentication layer.
  redirect("/login");
}
