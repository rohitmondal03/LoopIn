import { createServerClient } from "@/lib/supabase";
import { AuthPage } from "./_components/auth-page"

export default async function Home() {
  const user = (await (await createServerClient()).auth.getUser()).data;
  console.log("USER", user);

  return <AuthPage />;
}
