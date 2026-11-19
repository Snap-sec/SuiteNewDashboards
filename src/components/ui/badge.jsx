/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center \ font-medium focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        dangerSoft: 'bg-red-400 text-white',
        info: 'bg-violet-500 text-white',
        mono: 'bg-mono text-mono-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        high: 'bg-high text-high-foreground',
      },
      appearance: {
        solid: 'border-transparent',
        outline: '',
        light: '',
        stroke: 'bg-transparent text-secondary-foreground',
        ghost: 'border-transparent bg-transparent',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
      },
      size: {
        lg: 'rounded-md px-[0.5rem] h-7 min-w-7 gap-1.5 text-xs [&_svg]:size-3.5',
        md: 'rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5 ',
        sm: 'rounded-sm px-[0.325rem] h-5 min-w-5 gap-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3',
        xs: 'rounded-sm px-[0.25rem] h-4 min-w-4 gap-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3',
      },
      shape: {
        default: '',
        circle: 'rounded-full',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        appearance: 'outline',
        className: 'bg-primary/10 border-primary/10 text-primary',
      },
      {
        variant: 'secondary',
        appearance: 'outline',
        className:
          'bg-secondary dark:bg-secondary/50 border-border text-secondary-foreground',
      },
      {
        variant: 'success',
        appearance: 'outline',
        className:
          ' bg-green-100 text-green-700 border-green-200 dark:text-green-600 dark:bg-green-950/50 dark:border-green-950',
      },
      {
        variant: 'warning',
        appearance: 'outline',
        className: 'bg-warning/10 border-warning/10 text-warning',
      },
      {
        variant: 'dangerSoft',
        appearance: 'outline',
        className:
          ' bg-red-100 text-red-700 border-red-200 dark:text-red-400 dark:bg-red-950/50 dark:border-red-950',
      },
      {
        variant: 'info',
        appearance: 'outline',
        className:
          ' bg-violet-100 text-violet-700 border-violet-200 dark:text-violet-600 dark:bg-violet-950/50 dark:border-violet-950',
      },
      {
        variant: 'mono',
        appearance: 'outline',
        className: 'bg-mono/10 border-mono/10 text-mono',
      },
      {
        variant: 'destructive',
        appearance: 'outline',
        className: 'bg-destructive/10 border-destructive/10 text-destructive',
      },
      {
        variant: 'high',
        appearance: 'outline',
        className: 'bg-high/10 border-high/10 text-high',
      },

      {
        variant: 'primary',
        appearance: 'light',
        className: 'bg-primary/10 text-primary',
      },
      {
        variant: 'secondary',
        appearance: 'light',
        className:
          'bg-secondary dark:bg-secondary/50 text-secondary-foreground',
      },
      {
        variant: 'success',
        appearance: 'light',
        className:
          ' bg-green-100 text-green-700 dark:text-green-600 dark:bg-green-950/50',
      },
      {
        variant: 'warning',
        appearance: 'light',
        className: 'bg-warning/10 text-warning',
      },
      {
        variant: 'dangerSoft',
        appearance: 'light',
        className:
          ' bg-red-100 text-red-700 dark:text-red-400 dark:bg-red-950/50',
      },
      {
        variant: 'info',
        appearance: 'light',
        className:
          ' bg-violet-100 text-violet-700 dark:text-violet-600 dark:bg-violet-950/50',
      },
      {
        variant: 'mono',
        appearance: 'light',
        className: 'bg-mono/10 text-mono',
      },
      {
        variant: 'destructive',
        appearance: 'light',
        className: 'bg-destructive/10 text-destructive',
      },
      {
        variant: 'high',
        appearance: 'light',
        className: 'bg-high/10 text-high',
      },

      {
        variant: 'primary',
        appearance: 'ghost',
        className: 'text-primary',
      },
      {
        variant: 'secondary',
        appearance: 'ghost',
        className: 'text-secondary-foreground',
      },
      {
        variant: 'success',
        appearance: 'ghost',
        className: 'text-green-500',
      },
      {
        variant: 'warning',
        appearance: 'ghost',
        className: 'text-yellow-500',
      },
      {
        variant: 'dangerSoft',
        appearance: 'ghost',
        className: 'text-red-600',
      },
      { variant: 'info', appearance: 'ghost', className: 'text-violet-500' },
      { variant: 'mono', appearance: 'ghost', className: 'text-mono' },
      {
        variant: 'destructive',
        appearance: 'ghost',
        className: 'text-destructive',
      },
      {
        variant: 'high',
        appearance: 'ghost',
        className: 'text-high',
      },

      { size: 'lg', appearance: 'ghost', className: 'px-0' },
      { size: 'md', appearance: 'ghost', className: 'px-0' },
      { size: 'sm', appearance: 'ghost', className: 'px-0' },
      { size: 'xs', appearance: 'ghost', className: 'px-0' },
    ],

    defaultVariants: {
      variant: 'secondary',
      appearance: 'solid',
      size: 'md',
    },
  },
);

const badgeButtonVariants = cva(
  'cursor-pointer transition-all inline-flex items-center justify-center leading-none size-3.5 [&>svg]:opacity-100! [&>svg]:size-3.5 p-0 rounded-md -me-0.5 opacity-60 hover:opacity-100',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  size,
  appearance,
  shape,
  asChild = false,
  disabled,
  ...props
}) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, size, appearance, shape, disabled }),
        className,
      )}
      {...props}
    />
  );
}

function BadgeButton({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'span';
  return (
    <Comp
      data-slot="badge-button"
      className={cn(badgeButtonVariants({ variant, className }))}
      role="button"
      {...props}
    />
  );
}

function BadgeDot({ className, ...props }) {
  return (
    <span
      data-slot="badge-dot"
      className={cn(
        'size-1.5 rounded-full bg-[currentColor] opacity-75',
        className,
      )}
      {...props}
    />
  );
}

export { Badge, BadgeButton, BadgeDot, badgeVariants };
