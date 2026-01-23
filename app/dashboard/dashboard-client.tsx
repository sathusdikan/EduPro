"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Clock, Crown, Lock, BookOpen, Trophy, TrendingUp, Sparkles, Zap, Award, User, Shield, BarChart, Star, ChevronRight, Brain, Target, Rocket, CheckCircle, Users, BookText, Video, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BillingHistory } from "./billing-history";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3
    }
  }
};

const shimmerVariants = {
  shimmer: {
    x: ["-100%", "100%"],
    transition: {
      duration: 1.5
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2
    }
  }
};

interface DashboardClientProps {
  profile: any;
  activePackage: any;
  subjects: any[];
  billingHistory: any[];
  hasActivePackage: boolean;
  daysRemaining: number;
}

export default function DashboardClient({
  profile,
  activePackage,
  subjects,
  billingHistory,
  hasActivePackage,
  daysRemaining
}: DashboardClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Subject icons for different subjects
  const subjectIcons = [BookOpen, Brain, Target, Rocket, Video, Music, BookText, Trophy];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 via-white/30 to-blue-50/30 dark:from-gray-950 dark:via-gray-900/30 dark:to-blue-950/20 overflow-hidden">
      {/* Animated floating particles - only render on client to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/5 to-purple-400/5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 40 - 20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ ease: "easeOut" }}
        className="container mx-auto p-4 md:p-6 space-y-8 relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="relative">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden group">
            {/* Animated shine effect */}
            <motion.div
              variants={shimmerVariants}
              animate="shimmer"
              transition={{ repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* Floating elements */}
            <motion.div
              variants={floatVariants}
              animate="float"
              transition={{ repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 right-10"
            >
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </motion.div>

            <motion.div
              variants={floatVariants}
              animate="float"
              transition={{ delay: 1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 left-10"
            >
              
            </motion.div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl w-fit"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-semibold">Welcome Back!</span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Hello,{" "}
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                      {profile.full_name || 'Student'}
                    </span>
                    ! 👋
                  </motion.h1>

                  <motion.p
                    className="text-xl text-blue-100 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {profile.email}
                  </motion.p>
                </div>

                <motion.div
                  variants={pulseVariants}
                  animate="pulse"
                  transition={{ repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-4 bg-white/20 backdrop-blur-sm px-6 py-5 rounded-2xl mt-9"
                >
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-xl">Premium Student</div>
                    <div className="text-sm opacity-90">Full Platform Access</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Package Status Card */}
        <motion.div variants={itemVariants}>
          {hasActivePackage ? (
            <Card className="relative border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/40 dark:to-emerald-900/40 backdrop-blur-lg shadow-2xl overflow-hidden group">
              {/* Animated glow border */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-lg opacity-20"
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Shine effect */}
              <motion.div
                variants={shimmerVariants}
                animate="shimmer"
                transition={{ repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <CardHeader>
                <motion.div
                  className="flex flex-col md:flex-row items-start justify-between gap-6"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl"
                    >
                      <Crown className="h-9 w-9 text-white" />
                    </motion.div>
                    <div className="space-y-3">
                      <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
                        {activePackage.package?.name || 'Active Package'}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <p className="text-green-800 dark:text-green-300 font-medium text-lg">
                          Full access to all premium content
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <motion.div
                      variants={pulseVariants}
                      animate="pulse"
                      transition={{ repeat: Infinity, ease: "easeInOut" }}
                      className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-7 py-4 rounded-full font-bold shadow-xl"
                    >
                      <Clock className="h-6 w-6" />
                      <span className="text-xl">{daysRemaining} days left</span>
                    </motion.div>
                    <motion.p
                      className="text-sm text-green-800 dark:text-green-400 font-medium"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Expires {new Date(activePackage.end_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </motion.p>
                  </div>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <motion.div
                      className="p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 border-2 border-green-200/50 dark:border-green-800/50 hover:border-green-400 dark:hover:border-green-400 group/card"
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-5">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="p-4 bg-green-100 dark:bg-green-900/50 rounded-xl"
                        >
                          <Calendar className="h-7 w-7 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Started On</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">
                            {new Date(activePackage.start_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.div
                      className="p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 border-2 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-400 group/card"
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-5">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl"
                        >
                          <Award className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Package Status</p>
                          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            Active & Renewing
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          ) : (
            <Card className="relative border-2 border-orange-300/50 dark:border-orange-700/50 bg-gradient-to-br from-orange-50/90 to-red-50/90 dark:from-orange-900/40 dark:to-red-900/40 backdrop-blur-lg shadow-2xl overflow-hidden group">
              {/* Pulsing glow */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-lg"
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <CardContent className="p-8 relative z-10">
                <motion.div
                  className="flex flex-col md:flex-row items-center justify-between gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="p-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-xl"
                    >
                      <Lock className="h-10 w-10 text-white" />
                    </motion.div>
                    <div className="space-y-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-orange-800 dark:text-orange-300">
                        Unlock Premium Access
                      </h3>
                      <p className="text-orange-700 dark:text-orange-400 font-medium text-lg max-w-lg">
                        Upgrade your plan to access all subjects, premium features, and exclusive content.
                      </p>
                    </div>
                  </div>
                  <Link href="/pricing" className="group/button">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg"
                        animate={{
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <button className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-5 rounded-xl font-bold text-lg shadow-2xl">
                        View Pricing Plans
                      </button>
                    </motion.div>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BarChart className="h-8 w-8 text-blue-600" />
               <h1 className="text-gray-900 dark:text-white">Quick Stats</h1>

              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200/50 dark:border-blue-800/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">{subjects.length}</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">Subjects Available</div>
                </motion.div>

                <motion.div
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200/50 dark:border-green-800/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-800 dark:text-green-300">{billingHistory.length}</div>
                  <div className="text-green-600 dark:text-green-400 font-medium">Packages Purchased</div>
                </motion.div>

                <motion.div
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200/50 dark:border-purple-800/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-purple-800 dark:text-purple-300">5.0</div>
                  <div className="text-purple-600 dark:text-purple-400 font-medium">Average Rating</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subjects Grid */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-indigo-200/50 dark:border-indigo-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Brain className="h-8 w-8 text-indigo-600" />
               
                <h1 className="text-gray-900 dark:text-white"> Available Subjects</h1>

              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {subjects.map((subject, index) => {
                  const IconComponent = subjectIcons[index % subjectIcons.length];
                  return (
                    <motion.div key={subject.id} variants={itemVariants}>
                      <Link href={`/subjects/${subject.id}`}>
                        <motion.div
                          className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-400 dark:hover:border-indigo-400 group cursor-pointer"
                          whileHover={{ y: -5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl"
                            >
                              <IconComponent className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{subject.name}</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{subject.description}</p>
                            </div>
                            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing History */}
        <motion.div variants={itemVariants}>
          <BillingHistory history={billingHistory} />
        </motion.div>
      </motion.div>

      
    </div>
  );
}