import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UpgradeClient from "./UpgradeClient";

export default async function UpgradePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <UpgradeClient user={user} profile={profile} />;
}
