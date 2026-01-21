import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { CreateSubjectForm } from "./create-subject-form";
import { DeleteSubjectButton } from "./delete-subject-button";

export default async function SubjectsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Verify role again just in case
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/dashboard');

    const { data: subjects } = await supabase.from('subjects').select('*').order('created_at', { ascending: false });

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold">Manage Subjects</h1>
            </div>

            <CreateSubjectForm />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects?.map((subject) => (
                    <Card key={subject.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{subject.name}</CardTitle>
                            <DeleteSubjectButton id={subject.id} />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">{subject.description}</p>
                        </CardContent>
                    </Card>
                ))}
                {(!subjects || subjects.length === 0) && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No subjects found. Create one above!
                    </div>
                )}
            </div>
        </div>
    )
}
