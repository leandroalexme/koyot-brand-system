'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { useLimePortal } from '../lib/portal';
import { groupLabelClass, itemClass, popupClass, separatorClass } from '../lib/popup';
import { cn, mergeClass } from '../lib/utils';

function Menubar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="menubar"
      className={mergeClass(
        'flex h-(--control-sm) items-center gap-1 rounded-control border border-line bg-surface p-1 text-fg shadow-xs',
        className
      )}
      {...props}
    />
  );
}

function MenubarMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={mergeClass(
        'inline-flex h-(--control-xs,24px) items-center justify-center rounded-sm px-2 text-xs font-medium text-fg-2 select-none transition-colors hover:bg-surface-2 hover:text-fg data-popup-open:bg-surface-2 data-popup-open:text-fg focus-visible:outline-none',
        className
      )}
      {...props}
    />
  );
}

type MenubarContentProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset' | 'alignOffset'>;

function MenubarContent({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset = -2,
  ...props
}: MenubarContentProps) {
  const container = useLimePortal();
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={8}
        className="isolate z-(--z-popover) outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="menubar-content"
          className={mergeClass([popupClass, 'min-w-40'], className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

type MenubarItemProps = MenuPrimitive.Item.Props & {
  destructive?: boolean;
};

function MenubarItem({
  className,
  destructive,
  ...props
}: MenubarItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      className={mergeClass(
        [
          itemClass,
          'text-xs py-1.5',
          destructive && 'text-danger-text data-highlighted:bg-danger-tint',
        ],
        className
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      className={mergeClass(separatorClass, className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={mergeClass(
        'ms-auto text-[10px] tracking-widest text-fg-3 uppercase font-mono',
        className
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
};
