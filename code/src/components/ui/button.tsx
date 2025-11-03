import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary (Black - The Different One) - ONLY for main actions
        default:
          "bg-neutral-800 text-white hover:bg-neutral-700 font-medium",
        // Secondary - White with border for important actions
        secondary:
          "bg-white text-neutral-600 border border-neutral-200 font-normal hover:bg-neutral-50",
        // Ghost - Transparent, most common button style
        ghost: "bg-transparent text-neutral-500 font-normal hover:bg-neutral-100",
        // Destructive - Grey text with subtle red tint on hover
        destructive:
          "bg-transparent text-neutral-500 font-normal hover:bg-red-50 hover:text-neutral-600",
        // Link style
        link: "text-neutral-500 underline-offset-4 hover:underline font-normal",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-9 px-3 py-2 text-xs",
        lg: "h-11 px-6 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
