'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, mergeClass } from '../lib/utils';

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5 rounded-control text-xs font-medium text-fg-2 select-none transition-colors duration-(--dur-instant) outline-none',
    'hover:bg-surface-2 hover:text-fg focus-visible:ring-1 focus-visible:ring-accent',
    'data-pressed:bg-accent data-pressed:text-on-accent data-pressed:font-semibold data-pressed:shadow-xs',
    'disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-line bg-surface hover:bg-surface-2 data-pressed:border-accent',
        raised: 'bg-surface shadow-xs hover:bg-surface-2',
      },
      size: {
        sm: 'h-(--control-sm) px-2 min-w-(--control-sm)',
        md: 'h-(--control-md) px-3 min-w-(--control-md)',
        lg: 'h-(--control-lg) px-4 min-w-(--control-lg) text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export type ToggleProps<Value extends string = string> = Omit<
  TogglePrimitive.Props<Value>,
  'className'
> &
  VariantProps<typeof toggleVariants> & {
    className?: string;
  };

function Toggle<Value extends string = string>({
  className,
  variant,
  size,
  ...props
}: ToggleProps<Value>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={mergeClass(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export type ToggleGroupProps<Value extends string = string> = Omit<
  ToggleGroupPrimitive.Props<Value>,
  'className'
> & {
  className?: string;
};

function ToggleGroup<Value extends string = string>({
  className,
  ...props
}: ToggleGroupProps<Value>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={mergeClass(
        'inline-flex items-center gap-1 rounded-control bg-surface border border-line p-1 shadow-xs',
        className
      )}
      {...props}
    />
  );
}

const ToggleGroupItem = Toggle;

export { Toggle, ToggleGroup, ToggleGroupItem, toggleVariants };
