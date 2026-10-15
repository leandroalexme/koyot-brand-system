'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, OverflowMenuHorizontal, Icon } from '../icon';
import { cn, mergeClass } from '../lib/utils';
import { Button } from './button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Pagination"
      data-slot="pagination"
      className={mergeClass('flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={mergeClass('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" className={cn(className)} {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'icon';
} & React.ComponentProps<'a'>;

function PaginationLink({
  className,
  isActive,
  disabled,
  size = 'icon',
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      className={mergeClass(
        cn(
          'inline-flex h-(--control-sm) min-w-(--control-sm) items-center justify-center rounded-control px-2.5 text-xs font-medium tabular-nums transition-colors duration-(--dur-instant) select-none',
          isActive
            ? 'bg-accent text-on-accent font-semibold shadow-xs'
            : 'text-fg-2 hover:bg-surface-2 hover:text-fg',
          disabled && 'pointer-events-none opacity-40',
          size === 'icon' && 'px-0 w-8'
        ),
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="md"
      className={mergeClass('gap-1 px-2.5', className)}
      {...props}
    >
      <Icon icon={ChevronLeft} size={16} />
      <span className="hidden sm:inline text-xs">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="md"
      className={mergeClass('gap-1 px-2.5', className)}
      {...props}
    >
      <span className="hidden sm:inline text-xs">{text}</span>
      <Icon icon={ChevronRight} size={16} />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={mergeClass(
        'flex h-(--control-sm) w-8 items-center justify-center text-fg-3',
        className
      )}
      {...props}
    >
      <Icon icon={OverflowMenuHorizontal} size={16} />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
