import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "./server";

export async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=unauthorized");
  return { supabase, user };
}
