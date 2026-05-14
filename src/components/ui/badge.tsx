import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(99,102,241,0.18)] bg-[var(--primary-glow)] text-[var(--primary)] tracking-[0.01em]',
        secondary:
          'border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-muted)]',
        outline:
          'border-[var(--border)] text-[var(--text-muted)] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
