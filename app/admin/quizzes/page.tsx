import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createQuiz, deleteQuiz } from "./actions";
import { Trash2, FileQuestion, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

export default async function QuizzesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/dashboard');

    const { data: subjects } = await supabase.from('subjects').select('*');
    const { data: quizzes } = await supabase.from('quizzes').select('*, subjects(name)').order('created_at', { ascending: false });

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <BackButton href="/dashboard" size="icon" />
                <h1 className="text-3xl font-bold">Manage Quizzes</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createQuiz} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid gap-2 w-full md:w-1/3">
                            <label htmlFor="subjectId" className="text-sm font-medium">Subject</label>
                            <select
                                id="subjectId"
                                name="subjectId"
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects?.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2 w-full md:w-1/2">
                            <label htmlFor="title" className="text-sm font-medium">Quiz Title</label>
                            <Input id="title" name="title" placeholder="Algebra Basics Test 1" required />
                        </div>
                        <Button type="submit">Create Quiz</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {quizzes?.map((quiz) => (
                    <Card key={quiz.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <FileQuestion className="h-8 w-8 text-green-600" />
                                <div>
                                    <h3 className="font-bold">{quiz.title}</h3>
                                    <p className="text-sm text-gray-500">{(quiz.subjects as any)?.name}</p>
                                    <Link href={`/admin/quizzes/${quiz.id}`} className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                                        Manage Questions <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                            <form action={deleteQuiz}>
                                <input type="hidden" name="id" value={quiz.id} />
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ))}
                {(!quizzes || quizzes.length === 0) && (
                    <div className="text-center text-gray-500 py-8">
                        No quizzes created yet.
                    </div>
                )}
            </div>
        </div>
    )
}
