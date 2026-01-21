"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface PackageData {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_months: number;
    features: string[];
    is_active: boolean;
}

export default function EditPackageForm({ packageData }: { packageData: PackageData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: packageData.name,
        description: packageData.description || "",
        price: packageData.price.toString(),
        duration_months: packageData.duration_months.toString(),
        is_active: packageData.is_active,
    });

    const [features, setFeatures] = useState<string[]>(
        packageData.features && packageData.features.length > 0
            ? packageData.features
            : [""]
    );

    const handleAddFeature = () => {
        setFeatures([...features, ""]);
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/admin/packages/${packageData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    duration_months: parseInt(formData.duration_months),
                    features: features.filter(f => f.trim() !== ""),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update package");
            }

            router.push("/admin/packages");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <div className="mb-6">
                <Link href="/admin/packages">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Packages
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Package</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Package Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., 1-Month Package"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the package"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="999.00"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (Months) *</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={formData.duration_months}
                                    onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                                    placeholder="1"
                                    required
                                />
                                <p className="text-xs text-gray-500">Use 0 for trial packages (3 days)</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Features</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddFeature}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Feature
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder={`Feature ${index + 1}`}
                                        />
                                        {features.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveFeature(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="is_active" className="font-normal">
                                Active (visible to users)
                            </Label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? "Updating..." : "Update Package"}
                            </Button>
                            <Link href="/admin/packages" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
