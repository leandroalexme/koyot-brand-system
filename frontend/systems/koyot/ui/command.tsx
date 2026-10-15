'use client';

import * as React from 'react';
import { Search, Icon } from '../icon';
import { cn, mergeClass } from '../lib/utils';
import { Kbd } from './kbd';
import { Dialog, DialogContent } from './dialog';

interface CommandContextType {
  search: string;
  setSearch: (value: string) => void;
}

const CommandContext = React.createContext<CommandContextType>({
  search: '',
  setSearch: () => {},
});

function Command({ className, ...props }: React.ComponentProps<'div'>) {
  const [search, setSearch] = React.useState('');
  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div
        data-slot="command"
        className={mergeClass(
          'flex h-full w-full flex-col overflow-hidden rounded-panel bg-surface border border-line text-fg shadow-card',
          className
        )}
        {...props}
      />
    </CommandContext.Provider>
  );
}

function CommandDialog({
  open,
  onOpenChange,
  children,
  className,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={mergeClass('p-0 overflow-hidden max-w-lg', className)}>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  placeholder = 'Type a command or search...',
  ...props
}: React.ComponentProps<'input'>) {
  const { search, setSearch } = React.useContext(CommandContext);
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center border-b border-line px-3 gap-2"
    >
      <Icon icon={Search} size={16} className="shrink-0 text-fg-3" />
      <input
        data-slot="command-input"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={mergeClass(
          'flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-fg outline-none placeholder:text-fg-3 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-list"
      className={mergeClass(
        'max-h-[300px] overflow-y-auto overflow-x-hidden p-1.5 scrollbar-thin',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  children = 'No results found.',
  ...props
}: React.ComponentProps<'div'>) {
  const { search } = React.useContext(CommandContext);
  if (!search) return null;
  return (
    <div
      data-slot="command-empty"
      className={mergeClass('py-6 text-center text-xs text-fg-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<'div'> & { heading?: React.ReactNode }) {
  return (
    <div
      data-slot="command-group"
      className={mergeClass('overflow-hidden p-1 text-fg', className)}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-[11px] font-semibold text-fg-3 uppercase tracking-wider">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

function CommandItem({
  className,
  onSelect,
  children,
  ...props
}: React.ComponentProps<'div'> & { onSelect?: () => void }) {
  return (
    <div
      data-slot="command-item"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      className={mergeClass(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-control px-2 py-1.5 text-xs text-fg outline-none transition-colors hover:bg-surface-2 focus:bg-surface-2 data-selected:bg-surface-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={mergeClass(
        'ms-auto text-[10px] tracking-widest text-fg-3 uppercase font-mono flex items-center gap-1',
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-separator"
      className={mergeClass('-mx-1 my-1 h-px bg-line', className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
