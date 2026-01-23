'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Check if logging in as admin with fixed credentials
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
        // Admin login successful - create a special admin session
        // We'll use Supabase auth with a special admin user that we create once
        // For now, we'll create a session marker and redirect
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            // Admin user doesn't exist in Supabase yet, but credentials are correct
            // Return error message to create admin user first
            return { error: 'Admin user not found. Please contact system administrator to set up admin account in Supabase.' }
        }

        revalidatePath('/', 'layout')
        redirect('/admin/dashboard')
    }

    // Regular student login
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as 'student' | 'admin' || 'student'

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // If email confirmation is enabled, we might need to handle that. 
    // For now, assuming auto-confirm or manual confirm.
    // We should also insert into public.profiles if the trigger didn't catch it 
    // (though triggers are best, we usually rely on Supabase to handle the user creation)
    // For this simplified setup, we rely on a PostgreSQL trigger to copy auth.users to public.profiles
    // OR we can do it manually here if we didn't set up the trigger.
    // Let's assume the user will set up the trigger or we should do it manually.
    // For robustness, let's insert into profiles manually if needed, but the plan was to use a trigger or just Auth metadata.
    // My schema had a profiles table. I should probably ensure it's populated.
    // Writing to public.profiles is better done via Trigger ideally. 
    // But let's try to insert if the trigger doesn't exist? No, better to stick to one pattern.
    // Accessing public.profiles from client/server might be restricted.
    // I will rely on the metadata in `auth.users` for role in the session, 
    // and `public.profiles` for application data.
    // I will add a trigger instruction in the `supabase_schema.sql` later if needed, 
    // or just write to profiles here.
    // Writing here:

    if (data.user) {
        // We rely on the trigger to create the profile.
        // However, if the trigger fails or is delayed, we might want to check or retry?
        // But for simplicity, we assume the trigger works.
        // If we also insert here, it might conflict if the trigger runs fast.
        // So we remove the manual insert.
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard') // Redirect directly to dashboard since email confirmation is disabled
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
    const supabase = await createClient()
    const email = (formData.get('email') as string || '').trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return { error: 'Please enter a valid email address' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectTo = `${siteUrl}/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: 'If an account exists for this email, a reset link has been sent.' }
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()
    const password = (formData.get('password') as string || '').trim()
    const confirmPassword = (formData.get('confirmPassword') as string || '').trim()

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }
    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters long' }
    }
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)
    const strength = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    if (strength < 2) {
        return { error: 'Use a stronger password (mix of cases, numbers, symbols)' }
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: 'Password updated successfully' }
}
