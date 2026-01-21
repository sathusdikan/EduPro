"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_months: number;
    features: string[];
    is_active: boolean;
}

export default function PackagesClient({ initialPackages }: { initialPackages: Package[] }) {
    const router = useRouter();
    const [packages, setPackages] = useState<Package[]>(initialPackages);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this package?")) {
            return;
        }

        setDeletingId(id);
        try {
            const response = await fetch(`/api/admin/packages/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete package");
            }

            setPackages(packages.filter(pkg => pkg.id !== id));
            router.refresh();
        } catch (error) {
            console.error("Error deleting package:", error);
            alert("Failed to delete package");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Package Management</h1>
                <Link href="/admin/packages/create">
                    <Button>Create New Package</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <Card key={pkg.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {pkg.name}
                                {!pkg.is_active && (
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-800">Inactive</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">₹{pkg.price}</span>
                                <span className="text-sm text-gray-500">
                                    {pkg.duration_months === 0 ? "Trial (3 Days)" : `${pkg.duration_months} month${pkg.duration_months > 1 ? 's' : ''}`}
                                </span>
                            </div>
                            {pkg.features && pkg.features.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold mb-1">Features:</p>
                                    <ul className="text-xs space-y-1">
                                        {pkg.features.slice(0, 3).map((feature, idx) => (
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
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                    disabled={deletingId === pkg.id}
                                    onClick={() => handleDelete(pkg.id)}
                                >
                                    {deletingId === pkg.id ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {packages.length === 0 && (
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
