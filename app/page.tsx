import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950/50">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
            Master Science with <span className="text-blue-600">EduPro</span>
          </h1>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
            Premium education in Mathematics, Physics, Chemistry, and Biology.
            Detailed video lessons, interactive quizzes, and progress tracking.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="rounded-full px-8">View Pricing <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8">Login</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full dark:bg-blue-900/20 text-blue-600">
                <Video className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">HD Video Lessons</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Access high-quality video tutorials curated by experts for in-depth understanding.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-purple-100 rounded-full dark:bg-purple-900/20 text-purple-600">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Comprehensive Notes</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Detailed study materials and notes for every subject to help you revise better.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full dark:bg-green-900/20 text-green-600">
                <BrainCircuit className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Interactive Quizzes</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Test your knowledge with subject-wise quizzes and track your improvements real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
