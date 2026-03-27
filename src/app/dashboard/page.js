import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
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

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const { data: licenseKeys } = await supabase
    .from("license_keys")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true);

  return (
    <DashboardClient
      user={user}
      profile={profile}
      projects={projects || []}
      licenseKeys={licenseKeys || []}
    />
  );
}
