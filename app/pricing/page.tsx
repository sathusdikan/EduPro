import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default async function PricingPage() {
    const supabase = await createClient();

    // Fetch all active packages
    const { data: packages } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Learning Package</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Select the perfect package to access premium educational content, quizzes, and track your progress
                    </p>
                </div>

                {packages && packages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {packages.map((pkg: any) => (
                            <Card key={pkg.id} className="relative hover:shadow-xl transition-shadow border-2 hover:border-blue-500">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                                    <CardDescription className="text-base">{pkg.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center py-4">
                                        <div className="text-4xl font-bold text-blue-600">
                                            ₹{pkg.price}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            for {pkg.duration_months} month{pkg.duration_months > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    {pkg.features && pkg.features.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">Features:</p>
                                            <ul className="space-y-2">
                                                {pkg.features.map((feature: string, index: number) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Link href="/register" className="w-full">
                                        <Button className="w-full" size="lg">
                                            Get Started
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No packages available at the moment. Please check back later.</p>
                    </div>
                )}

                <div className="text-center mt-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Already have an account?
                    </p>
                    <Link href="/login">
                        <Button variant="outline" size="lg">
                            Login to Your Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
