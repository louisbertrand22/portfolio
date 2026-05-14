import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#6366f1] text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)] active:translate-y-0',
        secondary:
          'border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[#6366f1] hover:text-[#6366f1] hover:bg-[var(--primary-glow)] hover:-translate-y-0.5',
        outline:
          'border border-[var(--border)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[rgba(99,102,241,0.4)]',
        ghost:
          'bg-transparent text-[var(--text-muted)] hover:bg-[var(--primary-glow)] hover:text-[var(--text)]',
        filter:
          'border border-[var(--border)] bg-transparent text-[var(--text-muted)] font-semibold text-[0.8rem] hover:text-[var(--text)] hover:border-[rgba(99,102,241,0.4)]',
        'filter-active':
          'border border-[#6366f1] bg-[#6366f1] text-white font-semibold text-[0.8rem]',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'px-4 py-1.5 text-[0.8rem]',
        lg: 'px-8 py-4 text-base',
        icon: 'h-8 w-8',
        filter: 'px-[1.1rem] py-[0.4rem] rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
