import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { submitQuiz } from "./actions";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string; quizId: string }>;
}

export default async function QuizPage(props: PageProps) {
    const params = await props.params;
    const { id: subjectId, quizId } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Check subscription again
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject_id', subjectId)
        .eq('month', month)
        .eq('year', year)
        .eq('is_active', true)
        .single();

    if (!subscription) {
        redirect(`/subjects/${subjectId}`); // Not subscribed
    }

    const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
    const { data: questions } = await supabase.from('questions').select('*').eq('quiz_id', quizId);

    if (!quiz) return <div>Quiz not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href={`/subjects/${subjectId}`}>
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
            </div>

            <form action={submitQuiz} className="space-y-6">
                <input type="hidden" name="quizId" value={quizId} />

                {questions?.map((q, index) => (
                    <Card key={q.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                <span className="text-gray-500 mr-2">{index + 1}.</span> {q.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name={q.id} value="a" id={`${q.id}-a`} required className="h-4 w-4" />
                                <label htmlFor={`${q.id}-a`} className="flex-1 cursor-pointer">A) {q.option_a}</label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name={q.id} value="b" id={`${q.id}-b`} required className="h-4 w-4" />
                                <label htmlFor={`${q.id}-b`} className="flex-1 cursor-pointer">B) {q.option_b}</label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name={q.id} value="c" id={`${q.id}-c`} required className="h-4 w-4" />
                                <label htmlFor={`${q.id}-c`} className="flex-1 cursor-pointer">C) {q.option_c}</label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="radio" name={q.id} value="d" id={`${q.id}-d`} required className="h-4 w-4" />
                                <label htmlFor={`${q.id}-d`} className="flex-1 cursor-pointer">D) {q.option_d}</label>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Button size="lg" className="w-full">Submit Quiz</Button>
            </form>
        </div>
    )
}
