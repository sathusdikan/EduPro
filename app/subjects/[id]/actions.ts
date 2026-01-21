'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function subscribeToSubject(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const subjectId = formData.get('subjectId') as string
    const date = new Date()
    const month = date.getMonth() + 1 // 1-12
    const year = date.getFullYear()

    // Simulate successful payment
    const { error } = await supabase.from('subscriptions').upsert({
        user_id: user.id,
        subject_id: subjectId,
        month,
        year,
        is_active: true
    }, {
        onConflict: 'user_id, subject_id, month, year'
    })

    if (error) {
        console.error('Subscription error:', error)
        redirect(`/subjects/${subjectId}?error=subscription_failed`)
    }

    revalidatePath(`/subjects/${subjectId}`)
}
