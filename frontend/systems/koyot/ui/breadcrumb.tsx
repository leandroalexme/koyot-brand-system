'use client';

import * as React from 'react';
import { ChevronRight, OverflowMenuHorizontal, Icon } from '../icon';
import { cn, mergeClass } from '../lib/utils';

function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      className={mergeClass('min-w-0', className)}
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={mergeClass(
        'flex flex-wrap items-center gap-1.5 text-sm text-fg-2 break-words',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={mergeClass('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  className,
  asChild,
  children,
  ...props
}: React.ComponentProps<'a'> & { asChild?: boolean }) {
  return (
    <a
      data-slot="breadcrumb-link"
      className={mergeClass(
        'inline-flex items-center gap-1.5 text-fg-2 transition-colors duration-(--dur-instant) hover:text-fg underline-offset-4 hover:underline',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={mergeClass('font-medium text-fg', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={mergeClass('text-fg-3 select-none [&_svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <Icon icon={ChevronRight} size={14} />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={mergeClass(
        'flex size-6 items-center justify-center rounded-control text-fg-3 hover:text-fg',
        className
      )}
      {...props}
    >
      <Icon icon={OverflowMenuHorizontal} size={16} />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
