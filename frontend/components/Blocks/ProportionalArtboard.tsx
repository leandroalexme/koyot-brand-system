import React from 'react';

interface ProportionalArtboardProps {
  /** Canonical design width (kept for interface compatibility) */
  baseWidth?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * ProportionalArtboard renders specimen blocks seamlessly within the Bento grid,
 * forwarding full height (h-full) and flexible auto-layout so that all blocks in a row
 * align uniformly to the row height without rigid JavaScript inline height overrides.
 */
export const ProportionalArtboard: React.FC<ProportionalArtboardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full h-full flex flex-col flex-1 ${className}`}>
      {children}
    </div>
  );
};
