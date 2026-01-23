'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type ActionState = { error: string }

export async function createSubject(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Create subject
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    const { error } = await supabase.from('subjects').insert({
        name,
        description
    })

    if (error) {
        console.error('Error creating subject', error)
        return { error: error.message }
    }

    revalidatePath('/admin/subjects')
    revalidatePath('/dashboard')
    return { error: "" }
}
export async function deleteSubject(prevState: ActionState, formData: FormData) {

    const supabase = await createClient()
    const id = formData.get('id') as string

    // Collect quizzes for this subject
    const { data: quizzes, error: quizFetchError } = await supabase
        .from('quizzes')
        .select('id')
        .eq('subject_id', id)
    if (quizFetchError) {
        return { error: quizFetchError.message }
    }

    const quizIds = (quizzes || []).map(q => q.id)
    if (quizIds.length) {
        // Delete dependent results first (FK to quizzes)
        const { error: resultsDelError } = await supabase
            .from('results')
            .delete()
            .in('quiz_id', quizIds)
        if (resultsDelError) {
            return { error: resultsDelError.message }
        }

        // Delete questions for these quizzes
        const { error: questionsDelError } = await supabase
            .from('questions')
            .delete()
            .in('quiz_id', quizIds)
        if (questionsDelError) {
            return { error: questionsDelError.message }
        }

        // Delete the quizzes themselves
        const { error: quizzesDelError } = await supabase
            .from('quizzes')
            .delete()
            .in('id', quizIds)
        if (quizzesDelError) {
            return { error: quizzesDelError.message }
        }
    }

    // Delete videos belonging to subject
    const { error: videosDelError } = await supabase
        .from('videos')
        .delete()
        .eq('subject_id', id)
    if (videosDelError) {
        return { error: videosDelError.message }
    }

    // Delete subscriptions tied to subject
    const { error: subsDelError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('subject_id', id)
    if (subsDelError) {
        return { error: subsDelError.message }
    }

    // Finally delete subject
    const { error } = await supabase.from('subjects').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/subjects')
    revalidatePath('/dashboard')
}
