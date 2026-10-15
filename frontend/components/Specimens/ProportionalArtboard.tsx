import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ProportionalArtboardProps {
  /** Canonical design width of the artboard (e.g. 520 for 2-col cards, 920 for 1-col wide cards) */
  baseWidth?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * ProportionalArtboard locks the internal design to a fixed `baseWidth` coordinate system
 * and scales it smoothly (`scale = containerWidth / baseWidth`) to fit any column or screen size.
 * This guarantees zero text truncation, zero responsive reflow glitches, and 100% preserved art direction.
 */
export const ProportionalArtboard: React.FC<ProportionalArtboardProps> = ({
  baseWidth = 520,
  children,
  className = '',
}) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  const updateMetrics = useCallback(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    if (!outerEl || !innerEl) return;

    const availableW = outerEl.clientWidth;
    if (availableW <= 0) return;

    const nextScale = Number((availableW / baseWidth).toFixed(4));
    const naturalH = innerEl.offsetHeight || innerEl.scrollHeight;
    const nextHeight = Math.ceil(naturalH * nextScale);

    setScale((prev) => (Math.abs(prev - nextScale) > 0.002 ? nextScale : prev));
    setScaledHeight((prev) =>
      prev === null || Math.abs(prev - nextHeight) > 1 ? nextHeight : prev
    );
  }, [baseWidth]);

  useEffect(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    if (!outerEl || !innerEl) return;

    updateMetrics();

    let rafId: number | null = null;
    const ro = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateMetrics);
    });

    ro.observe(outerEl);
    ro.observe(innerEl);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [updateMetrics]);

  return (
    <div
      ref={outerRef}
      className={`w-full relative overflow-hidden rounded-[24px] ${className}`}
      style={scaledHeight !== null ? { height: `${scaledHeight}px` } : undefined}
    >
      <div
        ref={innerRef}
        style={{
          width: `${baseWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
};
