import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  BookOpen, Video, ShieldAlert, User, TrendingUp, Users, Package, Activity, DollarSign 
} from "lucide-react";
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify Admin Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabaseAdmin = createAdminClient();

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') redirect("/dashboard");
  }

  // Fetch Statistics
  const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
  const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });
  const { count: videoCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
  const { count: quizCount } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });
  const { count: activePackagesCount } = await supabase.from('user_packages').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('end_date', new Date().toISOString());

  // Estimate Revenue
  const { data: activeUserPackages } = await supabase
    .from('user_packages')
    .select('package_id, packages(price)')
    .eq('is_active', true);

  const estimatedRevenue = activeUserPackages?.reduce((acc, curr: any) => acc + (curr.packages?.price || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <div className="container mx-auto p-6 space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-300 dark:text-gray-400">Welcome back, Administrator. Here's your platform overview.</p>
            </div>
            <div className="hidden md:block p-3 bg-white/10 dark:bg-gray-700/20 rounded-full backdrop-blur-sm">
              <Activity className="h-8 w-8 text-blue-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/** Card Template */}
          <StatCard 
            title="Total Students" 
            icon={<Users className="h-5 w-5 text-blue-100 animate-pulse" />} 
            count={studentCount || 0} 
            description="Registered users" 
            from="from-blue-500" to="to-blue-600" 
          />
          <StatCard 
            title="Active Plans" 
            icon={<Package className="h-5 w-5 text-purple-100 animate-pulse" />} 
            count={activePackagesCount || 0} 
            description="Current enrollments" 
            from="from-purple-500" to="to-purple-600" 
          />
          <StatCard 
            title="Est. Revenue" 
            icon={<DollarSign className="h-5 w-5 text-emerald-100 animate-pulse" />} 
            count={`₹${estimatedRevenue.toLocaleString()}`} 
            description="From active plans" 
            from="from-emerald-500" to="to-emerald-600" 
          />
          <StatCard 
            title="Total Content" 
            icon={<Video className="h-5 w-5 text-orange-100 animate-pulse" />} 
            count={(subjectCount || 0) + (videoCount || 0) + (quizCount || 0)} 
            description="Subjects, Videos & Quizzes" 
            from="from-orange-500" to="to-orange-600" 
          />
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600 animate-bounce" />
            Management Console
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/** Action Cards */}
            <ActionCard 
              href="/admin/subjects"
              title="Subjects Manager"
              icon={<BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              count={subjectCount || 0}
              description="Create new subjects, update descriptions, and manage curriculum structure."
              borderColor="border-l-blue-500"
              bgColor="bg-blue-100"
              hoverBgColor="hover:bg-blue-200"
            />
            <ActionCard 
              href="/admin/videos"
              title="Video Library"
              icon={<Video className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              count={videoCount || 0}
              description="Upload new video lessons, manage links, and organize content."
              borderColor="border-l-orange-500"
              bgColor="bg-orange-100"
              hoverBgColor="hover:bg-orange-200"
            />
            <ActionCard 
              href="/admin/quizzes"
              title="Quiz Builder"
              icon={<ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />}
              count={quizCount || 0}
              description="Create interactive quizzes, set point values, and manage assessments."
              borderColor="border-l-red-500"
              bgColor="bg-red-100"
              hoverBgColor="hover:bg-red-200"
            />
            <ActionCard 
              href="/admin/packages"
              title="Package Plans"
              icon={<Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
              description="Configure pricing tiers, trial periods, and subscription features."
              borderColor="border-l-purple-500"
              bgColor="bg-purple-100"
              hoverBgColor="hover:bg-purple-200"
            />
            <ActionCard 
              href="/admin/users"
              title="Student Enrollment"
              icon={<Users className="h-6 w-6 text-green-600 dark:text-green-400" />}
              count={studentCount || 0}
              description="Manage student accounts, assign packages, and view activities."
              borderColor="border-l-green-500"
              bgColor="bg-green-100"
              hoverBgColor="hover:bg-green-200"
            />
            <ActionCard 
              href="/admin/wallet"
              title="Wallet & Earnings"
              icon={<DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
              count={`₹${estimatedRevenue.toLocaleString()}`}
              description="View your earnings, balance, and transaction history."
              borderColor="border-l-emerald-500"
              bgColor="bg-emerald-100"
              hoverBgColor="hover:bg-emerald-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reusable Statistics Card Component */
function StatCard({ title, icon, count, description, from, to }: any) {
  return (
    <Card className={`border-0 shadow-2xl ${from} ${to} text-white hover:scale-105 transform transition-all duration-300 rounded-xl bg-gradient-to-br`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">{icon}<p className="text-white font-medium">{title}</p></div>
        <h3 className="text-3xl font-bold">{count}</h3>
        <p className="text-sm text-white mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

/** Reusable Action Card Component */
function ActionCard({ href, title, icon, count, description, borderColor, bgColor, hoverBgColor }: any) {
  return (
    <Link href={href} className="group">
      <Card className={`
        h-full border-l-4 rounded-xl transform transition-all duration-300
        shadow-lg hover:shadow-2xl hover:scale-105
        ${borderColor}
      `}>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Icon with hover animation */}
            <div className={`
              p-3 rounded-lg transition-all duration-300
              ${bgColor} ${hoverBgColor} group-hover:scale-110
              dark:bg-opacity-30
            `}>
              {icon}
            </div>

            {/* Optional Count */}
            {count && (
              <span className="text-2xl font-bold text-gray-700 dark:text-black transition-colors duration-300">
                {count}
              </span>
            )}
          </div>

          {/* Title */}
          <CardTitle className="mt-4 text-gray-800 dark:text-black font-semibold transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>

        {/* Description */}
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

