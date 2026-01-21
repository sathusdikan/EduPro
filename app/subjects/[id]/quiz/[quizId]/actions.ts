'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitQuiz(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const quizId = formData.get('quizId') as string

    // Fetch correct answers
    const { data: questions } = await supabase
        .from('questions')
        .select('id, correct_answer')
        .eq('quiz_id', quizId)

    if (!questions) {
        console.error('No questions found')
        return
    }


    let score = 0
    const userAnswers: Record<string, string> = {};

    questions.forEach(q => {
        const userAnswer = formData.get(q.id) as string
        if (userAnswer) {
            userAnswers[q.id] = userAnswer;
        }
        if (userAnswer === q.correct_answer) {
            score++
        }
    })

    // Save result
    const { error } = await supabase.from('results').insert({
        user_id: user.id,
        quiz_id: quizId,
        score: score,
        total_questions: questions.length
    })

    if (error) {
        console.error('Error saving result', error)
        return // or handle error better
    }

    // Pass results as query params or similar to a results page
    const answersParam = encodeURIComponent(JSON.stringify(userAnswers));
    redirect(`/subjects/results/${quizId}?score=${score}&total=${questions.length}&answers=${answersParam}`)
}
