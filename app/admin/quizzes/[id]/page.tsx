import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addQuestion, deleteQuestion } from "./actions";
import { Trash2, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizQuestionsPage(props: PageProps) {
    const params = await props.params;
    const quizId = params.id;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/dashboard');

    const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quizId).single();
    const { data: questions } = await supabase.from('questions').select('*').eq('quiz_id', quizId).order('created_at', { ascending: true });

    if (!quiz) return <div>Quiz not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <BackButton href="/admin/quizzes" size="icon" />
                <div>
                    <h1 className="text-3xl font-bold">Expect Questions</h1>
                    <p className="text-gray-500">Managing: {quiz.title}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addQuestion} className="space-y-4">
                        <input type="hidden" name="quizId" value={quizId} />
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Question Text</label>
                            <Input name="question" placeholder="What is 2 + 2?" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Option A</label>
                                <Input name="optionA" placeholder="3" required />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Option B</label>
                                <Input name="optionB" placeholder="4" required />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Option C</label>
                                <Input name="optionC" placeholder="5" required />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Option D</label>
                                <Input name="optionD" placeholder="6" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="correctAnswer" className="text-sm font-medium">Correct Answer</label>
                            <select
                                id="correctAnswer"
                                name="correctAnswer"
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                required
                            >
                                <option value="a">Option A</option>
                                <option value="b">Option B</option>
                                <option value="c">Option C</option>
                                <option value="d">Option D</option>
                            </select>
                        </div>
                        <Button type="submit">Add Question</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Existing Questions</h2>
                {questions?.map((q, index) => (
                    <Card key={q.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg"><span className="text-gray-400 mr-2">Q{index + 1}.</span> {q.question}</h3>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                                        <span className={q.correct_answer === 'a' ? "text-green-600 font-bold flex items-center gap-1" : ""}>
                                            A) {q.option_a} {q.correct_answer === 'a' && <CheckCircle2 className="h-3 w-3" />}
                                        </span>
                                        <span className={q.correct_answer === 'b' ? "text-green-600 font-bold flex items-center gap-1" : ""}>
                                            B) {q.option_b} {q.correct_answer === 'b' && <CheckCircle2 className="h-3 w-3" />}
                                        </span>
                                        <span className={q.correct_answer === 'c' ? "text-green-600 font-bold flex items-center gap-1" : ""}>
                                            C) {q.option_c} {q.correct_answer === 'c' && <CheckCircle2 className="h-3 w-3" />}
                                        </span>
                                        <span className={q.correct_answer === 'd' ? "text-green-600 font-bold flex items-center gap-1" : ""}>
                                            D) {q.option_d} {q.correct_answer === 'd' && <CheckCircle2 className="h-3 w-3" />}
                                        </span>
                                    </div>
                                </div>
                                <form action={deleteQuestion}>
                                    <input type="hidden" name="id" value={q.id} />
                                    <input type="hidden" name="quizId" value={quizId} />
                                    <Button variant="destructive" size="icon" className="h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(!questions || questions.length === 0) && (
                    <p className="text-gray-500">No questions added yet.</p>
                )}
            </div>
        </div>
    )
}
