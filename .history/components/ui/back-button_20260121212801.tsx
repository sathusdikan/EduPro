"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function BackButton({ href, label = "Back", className, variant = "ghost", size = "sm" }: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link href={href}>
        <Button variant={variant} className={className} size={size}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </Link>
    );
  }

  return (
    <Button 
      variant={variant} 
      className={className} 
      size={size}
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
