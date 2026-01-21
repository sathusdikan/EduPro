'use client'

import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? 'Registering...' : 'Register'}
        </Button>
    )
}

export default function RegisterPage() {
    const [passwordError, setPasswordError] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData) => {
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // Validate passwords match
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        // Validate password length
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters')
            return
        }

        setPasswordError('')
        setError('')

        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
                    <CardDescription>
                        Create your student account to start learning
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="fullName">Full Name</label>
                            <Input id="fullName" name="fullName" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email">Email</label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                minLength={6}
                                required
                            />
                        </div>
                        {passwordError && (
                            <p className="text-sm text-red-600">{passwordError}</p>
                        )}
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                        <input type="hidden" name="role" value="student" />
                        <SubmitButton />
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
