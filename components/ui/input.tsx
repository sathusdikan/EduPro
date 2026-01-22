"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Search, CheckCircle, XCircle, Loader2 } from "lucide-react"

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    label?: string
    error?: string
    success?: boolean
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: "left" | "right"
    showPasswordToggle?: boolean
    hint?: string
    variant?: "default" | "ghost" | "glass" | "gradient"
    size?: "sm" | "default" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ 
        className, 
        type, 
        label,
        error,
        success,
        loading,
        icon,
        iconPosition = "left",
        showPasswordToggle = false,
        hint,
        variant = "default",
        size = "default",
        ...props 
    }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const [isFocused, setIsFocused] = React.useState(false)
        
        const inputType = type === "password" && showPassword ? "text" : type
        
        const variantClasses = {
            default: "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500",
            ghost: "bg-transparent border-transparent focus:border-blue-500 dark:focus:border-blue-500",
            glass: "bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-gray-700/50 focus:border-blue-400 dark:focus:border-blue-500",
            gradient: "bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
        }
        
        const sizeClasses = {
            sm: "h-8 px-3 text-xs rounded-md",
            default: "h-11 px-4 text-sm rounded-lg",
            lg: "h-14 px-5 text-base rounded-xl"
        }

        return (
            <div className="space-y-2 w-full group">
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                
                <div className="relative">
                    {/* Left Icon */}
                    {icon && iconPosition === "left" && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                            {icon}
                        </div>
                    )}
                    
                    {/* Input */}
                    <input
                        type={inputType}
                        className={cn(
                            "w-full border-2 transition-all duration-300 ease-out",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800",
                            variantClasses[variant],
                            sizeClasses[size],
                            icon && iconPosition === "left" && "pl-10",
                            (icon && iconPosition === "right" || showPasswordToggle || loading) && "pr-10",
                            error && "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20",
                            success && "border-emerald-500 dark:border-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20",
                            isFocused && "ring-2 ring-blue-500/20 dark:ring-blue-500/30",
                            className
                        )}
                        ref={ref}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                    
                    {/* Right side icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {/* Loading */}
                        {loading && (
                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        )}
                        
                        {/* Success/Error */}
                        {error && !loading && (
                            <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {success && !loading && !error && (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                        
                        {/* Password Toggle */}
                        {type === "password" && showPasswordToggle && !loading && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        )}
                        
                        {/* Right Icon */}
                        {icon && iconPosition === "right" && !loading && (
                            <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                {icon}
                            </div>
                        )}
                    </div>
                    
                    {/* Focus border animation */}
                    <div className={cn(
                        "absolute inset-0 rounded-[inherit] border-2 border-transparent pointer-events-none transition-all duration-300",
                        isFocused && "border-blue-500/30 dark:border-blue-500/50"
                    )} />
                </div>
                
                {/* Hint/Error message */}
                {(hint || error) && (
                    <p className={cn(
                        "text-xs transition-all duration-200",
                        error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                    )}>
                        {error || hint}
                    </p>
                )}
                
                {/* Password strength indicator (for password inputs) */}
                {type === "password" && props.value && !error && (
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-500",
                                props.value.toString().length < 6 ? "w-1/3 bg-red-500" :
                                props.value.toString().length < 8 ? "w-2/3 bg-yellow-500" :
                                "w-full bg-emerald-500"
                            )}
                        />
                    </div>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

// Search Input variant
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'icon'>>(
    (props, ref) => {
        return (
            <Input
                ref={ref}
                type="search"
                icon={<Search className="h-4 w-4" />}
                placeholder="Search..."
                {...props}
            />
        )
    }
)
SearchInput.displayName = "SearchInput"

export { Input, SearchInput }