import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditPackageForm from "./edit-form";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch the package
    const { data: pkg, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !pkg) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600">Package Not Found</h1>
                <p>The package you are trying to edit does not exist.</p>
            </div>
        );
    }

    return <EditPackageForm packageData={pkg} />;
}
