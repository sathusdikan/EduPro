"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles, AlertCircle, CheckCircle, Info, Star } from "lucide-react"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-gray-300",
        primary: "text-blue-600 dark:text-blue-400",
        destructive: "text-red-600 dark:text-red-400",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        ghost: "text-gray-500 dark:text-gray-400",
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg font-semibold",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce-subtle",
        float: "animate-float-subtle",
      },
      icon: {
        none: "",
        star: "",
        check: "",
        info: "",
        alert: "",
        sparkle: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "medium",
      animation: "none",
      icon: "none",
    },
  }
)

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  iconPosition?: "left" | "right"
  tooltip?: string
  showIndicator?: boolean
  indicatorType?: "success" | "error" | "warning" | "info"
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size, 
  weight,
  animation,
  icon,
  required = false,
  iconPosition = "left",
  tooltip,
  showIndicator = false,
  indicatorType = "info",
  children,
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  
  const getIcon = () => {
    switch (icon) {
      case "star": return <Star className="h-3.5 w-3.5 text-yellow-500" />
      case "check": return <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      case "info": return <Info className="h-3.5 w-3.5 text-blue-500" />
      case "alert": return <AlertCircle className="h-3.5 w-3.5 text-red-500" />
      case "sparkle": return <Sparkles className="h-3.5 w-3.5 text-purple-500" />
      default: return null
    }
  }
  
  const getIndicator = () => {
    switch (indicatorType) {
      case "success": return <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      case "error": return <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      case "warning": return <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
      case "info": return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      default: return null
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {icon && iconPosition === "left" && (
            <motion.span
              animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 0.3 }}
            >
              {getIcon()}
            </motion.span>
          )}
          
          <LabelPrimitive.Root
            ref={ref}
            className={cn(
              labelVariants({ variant, size, weight, animation, icon: "none" }),
              "flex items-center gap-2 group cursor-pointer",
              className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
          >
            {children}
            
            {required && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500 font-bold"
              >
                *
              </motion.span>
            )}
          </LabelPrimitive.Root>
          
          {icon && iconPosition === "right" && (
            <motion.span
              animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.3 }}
            >
              {getIcon()}
            </motion.span>
          )}
          
          {showIndicator && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-1"
            >
              {getIndicator()}
            </motion.span>
          )}
        </motion.div>
      </div>
      
      {/* Animated underline on hover */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isHovered ? "100%" : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className={`h-0.5 ${
          variant === "primary" ? "bg-blue-500" :
          variant === "destructive" ? "bg-red-500" :
          variant === "success" ? "bg-green-500" :
          variant === "warning" ? "bg-yellow-500" :
          variant === "gradient" ? "bg-gradient-to-r from-blue-600 to-purple-600" :
          "bg-gray-300 dark:bg-gray-700"
        } rounded-full`}
      />
      
      {/* Tooltip */}
      {tooltip && isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 mt-8 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg"
        >
          {tooltip}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45" />
        </motion.div>
      )}
    </div>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

// Enhanced LabelGroup component
interface LabelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal"
  gap?: "sm" | "default" | "lg"
}

const LabelGroup = React.forwardRef<HTMLDivElement, LabelGroupProps>(
  ({ className, orientation = "vertical", gap = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          gap === "sm" ? "gap-1" : gap === "lg" ? "gap-3" : "gap-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
LabelGroup.displayName = "LabelGroup"

// Enhanced RequiredIndicator component
const RequiredIndicator = () => {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center ml-1"
    >
      <span className="text-red-500 font-bold">*</span>
      <span className="text-xs text-gray-500 ml-1">(required)</span>
    </motion.span>
  )
}

// Enhanced OptionalIndicator component
const OptionalIndicator = () => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex items-center ml-1"
    >
      <span className="text-xs text-gray-500">(optional)</span>
    </motion.span>
  )
}

export { 
  Label, 
  labelVariants, 
  LabelGroup, 
  RequiredIndicator, 
  OptionalIndicator 
}

// Global styles for animations
const globalStyles = `
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  
  @keyframes float-subtle {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-2px) rotate(1deg); }
    75% { transform: translateY(2px) rotate(-1deg); }
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }
  
  .animate-float-subtle {
    animation: float-subtle 3s ease-in-out infinite;
  }
`

// Inject global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = globalStyles
  document.head.appendChild(style)
}