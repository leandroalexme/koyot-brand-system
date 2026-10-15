'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { ChevronDown, Icon } from '../icon';
import { useLimePortal } from '../lib/portal';
import { popupClass } from '../lib/popup';
import { cn, mergeClass } from '../lib/utils';

function NavigationMenu({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="navigation-menu"
      className={mergeClass(
        'relative z-10 flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={mergeClass(
        'group flex flex-1 list-none items-center justify-center gap-1 p-1 rounded-control bg-surface border border-line',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, children, ...props }: React.ComponentProps<'li'>) {
  return (
    <li data-slot="navigation-menu-item" className={cn('relative', className)} {...props}>
      <MenuPrimitive.Root>
        {children}
      </MenuPrimitive.Root>
    </li>
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={mergeClass(
        'group inline-flex h-8 w-max items-center justify-center gap-1 rounded-sm px-3 py-1.5 text-xs font-medium text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none data-popup-open:bg-surface-2 data-popup-open:text-fg',
        className
      )}
      {...props}
    >
      {children}
      <Icon
        icon={ChevronDown}
        size={12}
        className="relative top-[0.5px] text-fg-3 transition duration-200 group-data-popup-open:rotate-180"
      />
    </MenuPrimitive.Trigger>
  );
}

type NavigationMenuContentProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset'>;

function NavigationMenuContent({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  ...props
}: NavigationMenuContentProps) {
  const container = useLimePortal();
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={8}
        className="isolate z-(--z-popover) outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="navigation-menu-content"
          className={mergeClass([popupClass, 'w-64 p-3 shadow-overlay'], className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function NavigationMenuLink({
  className,
  active,
  children,
  ...props
}: React.ComponentProps<'a'> & { active?: boolean }) {
  return (
    <a
      data-slot="navigation-menu-link"
      data-active={active || undefined}
      className={mergeClass(
        'block select-none rounded-control p-2 text-xs leading-none no-underline outline-none transition-colors hover:bg-surface-2 hover:text-fg focus:bg-surface-2',
        active ? 'bg-surface-2 font-medium text-fg' : 'text-fg-2',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};
