import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getUserActivePackage } from "@/lib/access-control";
import { Calendar, Clock, Crown, Lock, BookOpen, Trophy, TrendingUp } from "lucide-react";

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

    // Calculate package status
    const hasActivePackage = !!activePackage;
    const daysRemaining = activePackage
        ? Math.ceil((new Date(activePackage.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Welcome back, {profile.full_name || 'Student'}! 👋
                            </h1>
                            <p className="text-blue-100 text-lg">{profile.email}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Trophy className="h-5 w-5" />
                            <span className="font-semibold">Student</span>
                        </div>
                    </div>
                </div>

                {/* Package Status Card */}
                {hasActivePackage ? (
                    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-600 rounded-full">
                                        <Crown className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl text-green-800 dark:text-green-300">
                                            {activePackage.package?.name || 'Active Package'}
                                        </CardTitle>
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            Full access to all subjects and features
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                                        <Clock className="h-4 w-4" />
                                        {daysRemaining} days left
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Started</p>
                                        <p className="font-semibold">{new Date(activePackage.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg">
                                    <Calendar className="h-5 w-5 text-orange-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Expires</p>
                                        <p className="font-semibold">{new Date(activePackage.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-lg">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                                        <Lock className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-300">No Active Package</h3>
                                        <p className="text-orange-600 dark:text-orange-400">Upgrade to unlock all subjects and start learning!</p>
                                    </div>
                                </div>
                                <Link href="/pricing">
                                    <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                                        View Pricing Plans
                                    </button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Subjects</p>
                                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">{subjects?.length || 0}</p>
                                </div>
                                <BookOpen className="h-12 w-12 text-blue-500 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Access Status</p>
                                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                                        {hasActivePackage ? 'Full Access' : 'Limited'}
                                    </p>
                                </div>
                                {hasActivePackage ? (
                                    <Crown className="h-12 w-12 text-purple-500 opacity-50" />
                                ) : (
                                    <Lock className="h-12 w-12 text-purple-500 opacity-50" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Learning Progress</p>
                                    <p className="text-3xl font-bold text-green-800 dark:text-green-300">0%</p>
                                </div>
                                <TrendingUp className="h-12 w-12 text-green-500 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Subjects Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="h-7 w-7 text-blue-600" />
                            Available Subjects
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subjects?.map((subject) => (
                            <Link key={subject.id} href={`/subjects/${subject.id}`}>
                                <Card className={`group hover:shadow-2xl transition-all duration-300 cursor-pointer h-full ${!hasActivePackage
                                        ? 'border-2 border-orange-200 opacity-75 hover:opacity-100'
                                        : 'hover:scale-105 hover:border-blue-400'
                                    }`}>
                                    <CardHeader className="relative">
                                        {!hasActivePackage && (
                                            <div className="absolute top-3 right-3">
                                                <Lock className="h-5 w-5 text-orange-500" />
                                            </div>
                                        )}
                                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                                            {subject.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {subject.description || 'Explore comprehensive lessons and quizzes.'}
                                        </p>
                                        {!hasActivePackage && (
                                            <div className="mt-3 text-xs text-orange-600 font-semibold">
                                                🔒 Requires active package
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {(!subjects || subjects.length === 0) && (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No subjects available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

