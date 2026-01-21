import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addVideo, deleteVideo } from "./actions";
import { Trash2, ArrowLeft, Video } from "lucide-react";
import Link from 'next/link';
import { redirect } from "next/navigation";

export default async function VideosPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') redirect('/dashboard');

    const { data: subjects } = await supabase.from('subjects').select('*');
    const { data: videos } = await supabase.from('videos').select('*, subjects(name)').order('created_at', { ascending: false });

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h1 className="text-3xl font-bold">Manage Videos</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Video</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addVideo} className="flex flex-col md:flex-row gap-4 items-end">
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
                        <div className="grid gap-2 w-full md:w-1/3">
                            <label htmlFor="title" className="text-sm font-medium">Video Title</label>
                            <Input id="title" name="title" placeholder="Lesson 1: Introduction" required />
                        </div>
                        <div className="grid gap-2 w-full md:w-1/3">
                            <label htmlFor="youtubeUrl" className="text-sm font-medium">YouTube URL</label>
                            <Input id="youtubeUrl" name="youtubeUrl" placeholder="https://youtube.com/..." required />
                        </div>
                        <Button type="submit">Add Video</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {videos?.map((video) => (
                    <Card key={video.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Video className="h-8 w-8 text-blue-500" />
                                <div>
                                    <h3 className="font-bold">{video.title}</h3>
                                    <p className="text-sm text-gray-500">{(video.subjects as any)?.name}</p>
                                    <a href={video.youtube_url || '#'} target="_blank" className="text-xs text-blue-600 hover:underline">{video.youtube_url}</a>
                                </div>
                            </div>
                            <form action={deleteVideo}>
                                <input type="hidden" name="id" value={video.id} />
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ))}
                {(!videos || videos.length === 0) && (
                    <div className="text-center text-gray-500 py-8">
                        No videos uploaded yet.
                    </div>
                )}
            </div>
        </div>
    )
}
