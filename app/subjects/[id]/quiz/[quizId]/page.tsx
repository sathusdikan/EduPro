import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { submitQuiz } from "./actions";
import { redirect } from "next/navigation";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { canAccessContent } from "@/lib/access-control";
import { BackButton } from "@/components/ui/back-button";
import { Progress } from "@/components/ui/progress";
import QuizTimer from "@/components/ui/quiz-timer";

interface PageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default async function QuizPage(props: PageProps) {
  const params = await props.params;
  const { id: subjectId, quizId } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const hasAccess = await canAccessContent(user.id);
  if (!hasAccess) redirect(`/subjects/${subjectId}`);

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("created_at");

  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-gray-900 p-4 md:p-6">
      <div className="container mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-lg">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <BackButton href={`/subjects/${subjectId}`} />

              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                  <span className="text-gray-600 dark:text-gray-400">
  {questions?.length || 0} Questions
</span>

                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  <Trophy className="h-4 w-4" />
                  <span>{quiz.points || 100} Points</span>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                  {quiz.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>All questions required</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Review before submit</span>
              </div>
            </div>
          </div>
        </Card>

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              Quiz Progress
            </span>
            <span className="font-semibold text-primary">
              0/{questions?.length || 0}
            </span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        {/* TIMER */}
        {quiz.duration_minutes ? (
          <QuizTimer minutes={quiz.duration_minutes} formId="quizForm" />
        ) : null}

        {/* QUESTIONS */}
        <form id="quizForm" action={submitQuiz} className="space-y-6">
          <input type="hidden" name="quizId" value={quizId} />

          {questions?.map((q, index) => (
            <Card
              key={q.id}
              className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition"
            >
              <CardHeader>
                <div className="flex gap-4">
                <div className="
  w-10 h-10 rounded-full 
  flex items-center justify-center 
  font-bold
  bg-gray-100 dark:bg-gray-800
  text-gray-900 dark:text-gray-100
">
  {index + 1}
</div>

                  <CardTitle className="text-lg text-gray-800 dark:text-gray-100">
                    {q.question}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {[
                  { value: "a", label: q.option_a },
                  { value: "b", label: q.option_b },
                  { value: "c", label: q.option_c },
                  { value: "d", label: q.option_d },
                ].map((opt) => (
                <label
  key={opt.value}
  className="
    flex items-center gap-4 p-4 rounded-xl cursor-pointer
    border transition-all
    border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-gray-900
    text-gray-900 dark:text-gray-100
    hover:bg-gray-100 dark:hover:bg-gray-800
    hover:border-gray-300 dark:hover:border-gray-600
    peer-checked:bg-gray-200 dark:peer-checked:bg-gray-800
    peer-checked:border-gray-400 dark:peer-checked:border-gray-600
  "
>

                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      required
                      className="hidden peer"
                    />
                    <span className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold
                      border-gray-300 dark:border-gray-600
                      peer-checked:bg-primary peer-checked:text-white">
                      {opt.value.toUpperCase()}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </CardContent>

              {q.explanation && (
                <CardFooter className="text-sm italic text-gray-500 dark:text-gray-400">
                  💡 {q.explanation}
                </CardFooter>
              )}
            </Card>
          ))}

          {/* SUBMIT */}
          <Card className="border border-primary/20 shadow-xl bg-white dark:bg-gray-900 sticky bottom-6">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  Ready to submit?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Make sure all questions are answered
                </p>
              </div>

           <Button
  type="submit"
  size="lg"
  className="
    bg-blue-600 hover:bg-blue-700
    text-white
    transition-all
    hover:scale-105
    dark:bg-blue-600 dark:hover:bg-blue-700
  "
>

                Submit Quiz 
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
