'use client';

import * as React from 'react';
import { OTPField as OTPFieldPrimitive } from '@base-ui/react/otp-field';
import { cn, mergeClass } from '../lib/utils';

export interface InputOTPProps extends Omit<OTPFieldPrimitive.Root.Props, 'render'> {
  className?: string;
  length?: number;
}

function InputOTP({
  className,
  length = 6,
  validationType = 'numeric',
  ...props
}: InputOTPProps) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="input-otp"
      length={length}
      validationType={validationType}
      className={mergeClass('flex items-center gap-2 select-none', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={mergeClass('flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

export interface InputOTPSlotProps extends React.ComponentProps<'div'> {
  index: number;
}

function InputOTPSlot({
  index,
  className,
  ...props
}: OTPFieldPrimitive.Input.Props & { index?: number }) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-slot"
      className={mergeClass(
        'size-10 rounded-control border border-line-strong bg-field text-center text-base font-semibold text-fg tabular-nums outline-none transition-[border-color,box-shadow]',
        'hover:not-disabled:border-control focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent',
        'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-fg-disabled',
        className
      )}
      {...props}
    />
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={mergeClass('text-fg-3 font-bold px-1 select-none', className)}
      {...props}
    >
      –
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
};
