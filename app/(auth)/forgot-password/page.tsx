'use client'

import { useState } from 'react'
import { requestPasswordReset } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2, Sparkles, Send } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            className="w-full group relative overflow-hidden"
            type="submit"
            disabled={pending}
            size="lg"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                </>
            ) : (
                <>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Reset Link
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                </>
            )}
        </Button>
    )
}

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [email, setEmail] = useState('')

    const handleSubmit = async (formData: FormData) => {
        setError(null)
        setSuccess(null)

        const result = await requestPasswordReset(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setSuccess(result.success)
            setEmail('') // Clear the email field on success
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950/20">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="relative border-2 border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-x-16 -translate-y-16" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full translate-x-16 translate-y-16" />

                    {/* Floating sparkles */}
                    <div className="absolute top-4 right-4">
                        <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
                    </div>

                    <CardHeader className="space-y-3 text-center relative z-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                        >
                            <Mail className="h-8 w-8 text-white" />
                        </motion.div>

                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Reset Password
                            </CardTitle>
                            <CardDescription className="text-base">
                                Enter your email and we&#39;ll send you a reset link
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950/30">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="font-medium">
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert variant="default" className="border-green-300 bg-green-50 dark:bg-green-950/30">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="font-medium text-green-700 dark:text-green-400">
                                            {success}
                                        </AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!success && (
                            <form action={handleSubmit} className="space-y-5">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-3"
                                >
                                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="student@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <SubmitButton />
                                </motion.div>
                            </form>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 text-center relative z-10">
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>

                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Remember your password?{' '}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                {/* Additional info */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-800/50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Secure & encrypted</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Quick recovery</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
