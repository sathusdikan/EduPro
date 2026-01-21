import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Package Management</h1>
                <Link href="/admin/packages/create">
                    <Button>Create New Package</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg: any) => (
                    <Card key={pkg.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {pkg.name}
                                {!pkg.is_active && (
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inactive</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600">{pkg.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">₹{pkg.price}</span>
                                <span className="text-sm text-gray-500">{pkg.duration_months} months</span>
                            </div>
                            {pkg.features && pkg.features.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold mb-1">Features:</p>
                                    <ul className="text-xs space-y-1">
                                        {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                                            <li key={idx}>• {feature}</li>
                                        ))}
                                        {pkg.features.length > 3 && (
                                            <li className="text-gray-400">+ {pkg.features.length - 3} more</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                            <div className="flex gap-2 pt-2">
                                <Link href={`/admin/packages/${pkg.id}/edit`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">Edit</Button>
                                </Link>
                                <Button variant="destructive" size="sm" className="flex-1">Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {(!packages || packages.length === 0) && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No packages created yet.</p>
                    <Link href="/admin/packages/create">
                        <Button className="mt-4">Create Your First Package</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
