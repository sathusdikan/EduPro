import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ quizId: string }>;
}

export default async function ResultsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const score = searchParams.score;
    const total = searchParams.total;
    const params = await props.params;
    const quizId = params.quizId;

    const supabase = await createClient();
    const { data: quiz } = await supabase.from('quizzes').select('subject_id').eq('id', quizId).single();
    
    const subjectId = quiz?.subject_id;

    const percentage = (Number(score) / Number(total)) * 100;
    let message = "";
    if (percentage === 100) message = "Perfect Score! 🌟";
    else if (percentage >= 80) message = "Great Job! 🎉";
    else if (percentage >= 60) message = "Good Effort! 👍";
    else message = "Keep Practicing! 📚";

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[80vh] p-6">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-4 rounded-full text-green-600 mb-4 h-24 w-24 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xl text-gray-600">{message}</p>
                    <div className="text-5xl font-extrabold text-blue-600">
                        {score} <span className="text-2xl text-gray-400">/ {total}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {subjectId && (
                        <Link href={`/subjects/${subjectId}`}>
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Subject
                            </Button>
                        </Link>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
