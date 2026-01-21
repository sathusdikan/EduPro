const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('Seeding data...');

    // 1. Create a Subject
    const { data: subject, error: subjectError } = await supabase
        .from('subjects')
        .insert({
            name: 'Introduction to Physics',
            description: 'Learn the basics of motion, energy, and forces.'
        })
        .select()
        .single();

    if (subjectError) {
        console.error('Error creating subject:', subjectError);
        return;
    }
    console.log('Created Subject:', subject.name);

    // 2. Create a Video
    const { error: videoError } = await supabase
        .from('videos')
        .insert({
            subject_id: subject.id,
            title: 'Newton\'s Laws',
            youtube_url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds' // Random educational video
        });

    if (videoError) console.error('Error creating video:', videoError);
    else console.log('Created Video: Newton\'s Laws');

    // 3. Create a Quiz
    const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
            subject_id: subject.id,
            title: 'Physics Basics Quiz'
        })
        .select()
        .single();

    if (quizError) {
        console.error('Error creating quiz:', quizError);
        return;
    }
    console.log('Created Quiz:', quiz.title);

    // 4. Create Questions
    const { error: questionsError } = await supabase
        .from('questions')
        .insert([
            {
                quiz_id: quiz.id,
                question: 'What is the unit of Force?',
                option_a: 'Joule',
                option_b: 'Newton',
                option_c: 'Watt',
                option_d: 'Pascal',
                correct_answer: 'b'
            },
            {
                quiz_id: quiz.id,
                question: 'F = ma is which law?',
                option_a: 'First',
                option_b: 'Second',
                option_c: 'Third',
                option_d: 'Fourth',
                correct_answer: 'b'
            }
        ]);

    if (questionsError) console.error('Error creating questions:', questionsError);
    else console.log('Created Questions for Quiz');

    console.log('Seeding complete! Refresh your dashboard.');
}

seed();
