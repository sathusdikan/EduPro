import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Video, BrainCircuit, Sparkles, Star, Zap, Target, Trophy, Users, Clock, Shield, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { useMemo } from "react";
export default function Home() {
  const features = [
    {
      icon: Video,
      title: "HD Video Lessons",
      description: "Cinematic-quality video tutorials with expert instructors",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      delay: 100
    },
    {
      icon: BookOpen,
      title: "Smart Notes",
      description: "Interactive study materials with spaced repetition",
      color: "from-purple-500 to-pink-500",
      bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      delay: 200
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Quizzes",
      description: "Adaptive quizzes that adjust to your learning pace",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      delay: 300
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Custom learning paths based on your goals",
      color: "from-amber-500 to-orange-500",
      bg: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      delay: 400
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Visual analytics to monitor your improvement",
      color: "from-violet-500 to-indigo-500",
      bg: "bg-gradient-to-br from-violet-500/10 to-indigo-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
      delay: 500
    },
    {
      icon: Users,
      title: "Live Doubt Sessions",
      description: "24/7 live support from expert mentors",
      color: "from-rose-500 to-red-500",
      bg: "bg-gradient-to-br from-rose-500/10 to-red-500/10",
      iconColor: "text-rose-600 dark:text-rose-400",
      delay: 600
    }
  ];

  const stats = [
    { icon: GraduationCap, value: "10K+", label: "Students Enrolled" },
    { icon: Star, value: "4.9/5", label: "Student Rating" },
    { icon: Clock, value: "500+", label: "Hours of Content" },
    { icon: Shield, value: "98%", label: "Success Rate" }
  ];
  const particles = useMemo(
    () =>
      [...Array(3)].map((_, i) => ({
        id: i,
        size: Math.random() * 8 + 4,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 3,
        delay: i * 0.5,
      })),
    []
  );
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/20 dark:from-gray-950 dark:via-blue-950/10 dark:to-emerald-950/5">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-8 relative z-10">
          <Reveal className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm mb-4">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Transform Your Learning Journey
              </span>
            </div>
          </Reveal>

          <Reveal className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Master Science
              </span>
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mt-4">
                With <span className="relative">
                  <span className="text-blue-600 dark:text-blue-400">Edu</span>
                  <span className="text-purple-600 dark:text-purple-400">Pro</span>
                  <span className="absolute -top-2 -right-6">
                    <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
                  </span>
                </span>
              </span>
            </h1>
          </Reveal>

          <Reveal className="animate-fade-in-up">
            <p className="max-w-[800px] mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Premium education platform offering immersive learning in{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">Mathematics</span>,{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">Physics</span>,{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Chemistry</span>,{" "}
              <span className="font-semibold text-pink-600 dark:text-pink-400">Biology</span>
            </p>
          </Reveal>

          {/* Stats Section */}
          <Reveal className="animate-fade-in-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className={`h-5 w-5 ${
                      idx === 0 ? "text-blue-500" :
                      idx === 1 ? "text-yellow-500" :
                      idx === 2 ? "text-purple-500" : "text-emerald-500"
                    }`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link href="/pricing" className="group">
                <Button 
                  size="lg" 
                  className="rounded-full px-10 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-500/25"
                >
                  <span className="flex items-center gap-2">
                    Explore Plans
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/login" className="group">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-10 py-6 text-lg font-semibold border-2 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500 group-hover:animate-pulse" />
                    Start Learning Now
                  </span>
                </Button>
              </Link>
            </div>
          </Reveal>

          {/* Floating particles */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rounded-full blur-sm"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <Reveal className="animate-fade-in-up text-center mb-16">
            <div className="inline-block mb-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Why Choose EduPro?
                </span>
              </h2>
              <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              Experience learning like never before with our cutting-edge features
            </p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <Reveal 
                key={idx} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className="group h-full p-6 rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 cursor-pointer">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}></div>
                  
                  {/* Icon container */}
                  <div className={`relative mb-6 p-4 rounded-2xl w-fit ${feature.bg}`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    
                    {/* Floating particles around icon */}
                       <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full bg-gradient-to-r ${feature.color}`}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: 0.3,

              animationName: "float",
              animationDuration: `${p.duration}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                  
                  {/* Learn more indicator */}
                  {/* <div className="mt-6 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div> */}
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA Section */}
          <Reveal className="animate-fade-in-up mt-20">
            <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Transform Your Learning?
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Join thousands of successful students who have mastered science with EduPro
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/pricing">
                    <Button 
                      size="lg" 
                      className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        View All Plans
                      </span>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full px-8 py-6 text-lg border-2 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 transition-all"
                    >
                      Start 3-Day Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}