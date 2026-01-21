import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { quizId, answers } = body; // answers is an object: { questionId: 'a'|'b'|'c'|'d' }

        if (!quizId || !answers) {
            return NextResponse.json({ error: 'Missing quizId or answers' }, { status: 400 });
        }

        // Fetch all questions for this quiz with correct answers
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('id, correct_answer, points')
            .eq('quiz_id', quizId);

        if (questionsError || !questions) {
            return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
        }

        // Calculate score
        let earnedPoints = 0;
        let totalPoints = 0;
        let correctCount = 0;
        const totalQuestions = questions.length;

        const questionResults: any[] = [];

        questions.forEach((question) => {
            totalPoints += question.points;
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correct_answer;

            if (isCorrect) {
                earnedPoints += question.points;
                correctCount++;
            }

            questionResults.push({
                questionId: question.id,
                userAnswer,
                correctAnswer: question.correct_answer,
                isCorrect,
                points: question.points,
                earnedPoints: isCorrect ? question.points : 0
            });
        });

        const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

        // Save result to database
        const { data: result, error: resultError } = await supabase
            .from('results')
            .insert({
                user_id: user.id,
                quiz_id: quizId,
                score: correctCount,
                total_questions: totalQuestions,
                total_points: totalPoints,
                earned_points: earnedPoints,
                percentage: parseFloat(percentage.toFixed(2))
            })
            .select()
            .single();

        if (resultError) {
            console.error('Error saving result:', resultError);
            return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            result: {
                id: result.id,
                correctCount,
                totalQuestions,
                earnedPoints,
                totalPoints,
                percentage: percentage.toFixed(2),
                questionResults
            }
        });

    } catch (error) {
        console.error('Quiz grading error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
