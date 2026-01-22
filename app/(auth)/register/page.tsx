'use client'

import { useState } from 'react'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { 
  Eye, EyeOff, Mail, Lock, User, CheckCircle, XCircle, AlertCircle, 
  Loader2, Sparkles, ArrowRight, BookOpen, GraduationCap, Shield, 
  Check, ChevronRight
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button 
            className="w-full group relative overflow-hidden h-12 text-base font-semibold" 
            type="submit" 
            disabled={pending}
            size="lg"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                </>
            ) : (
                <>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Create Student Account
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                </>
            )}
        </Button>
    )
}

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Password strength indicators
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    })

    const checkPasswordStrength = (password: string) => {
        setPasswordStrength({
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        })
    }

    const calculateStrengthScore = () => {
        const requirements = Object.values(passwordStrength)
        return (requirements.filter(Boolean).length / requirements.length) * 100
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'password') {
            checkPasswordStrength(value)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // Validate passwords match
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        // Validate password requirements
        if (calculateStrengthScore() < 60) {
            setPasswordError('Please use a stronger password')
            return
        }

        setPasswordError('')
        setError('')

        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
        }
        // On success, the server action redirects
    }

    const strengthScore = calculateStrengthScore()
    const strengthColor = strengthScore >= 80 ? 'bg-green-500' : 
                         strengthScore >= 60 ? 'bg-yellow-500' : 
                         strengthScore >= 40 ? 'bg-orange-500' : 'bg-red-500'

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-emerald-950/10">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-200/10 to-emerald-200/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl"
            >
                <Card className="relative border-2 border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full -translate-x-20 -translate-y-20" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-emerald-500/10 rounded-full translate-x-20 translate-y-20" />
                    
                    {/* Floating icons */}
                    <div className="absolute top-6 right-6">
                        <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
                    </div>
                    <div className="absolute bottom-6 left-6">
                        <GraduationCap className="h-6 w-6 text-blue-500" />
                    </div>

                    <CardHeader className="space-y-4 text-center relative z-10 px-8 pt-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-600 flex items-center justify-center shadow-lg"
                        >
                            <BookOpen className="h-10 w-10 text-white" />
                        </motion.div>
                        
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                Join Our Learning Community
                            </CardTitle>
                            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                                Start your educational journey with personalized learning
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10 px-8">
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

                        <form action={handleSubmit} className="space-y-6">
                            {/* Student Benefits */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
                            >
                             
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {/* Left Column */}
                                <div className="space-y-5">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-3"
                                    >
                                        <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                placeholder="John Doe"
                                                required
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="pl-10 h-12 border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            />
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
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
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="pl-10 h-12 border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                        <p className="text-xs text-gray-500">We'll send a verification email</p>
                                    </motion.div>
                                </div>

                                {/* Right Column - Password Section */}
                                <div className="space-y-5">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-3"
                                    >
                                        <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                placeholder="Create a strong password"
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Password Strength Meter */}
                                        {formData.password && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Password Strength
                                                    </span>
                                                    <span className="text-xs font-semibold" style={{ 
                                                        color: strengthScore >= 80 ? '#10B981' : 
                                                               strengthScore >= 60 ? '#F59E0B' : 
                                                               strengthScore >= 40 ? '#F97316' : '#EF4444'
                                                    }}>
                                                        {strengthScore >= 80 ? 'Strong' : 
                                                         strengthScore >= 60 ? 'Good' : 
                                                         strengthScore >= 40 ? 'Fair' : 'Weak'}
                                                    </span>
                                                </div>
                                                <Progress value={strengthScore} className="h-2" />
                                                
                                                {/* Password Requirements */}
                                                <div className="space-y-2 mt-3">
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Requirements:
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { key: 'hasMinLength', text: 'At least 8 characters' },
                                                            { key: 'hasUpperCase', text: 'One uppercase letter' },
                                                            { key: 'hasLowerCase', text: 'One lowercase letter' },
                                                            { key: 'hasNumber', text: 'One number' },
                                                            { key: 'hasSpecialChar', text: 'One special character' }
                                                        ].map((req) => (
                                                            <div key={req.key} className="flex items-center gap-2">
                                                                {passwordStrength[req.key as keyof typeof passwordStrength] ? (
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4 text-gray-300" />
                                                                )}
                                                                <span className={`text-xs ${passwordStrength[req.key as keyof typeof passwordStrength] ? 'text-green-600' : 'text-gray-500'}`}>
                                                                    {req.text}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-3"
                                    >
                                        <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                placeholder="Re-enter your password"
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordError && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm text-red-600 flex items-center gap-2"
                                            >
                                                <AlertCircle className="h-4 w-4" />
                                                {passwordError}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Hidden role field */}
                            <input type="hidden" name="role" value="student" />

                            {/* Terms and Conditions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30"
                            >
                                <div className="flex items-center gap-3 mx-auto">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              



  <label
    htmlFor="terms"
    className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
  >
    I agree to the{' '}
    <Link
      href="/terms"
      className="font-medium text-blue-600 hover:underline"
    >
      Terms of Service
    </Link>{' '}
    and{' '}
    <Link
      href="/privacy"
      className="font-medium text-blue-600 hover:underline"
    >
      Privacy Policy
    </Link>
 
  </label>
</div>

                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <SubmitButton />
                            </motion.div>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-900 px-3 text-gray-500 dark:text-gray-400">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center"
                        >
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300/50 hover:border-blue-400 dark:border-gray-700/50 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all group"
                            >
                                <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </motion.div>
                    </CardContent>

              
                </Card>

           
            </motion.div>

        </div>
    )
}