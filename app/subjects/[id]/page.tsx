import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, PlayCircle, FileQuestion, CheckCircle, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { canAccessContent, getUserActivePackage } from "@/lib/access-control";
import VideoList from "@/components/ui/VideoList";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SubjectDetailPage(props: PageProps) {
    const params = await props.params;
    const id = params.id;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) redirect('/login');

    // Fetch subject details
    const { data: subject } = await supabase.from('subjects').select('*').eq('id', id).single();

    if (!subject) return <div>Subject not found</div>;

    // Check if user has active package (or is admin)
    const hasAccess = await canAccessContent(user.id);
    const activePackage = await getUserActivePackage(user.id);

    // Fetch content (Videos & Quizzes)
    const { data: videos } = await supabase.from('videos').select('*').eq('subject_id', id);
    const { data: quizzes } = await supabase.from('quizzes').select('*').eq('subject_id', id);

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">{subject.name}</h1>
                <p className="text-xl text-gray-500">{subject.description}</p>

                {!hasAccess ? (
                    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 dark:from-orange-900/20 dark:to-red-900/20 dark:border-orange-800">
                        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                            <Lock className="h-16 w-16 text-orange-500" />
                            <h2 className="text-3xl font-bold text-center">Premium Content Locked</h2>
                            <div className="text-center space-y-2">
                                <p className="text-gray-700 dark:text-gray-300 text-lg">
                                    This subject requires an active package to access videos and quizzes.
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Choose a package to unlock all subjects and start learning!
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Link href="/pricing">
                                    <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                        View Packages & Pricing
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center gap-4 justify-between bg-green-50 px-6 py-4 rounded-lg dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                                <span className="font-semibold text-green-800 dark:text-green-300 block">Active Package</span>
                                {activePackage && (
                                    <span className="text-sm text-green-700 dark:text-green-400">
                                        {activePackage.package.name} - Valid until {new Date(activePackage.end_date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Videos Section */}
           {/* Videos Section */}
<div className="space-y-4">
  <h2 className="text-2xl font-bold flex items-center gap-2">
    <PlayCircle className="h-6 w-6" /> Videos
  </h2>

  {videos && videos.length > 0 ? (
    <VideoList videos={videos} hasAccess={hasAccess} />
  ) : (
    <p className="text-gray-500">No videos available yet.</p>
  )}
</div>


                {/* Quizzes Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileQuestion className="h-6 w-6" /> Quizzes
                    </h2>
                    <div className="space-y-4">
                        {quizzes?.map((quiz) => (
                            <Card key={quiz.id} className={!hasAccess ? "border-2 border-orange-200 dark:border-orange-800" : ""}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        {quiz.title}
                                        {!hasAccess && <Lock className="h-5 w-5 text-orange-500" />}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {hasAccess ? (
                                        <Link href={`/subjects/${id}/quiz/${quiz.id}`}>
                                            <Button variant="outline" size="sm">
                                                Start Quiz
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <Lock className="h-4 w-4" />
                                            <span className="text-sm">Upgrade to unlock</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {(!quizzes || quizzes.length === 0) && <p className="text-gray-500">No quizzes available yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
