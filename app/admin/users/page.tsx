import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all students (users with student role)
    const { data: students } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false });

    // Fetch all active packages for display
    const { data: packages } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

    // Fetch user packages for each student
    const { data: userPackages } = await supabase
        .from("user_packages")
        .select(`
            *,
            package:packages(name, duration_months)
        `);

    // Map user packages by user_id for easy lookup
    const packagesByUser = userPackages?.reduce((acc: any, up: any) => {
        if (!acc[up.user_id]) acc[up.user_id] = [];
        acc[up.user_id].push(up);
        return acc;
    }, {}) || {};

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Student Management</h1>
            </div>

            <div className="space-y-4">
                {students?.map((student: any) => {
                    const studentPackages = packagesByUser[student.id] || [];
                    const activePackage = studentPackages.find((p: any) => {
                        const now = new Date();
                        const endDate = new Date(p.end_date);
                        return p.is_active && endDate >= now;
                    });

                    return (
                        <Card key={student.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{student.full_name || 'Student'}</CardTitle>
                                        <p className="text-sm text-gray-500">{student.email}</p>
                                        <p className="text-xs text-gray-400">
                                            Joined: {new Date(student.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {activePackage ? (
                                            <div className="space-y-1">
                                                <Badge className="bg-green-600">Active</Badge>
                                                <p className="text-xs text-gray-500">
                                                    {activePackage.package?.name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Until {new Date(activePackage.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <Badge variant="outline">No Active Package</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold">Assign Package:</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {packages?.map((pkg: any) => (
                                            <form
                                                key={pkg.id}
                                                action={async () => {
                                                    'use server';
                                                    const supabase = await createClient();
                                                    const startDate = new Date();
                                                    let endDate = new Date();

                                                    // Calculate end date based on package
                                                    if (pkg.duration_months === 0) {
                                                        // 3-day trial
                                                        endDate.setDate(endDate.getDate() + 3);
                                                    } else {
                                                        // Month-based packages
                                                        endDate.setMonth(endDate.getMonth() + pkg.duration_months);
                                                    }

                                                    await supabase.from('user_packages').insert({
                                                        user_id: student.id,
                                                        package_id: pkg.id,
                                                        start_date: startDate.toISOString(),
                                                        end_date: endDate.toISOString(),
                                                        is_active: true
                                                    });

                                                    redirect('/admin/users');
                                                }}
                                            >
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    {pkg.name}
                                                </Button>
                                            </form>
                                        ))}
                                    </div>

                                    {studentPackages.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs font-semibold mb-2">Package History:</p>
                                            <div className="space-y-1">
                                                {studentPackages.map((sp: any) => {
                                                    const isExpired = new Date(sp.end_date) < new Date();
                                                    return (
                                                        <div key={sp.id} className="text-xs flex items-center justify-between">
                                                            <span>{sp.package?.name}</span>
                                                            <span className={isExpired ? "text-red-500" : "text-green-600"}>
                                                                {new Date(sp.start_date).toLocaleDateString()} - {new Date(sp.end_date).toLocaleDateString()}
                                                                {isExpired && " (Expired)"}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {(!students || students.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No students registered yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
