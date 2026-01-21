'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function addQuestion(formData: FormData) {
    const supabase = await createClient()

    const quizId = formData.get('quizId') as string
    const question = formData.get('question') as string
    const optionA = formData.get('optionA') as string
    const optionB = formData.get('optionB') as string
    const optionC = formData.get('optionC') as string
    const optionD = formData.get('optionD') as string
    const correctAnswer = formData.get('correctAnswer') as string

    const { error } = await supabase.from('questions').insert({
        quiz_id: quizId,
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer
    })

    if (error) {
        console.error('Error adding question', error)
    }

    revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function deleteQuestion(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const quizId = formData.get('quizId') as string

    const { error } = await supabase.from('questions').delete().eq('id', id)

    if (error) {
        console.error('Error deleting question', error)
    }

    revalidatePath(`/admin/quizzes/${quizId}`)
}
