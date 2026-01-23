import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Star, Zap, Shield, Sparkles, Target, TrendingUp, Award, Clock, Users, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function PricingPage() {
  const supabase = await createClient();

  // Fetch all active packages
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  // Feature icons for decoration
  const featureIcons = [
    { icon: Zap, color: "text-yellow-500" },
    { icon: Shield, color: "text-blue-500" },
    { icon: Sparkles, color: "text-purple-500" },
    { icon: Target, color: "text-red-500" },
    { icon: TrendingUp, color: "text-green-500" },
    { icon: Award, color: "text-pink-500" },
  ];

  // Popular packages (for badges)
  const popularPackages = ["premium", "pro", "unlimited"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl dark:bg-blue-600/10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl dark:bg-purple-600/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl dark:from-blue-700/10 dark:to-purple-700/10"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:scale-105 transition-transform">
            <Star className="h-3.5 w-3.5 mr-2 text-blue-500" />
            Most Loved by Students
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Choose Your Learning Journey
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Unlock premium educational content, interactive quizzes, and track your progress with our flexible learning packages
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["24/7 Access", "Certificate Included", "Mobile Friendly", "Community Support", "Progress Tracking", "Live Sessions"].map((feature, idx) => {
              const Icon = featureIcons[idx]?.icon || Check;
              return (
                <div 
                  key={feature} 
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all duration-300 group"
                >
                  <Icon className={`h-4 w-4 ${featureIcons[idx]?.color || 'text-blue-500'} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing cards */}
        {packages && packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto ">
            {packages.map((pkg: any, index: number) => {
              const isPopular = popularPackages.includes(pkg.name.toLowerCase());
              
              return (
                <div 
                  key={pkg.id} 
                  className={`relative group animate-in fade-in duration-700 slide-in-from-bottom-8 delay-${index * 200}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-6 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Glow effect for popular card */}
                  {isPopular && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  )}

                <Card
  className={`relative h-full overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02]
    bg-white dark:bg-gray-900
    ${isPopular
      ? 'border-yellow-400/50 dark:border-yellow-500/50 shadow-2xl shadow-yellow-500/10 dark:shadow-yellow-500/20'
      : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600'
    }`}
>

                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 -rotate-45 translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                    </div>

                    <CardHeader className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                          {pkg.name}
                        </CardTitle>
                        {pkg.duration_months >= 12 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Best Value
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                        {pkg.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative space-y-6">
                      {/* Price section */}
                      <div className="text-center py-4 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            ₹{pkg.price}
                          </span>
                          {pkg.price > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{Math.round(pkg.price * 1.2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {pkg.duration_months} month{pkg.duration_months > 1 ? 's' : ''}
                          </span>
                          {pkg.price > 0 && (
                            <span className="text-green-600 font-medium">
                              • Save 20%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            <p className="font-semibold text-gray-700 dark:text-gray-300">What's included:</p>
                          </div>
                          <ul className="space-y-3">
                            {pkg.features.map((feature: string, index: number) => (
                              <li 
                                key={index} 
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group/feature"
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  <Check className="h-5 w-5 text-green-500 group-hover/feature:scale-110 transition-transform" />
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/feature:translate-x-1 transition-transform">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-center p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 hover:scale-105 transition-transform">
                          <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
                          <div className="font-bold text-blue-600 dark:text-blue-400">500+</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 hover:scale-105 transition-transform">
                          <Globe className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                          <div className="font-bold text-purple-600 dark:text-purple-400">98%</div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="relative pt-0">
                      <Link href={`/checkout/${pkg.id}`} className="w-full group/button">
                        <Button 
                          className={`w-full h-12 text-base font-semibold transition-all duration-500 
                            ${isPopular 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/25' 
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            }`}
                          size="lg"
                        >
                          <span className="flex items-center justify-center gap-2">
                            {pkg.price === 0 ? (
                              <>
                                Start Free Trial
                                <Zap className="h-4 w-4 group-hover/button:animate-pulse" />
                              </>
                            ) : (
                              <>
                                Get Started
                                <Sparkles className="h-4 w-4 group-hover/button:rotate-180 transition-transform duration-500" />
                              </>
                            )}
                          </span>
                        </Button>
                      </Link>
                    </CardFooter>

                    {/* Animated border on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300/30 dark:group-hover:border-blue-500/30 rounded-xl transition-all duration-700 pointer-events-none"></div>
                  </Card>

                  {/* Floating elements */}
                  <div className="absolute -z-10 top-4 -right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-all duration-700"></div>
                  <div className="absolute -z-10 bottom-4 -left-4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl group-hover:bg-purple-400/20 transition-all duration-700"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-700">
            <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 text-lg mb-4">No packages available at the moment.</p>
              <Button variant="outline" className="animate-pulse">
                Check Back Soon
              </Button>
            </div>
          </div>
        )}

    

        {/* FAQ Preview */}
        <div className="mt-16 max-w-3xl mx-auto animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I upgrade my plan later?",
                a: "Yes! You can upgrade anytime. You'll only pay the difference pro-rated.",
                icon: TrendingUp
              },
              {
                q: "Is there a free trial?",
                a: "Yes, our basic plan includes a 14-day free trial with full access.",
                icon: Zap
              },
              {
                q: "Do you offer student discounts?",
                a: "We offer special discounts for students. Contact our support team.",
                icon: Award
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely! Cancel anytime with no hidden fees or penalties.",
                icon: Shield
              },
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${idx % 2 === 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} group-hover:scale-110 transition-transform`}>
                    <faq.icon className={`h-5 w-5 ${idx % 2 === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{faq.q}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}