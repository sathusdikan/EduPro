import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Video, ShieldAlert, User, TrendingUp, Users, Package, Activity, DollarSign } from "lucide-react";
import Link from 'next/link';

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Verify Admin Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const supabaseAdmin = createAdminClient();

        // Double check with admin client properly
        const { data: adminProfile } = await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!adminProfile || adminProfile.role !== 'admin') {
            redirect("/dashboard");
        }
    }

    // Fetch Statistics
    const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
    const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });
    const { count: videoCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
    const { count: quizCount } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });
    const { count: activePackagesCount } = await supabase.from('user_packages').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('end_date', new Date().toISOString());

    // Basic revenue calculation (approximate based on active packages)
    // In a real app, you'd have a transactions table. Here we'll just sum active packages prices.
    const { data: activeUserPackages } = await supabase
        .from('user_packages')
        .select('package_id, packages(price)')
        .eq('is_active', true);

    const estimatedRevenue = activeUserPackages?.reduce((acc, curr: any) => acc + (curr.packages?.price || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="container mx-auto p-6 space-y-8">

                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                            <p className="text-gray-300">Welcome back, Administrator. Here's your platform overview.</p>
                        </div>
                        <div className="hidden md:block p-3 bg-white/10 rounded-full backdrop-blur-sm">
                            <Activity className="h-8 w-8 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-blue-100 font-medium">Total Students</p>
                                <Users className="h-5 w-5 text-blue-100" />
                            </div>
                            <h3 className="text-3xl font-bold">{studentCount || 0}</h3>
                            <p className="text-sm text-blue-100 mt-1">Registered users</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-purple-100 font-medium">Active Plans</p>
                                <Package className="h-5 w-5 text-purple-100" />
                            </div>
                            <h3 className="text-3xl font-bold">{activePackagesCount || 0}</h3>
                            <p className="text-sm text-purple-100 mt-1">Current enrollments</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-emerald-100 font-medium">Est. Revenue</p>
                                <DollarSign className="h-5 w-5 text-emerald-100" />
                            </div>
                            <h3 className="text-3xl font-bold">₹{estimatedRevenue.toLocaleString()}</h3>
                            <p className="text-sm text-emerald-100 mt-1">From active plans</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-orange-100 font-medium">Total Content</p>
                                <Video className="h-5 w-5 text-orange-100" />
                            </div>
                            <h3 className="text-3xl font-bold">{(subjectCount || 0) + (videoCount || 0) + (quizCount || 0)}</h3>
                            <p className="text-sm text-orange-100 mt-1">Subjects, Videos & Quizzes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                        Management Console
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Subjects Management */}
                        <Link href="/admin/subjects" className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 hover:scale-[1.02]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">{subjectCount || 0}</span>
                                    </div>
                                    <CardTitle className="mt-4 text-gray-800 dark:text-white">Subjects Manager</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-500 dark:text-gray-400">Create new subjects, update descriptions, and manage curriculum structure.</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Video Management */}
                        <Link href="/admin/videos" className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500 hover:scale-[1.02]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                            <Video className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">{videoCount || 0}</span>
                                    </div>
                                    <CardTitle className="mt-4 text-gray-800 dark:text-white">Video Library</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-500 dark:text-gray-400">Upload new video lessons, manage links, and organize content.</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Quizzes Management */}
                        <Link href="/admin/quizzes" className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500 hover:scale-[1.02]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">{quizCount || 0}</span>
                                    </div>
                                    <CardTitle className="mt-4 text-gray-800 dark:text-white">Quiz Builder</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-500 dark:text-gray-400">Create interactive quizzes, set point values, and manage assessments.</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Package Management */}
                        <Link href="/admin/packages" className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 hover:scale-[1.02]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                            <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <CardTitle className="mt-4 text-gray-800 dark:text-white">Package Plans</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-500 dark:text-gray-400">Configure pricing tiers, trial periods, and subscription features.</p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* User Management */}
                        <Link href="/admin/users" className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 hover:scale-[1.02]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">{studentCount || 0}</span>
                                    </div>
                                    <CardTitle className="mt-4 text-gray-800 dark:text-white">Student Enrollment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-500 dark:text-gray-400">Manage student accounts, assign packages, and view activities.</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
