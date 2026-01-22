"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2, ChevronRight, Sparkles, Check, X } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95",
                destructive:
                    "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95",
                outline:
                    "border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-105 active:scale-95",
                secondary:
                    "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:scale-105 active:scale-95",
                ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95",
                link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto",
                premium: "bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95",
                success: "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-8 px-4 text-xs rounded-md",
                lg: "h-12 px-8 py-3 text-base rounded-xl",
                icon: "h-10 w-10 rounded-lg",
            },
            animation: {
                none: "",
                pulse: "animate-pulse",
                bounce: "animate-bounce-subtle",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            animation: "none",
            fullWidth: false,
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    success?: boolean
    error?: boolean
    icon?: React.ReactNode
    iconPosition?: "left" | "right"
    showArrow?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ 
        className, 
        variant, 
        size, 
        animation,
        fullWidth,
        asChild = false, 
        loading = false,
        success = false,
        error = false,
        icon,
        iconPosition = "left",
        showArrow = false,
        children,
        disabled,
        ...props 
    }, ref) => {
        const Comp = asChild ? Slot : "button"
        
        // Determine button state
        const state = loading ? "loading" : success ? "success" : error ? "error" : "default"
        
        // State icons
        const stateIcons = {
            loading: <Loader2 className="h-4 w-4 animate-spin" />,
            success: <Check className="h-4 w-4" />,
            error: <X className="h-4 w-4" />,
        }

        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, animation, fullWidth, className }),
                    // State-based styling
                    success && "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700",
                    error && "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
                )}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {/* Shine effect on hover */}
                <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                </span>
                
                {/* Content wrapper */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {/* Left icon or state indicator */}
                    {icon && iconPosition === "left" && state === "default" && (
                        <span className="group-hover:scale-110 transition-transform">
                            {variant === "premium" ? <Sparkles className="h-4 w-4" /> : icon}
                        </span>
                    )}
                    
                    {/* State indicator (loading/success/error) */}
                    {state !== "default" && (
                        <span className="animate-in fade-in zoom-in duration-200">
                            {stateIcons[state]}
                        </span>
                    )}
                    
                    {/* Button text */}
                    {children && (
                        <span className="transition-all duration-200 group-hover:tracking-wide">
                            {children}
                        </span>
                    )}
                    
                    {/* Right icon or arrow */}
                    {icon && iconPosition === "right" && state === "default" && (
                        <span className="group-hover:scale-110 transition-transform">
                            {variant === "premium" ? <Sparkles className="h-4 w-4" /> : icon}
                        </span>
                    )}
                    
                    {/* Show arrow for certain variants */}
                    {showArrow && state === "default" && !icon && (
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    )}
                </span>
            </Comp>
        )
    }
)
Button.displayName = "Button"

// Add global styles for animations
const globalStyles = `
    @keyframes bounce-subtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    .animate-bounce-subtle {
        animation: bounce-subtle 2s ease-in-out infinite;
    }
    
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes zoom-in {
        from { transform: scale(0.5); }
        to { transform: scale(1); }
    }
    
    .animate-in {
        animation: fade-in 0.2s ease-out;
    }
    
    .zoom-in {
        animation: zoom-in 0.2s ease-out;
    }
`

// Inject styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.innerHTML = globalStyles
    document.head.appendChild(style)
}

export { Button, buttonVariants }