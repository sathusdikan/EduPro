'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createQuiz(formData: FormData) {
    const supabase = await createClient()

    const subjectId = formData.get('subjectId') as string
    const title = formData.get('title') as string
    const durationStr = (formData.get('duration') as string) || '0'
    const duration = parseInt(durationStr, 10)

    const payload: { subject_id: string; title: string; duration_minutes?: number } = { subject_id: subjectId, title }
    if (!Number.isNaN(duration) && duration > 0) {
        payload['duration_minutes'] = duration
    }

    const { error } = await supabase.from('quizzes').insert(payload)

    if (error) {
        console.error('Error creating quiz', error)
        // return { error: error.message }
    }

    revalidatePath('/admin/quizzes')
}

export async function deleteQuiz(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    // Note: This will fail if foreign keys (questions) exist and cascade is not set.
    // Assuming cascade delete is set or we delete questions first.
    // Ideally we should delete questions first.
    // Supabase usually sets cascade if defined in DDL, my DDL didn't explicitly say 'on delete cascade' everywhere.
    // I should perform manual deletion of questions first just to be safe.

    await supabase.from('questions').delete().eq('quiz_id', id)

    const { error } = await supabase.from('quizzes').delete().eq('id', id)

    if (error) {
        console.error('Error deleting quiz', error)
        // return { error: error.message }
    }

    revalidatePath('/admin/quizzes')
}
