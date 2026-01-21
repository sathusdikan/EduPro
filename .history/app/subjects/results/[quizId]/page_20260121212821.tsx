import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BackButton } from "@/components/ui/back-button";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ quizId: string }>;
}

export default async function ResultsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const score = searchParams.score;
    const total = searchParams.total;
    const answersParam = searchParams.answers as string;
    const params = await props.params;
    const quizId = params.quizId;

    const supabase = await createClient();
    const { data: quiz } = await supabase.from('quizzes').select('subject_id').eq('id', quizId).single();
    
    const subjectId = quiz?.subject_id;

    // Fetch questions for review
    const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: true });

    let userAnswers: Record<string, string> = {};
    try {
        if (answersParam) {
            userAnswers = JSON.parse(decodeURIComponent(answersParam));
        }
    } catch (e) {
        console.error("Failed to parse answers", e);
    }

    const percentage = (Number(score) / Number(total)) * 100;
    let message = "";
    if (percentage === 100) message = "Perfect Score! 🌟";
    else if (percentage >= 80) message = "Great Job! 🎉";
    else if (percentage >= 60) message = "Good Effort! 👍";
    else message = "Keep Practicing! 📚";

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-4xl">
            {/* Score Card */}
            <Card className="text-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-4 rounded-full text-green-600 mb-4 h-24 w-24 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xl text-gray-600 dark:text-gray-400">{message}</p>
                    <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                        {score} <span className="text-2xl text-gray-400">/ {total}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {subjectId && (
                        <BackButton href={`/subjects/${subjectId}`} label="Back to Subject" variant="outline" size="default" />
                    )}
                </CardFooter>
            </Card>

            {/* Questions Review */}
            {questions && questions.length > 0 && Object.keys(userAnswers).length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Review Answers</h2>
                    <div className="space-y-4">
                        {questions.map((q, index) => {
                            const userAnswer = userAnswers[q.id];
                            const isCorrect = userAnswer === q.correct_answer;
                            
                            // Helper to get option text
                            const getOptionText = (key: string) => {
                                switch(key) {
                                    case 'a': return q.option_a;
                                    case 'b': return q.option_b;
                                    case 'c': return q.option_c;
                                    case 'd': return q.option_d;
                                    default: return '';
                                }
                            };

                            return (
                                <Card key={q.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-start gap-3">
                                            <span className="text-gray-500 min-w-[24px]">{index + 1}.</span>
                                            <div className="flex-1">
                                                {q.question}
                                                <div className="mt-2 flex items-center gap-2 text-sm font-normal">
                                                    {isCorrect ? (
                                                        <span className="text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full dark:bg-green-900/20">
                                                            <CheckCircle className="h-4 w-4" /> Correct
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full dark:bg-red-900/20">
                                                            <XCircle className="h-4 w-4" /> Incorrect
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2 pl-12 space-y-2">
                                        {!isCorrect && (
                                            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/20">
                                                <span className="font-semibold text-red-700 dark:text-red-400 text-sm block mb-1">Your Answer:</span>
                                                <p className="text-red-800 dark:text-red-300">
                                                    {userAnswer ? `${userAnswer.toUpperCase()}) ${getOptionText(userAnswer)}` : 'No Answer'}
                                                </p>
                                            </div>
                                        )}
                                        <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-900/20">
                                            <span className="font-semibold text-green-700 dark:text-green-400 text-sm block mb-1">Correct Answer:</span>
                                            <p className="text-green-800 dark:text-green-300">
                                                {q.correct_answer.toUpperCase()}) {getOptionText(q.correct_answer)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
