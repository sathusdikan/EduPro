import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PackagesClient from "./packages-client";

export default async function AdminPackagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all packages
    const { data: packages } = await supabase
        .from("packages")
        .select("*")
        .order("price", { ascending: true });

    return <PackagesClient initialPackages={packages || []} />;
}
