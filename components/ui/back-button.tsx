"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function BackButton({
  href,
  label = "Back",
  className,
  size = "lg",
}: BackButtonProps) {
  const router = useRouter();

  const buttonClasses = cn(
    "flex items-center gap-2 rounded-lg",
    "bg-blue-600 hover:bg-blue-700",
    "text-white",
    "transition-all duration-200",
    "hover:scale-105 hover:-translate-x-1",
    "dark:bg-blue-600 dark:hover:bg-blue-700",
    className
  );

  const content = (
    <Button size={size} className={buttonClasses}>
     
      {label}
    </Button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <Button
      size={size}
      className={buttonClasses}
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
