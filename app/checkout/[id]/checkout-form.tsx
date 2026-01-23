"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { processPayment } from "@/app/actions/payment";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  packageId: string;
  userId: string;
  price: number;
}

interface FormErrors {
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}

export default function CheckoutForm({
  packageId,
  userId,
  price,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const router = useRouter();

  function validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, "");
    return /^\d{16}$/.test(cleaned);
  }

  function validateExpiry(expiry: string): boolean {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const expiryDate = new Date(year, month - 1);
    return expiryDate >= now;
  }

  function validateCVC(cvc: string): boolean {
    return /^\d{3}$/.test(cvc);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    const formData = new FormData(event.currentTarget);
    const cardName = formData.get("cardName") as string;
    const cardNumber = formData.get("cardNumber") as string;
    const expiry = formData.get("expiry") as string;
    const cvc = formData.get("cvc") as string;

    const errors: FormErrors = {};

    if (!cardName || cardName.trim().length < 3)
      errors.cardName = "Please enter a valid name";
    if (!validateCardNumber(cardNumber))
      errors.cardNumber = "Card number must be 16 digits";
    if (!validateExpiry(expiry)) errors.expiry = "Invalid or expired date (MM/YY)";
    if (!validateCVC(cvc)) errors.cvc = "CVC must be 3 digits";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const result = await processPayment(packageId, userId);
      if (result.success) {
        setSuccess(true);
        setTransactionId(result.transactionId || null);
        setTimeout(() => router.push("/dashboard"), 3000);
      } else {
        setError(result.error || "Payment failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-300" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
          Payment Successful!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your package has been activated.
        </p>
        {transactionId && (
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
            <p className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-200">
              {transactionId}
            </p>
          </div>
        )}
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  const inputBaseClasses =
    "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.38 0-2.5 1.12-2.5 2.5S10.62 13 12 13s2.5-1.12 2.5-2.5S13.38 8 12 8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2v4m0 12v4m6-6h4M2 12h4m10.243 5.657l2.828 2.828M5.657 5.657l2.828 2.828"
          />
        </svg>
        Payment Details
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter your card details to process the payment.
      </p>

      <div className="space-y-2">
        <Label htmlFor="cardName" className="text-gray-700 dark:text-gray-300">
          Name on Card
        </Label>
        <Input
          id="cardName"
          name="cardName"
          placeholder="John Doe"
          required
          className={`${inputBaseClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${
            formErrors.cardName ? "border-red-500 dark:border-red-400" : ""
          }`}
        />
        {formErrors.cardName && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {formErrors.cardName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="cardNumber"
          className="text-gray-700 dark:text-gray-300"
        >
          Card Number
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            required
            className={`${inputBaseClasses} pl-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 font-mono text-gray-900 dark:text-gray-100 ${
              formErrors.cardNumber ? "border-red-500 dark:border-red-400" : ""
            }`}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              val = val.replace(/(\d{4})/g, "$1 ").trim();
              e.target.value = val;
            }}
          />
          <div className="absolute left-3 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-400 dark:text-gray-300"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
        </div>
        {formErrors.cardNumber && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {formErrors.cardNumber}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry" className="text-gray-700 dark:text-gray-300">
            Expiry Date
          </Label>
          <Input
            id="expiry"
            name="expiry"
            placeholder="MM/YY"
            maxLength={5}
            required
            className={`${inputBaseClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-center ${
              formErrors.expiry ? "border-red-500 dark:border-red-400" : ""
            }`}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
              e.target.value = val;
            }}
          />
          {formErrors.expiry && (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.expiry}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc" className="text-gray-700 dark:text-gray-300">
            CVC
          </Label>
          <Input
            id="cvc"
            name="cvc"
            placeholder="123"
            maxLength={3}
            required
            type="password"
            className={`${inputBaseClasses} bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-center ${
              formErrors.cvc ? "border-red-500 dark:border-red-400" : ""
            }`}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            }}
          />
          {formErrors.cvc && (
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.cvc}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 rounded-md border border-red-200 dark:border-red-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${price}`
        )}
      </Button>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
        This is a secure mock payment. No real money is charged.
      </p>
    </form>
  );
}
