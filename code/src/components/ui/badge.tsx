import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded px-2.5 py-1 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-200",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-600",
        secondary:
          "bg-neutral-50 text-neutral-500",
        destructive:
          "bg-neutral-100 text-neutral-500",
        outline: "text-neutral-500 bg-neutral-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
