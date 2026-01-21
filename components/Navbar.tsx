import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { GraduationCap, LogOut, User } from 'lucide-react'
import { signout } from '@/app/(auth)/actions'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:bg-gray-950/80 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
                    <GraduationCap className="h-8 w-8" />
                    <span>EduPro</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <form action={signout}>
                                <Button variant="ghost" size="icon" title="Sign out">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
