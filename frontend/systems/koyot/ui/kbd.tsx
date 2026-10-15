'use client';

import * as React from 'react';
import { cn, mergeClass } from '../lib/utils';

export interface KbdProps extends React.ComponentProps<'kbd'> {
  keys?: string;
}

function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={mergeClass(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-control border border-line-strong bg-surface-2 px-1 text-[10px] font-mono font-medium text-fg-2 shadow-2xs select-none',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export { Kbd };
