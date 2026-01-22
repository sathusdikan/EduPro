import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserActivePackage } from "@/lib/access-control";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <p className="text-red-600 font-semibold">Profile Error</p>
                <p>We could not retrieve your profile. Please contact support.</p>
            </div>
        );
    }

    // Redirect admins to admin dashboard
    if (profile.role === 'admin') {
        redirect("/admin/dashboard");
    }

    // Get active package
    const activePackage = await getUserActivePackage(user.id);

    // Fetch all subjects
    const { data: subjects } = await supabase.from('subjects').select('*');

    // Fetch billing history
    const { data: billingHistory } = await supabase
        .from("user_packages")
        .select(`
            *,
            package:packages(name, price)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Calculate package status
    const hasActivePackage = !!activePackage;
    const daysRemaining = activePackage
        ? Math.ceil((new Date(activePackage.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <DashboardClient
            profile={profile}
            activePackage={activePackage}
            subjects={subjects || []}
            billingHistory={billingHistory || []}
            hasActivePackage={hasActivePackage}
            daysRemaining={daysRemaining}
        />
    );
}
