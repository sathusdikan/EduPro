import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import CheckoutForm from "./checkout-form"; // Client component for the form logic

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/checkout/${id}`);
  }

  // Fetch Package Details
  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();

  if (!pkg) {
    return (
      <div className="container mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Package Not Found</h1>
        <p>The package you are trying to purchase does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
          <p className="text-gray-500">
            Complete your purchase to unlock premium access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-900 shadow-lg rounded-lg transition-colors duration-300">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-lg">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-gray-800 dark:text-gray-300">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pkg.description}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Duration
                  </span>
                  <span className="font-medium">
                    {pkg.duration_months === 0
                      ? "3 Days"
                      : `${pkg.duration_months} Month${pkg.duration_months > 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-xl font-bold text-blue-600 dark:text-blue-400">
                  <span>Total</span>
                  <span>₹{pkg.price}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 text-xs text-center text-gray-500 dark:text-gray-400 p-4 rounded-b-lg">
                Active immediately after payment.
              </CardFooter>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg rounded-lg border border-transparent hover:border-blue-400 dark:hover:border-blue-600 transition-colors duration-300 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-lg">
                  <CreditCard className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors duration-300" />
                  Payment Details
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Enter your card details to process the payment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* CheckoutForm component handles inputs */}
                <CheckoutForm
                  packageId={pkg.id}
                  userId={user.id}
                  price={pkg.price}
                />
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 select-none">
              <Lock className="h-4 w-4" />
              Payments are secure and encrypted.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
