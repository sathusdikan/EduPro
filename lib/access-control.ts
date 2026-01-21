import { createClient } from "@/lib/supabase/server";

/**
 * Check if a user has an active package
 */
export async function hasActivePackage(userId: string): Promise<boolean> {
    const supabase = await createClient();

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("user_packages")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("end_date", now)
        .limit(1);

    if (error) {
        console.error("Error checking active package:", error);
        return false;
    }

    return data && data.length > 0;
}

/**
 * Get user's active package details
 */
export async function getUserActivePackage(userId: string) {
    const supabase = await createClient();

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("user_packages")
        .select(`
            *,
            package:package_id(*)
        `)
        .eq("user_id", userId)
        .eq("is_active", true)
        .gte("end_date", now)
        .order("end_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error fetching user package:", error);
        return null;
    }

    return data;
}

/**
 * Check if user is admin (has admin role in profile)
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    if (error) {
        return false;
    }

    return data?.role === 'admin';
}

/**
 * Check if user can access content (has active package OR is admin)
 */
export async function canAccessContent(userId: string): Promise<boolean> {
    const isAdmin = await isUserAdmin(userId);
    if (isAdmin) return true;

    return await hasActivePackage(userId);
}
