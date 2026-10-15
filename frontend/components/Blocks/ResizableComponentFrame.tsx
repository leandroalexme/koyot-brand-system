import React, { useRef, useState, useEffect } from 'react';
import { Smartphone, Tablet, Maximize2 } from 'lucide-react';

interface ResizableComponentFrameProps {
  children: (containerWidth: number) => React.ReactNode;
}

export const ResizableComponentFrame: React.FC<ResizableComponentFrameProps> = ({
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const [maxAvailableWidth, setMaxAvailableWidth] = useState<number>(900);
  const [customWidthPx, setCustomWidthPx] = useState<number | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(600);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const frameEl = frameRef.current;
    if (!wrapperEl || !frameEl) return;

    let rafId: number | null = null;

    const measure = () => {
      const avail = wrapperEl.clientWidth;
      if (avail > 0) {
        setMaxAvailableWidth((prev) => (Math.abs(prev - avail) > 2 ? avail : prev));
      }
      const fw = frameEl.clientWidth;
      if (fw > 0) {
        setMeasuredWidth((prev) => (Math.abs(prev - fw) > 2 ? fw : prev));
      }
    };

    measure();

    const ro = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    });

    ro.observe(wrapperEl);
    ro.observe(frameEl);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const rawW = e.clientX - rect.left;
    const minW = Math.min(280, maxAvailableWidth);
    const clamped = Math.max(minW, Math.min(maxAvailableWidth, rawW));

    if (maxAvailableWidth - clamped < 16) {
      setCustomWidthPx(null);
    } else {
      setCustomWidthPx(Math.round(clamped));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const effectiveCustomWidth =
    customWidthPx !== null ? Math.min(customWidthPx, maxAvailableWidth) : null;

  const activeWidthStyle =
    effectiveCustomWidth !== null
      ? { width: `${effectiveCustomWidth}px` }
      : { width: '100%' };

  return (
    <div ref={wrapperRef} className="w-full h-full relative group/frame">
      {/* Subtle Viewport Width Bar on Hover */}
      {maxAvailableWidth > 380 && (
        <div
          className={`absolute -top-3 right-4 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900/90 text-white text-[10px] font-mono shadow-sm transition-opacity duration-150 ${
            isDragging || effectiveCustomWidth !== null
              ? 'opacity-100'
              : 'opacity-0 group-hover/frame:opacity-100'
          }`}
        >
          <span>{measuredWidth}px</span>
          <span className="text-zinc-600 mx-0.5">·</span>
          <button
            type="button"
            onClick={() => setCustomWidthPx(Math.min(340, maxAvailableWidth))}
            className={`p-0.5 rounded hover:text-white transition ${
              effectiveCustomWidth !== null && effectiveCustomWidth <= 360
                ? 'text-white'
                : 'text-zinc-400'
            }`}
            title="Mobile width (340px)"
          >
            <Smartphone className="w-3 h-3" />
          </button>
          {maxAvailableWidth >= 540 && (
            <button
              type="button"
              onClick={() => setCustomWidthPx(Math.min(500, maxAvailableWidth))}
              className={`p-0.5 rounded hover:text-white transition ${
                effectiveCustomWidth !== null &&
                effectiveCustomWidth > 360 &&
                effectiveCustomWidth <= 540
                  ? 'text-white'
                  : 'text-zinc-400'
              }`}
              title="Tablet width (500px)"
            >
              <Tablet className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setCustomWidthPx(null)}
            className={`p-0.5 rounded hover:text-white transition ${
              effectiveCustomWidth === null ? 'text-white' : 'text-zinc-400'
            }`}
            title="Full container width (100%)"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Resizable Component Stage */}
      <div
        ref={frameRef}
        style={activeWidthStyle}
        className={`h-full relative ${
          isDragging ? '' : 'transition-[width] duration-200 ease-out'
        }`}
      >
        {children(measuredWidth)}

        {/* Right-edge interactive resize handle */}
        {maxAvailableWidth > 360 && (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={() => setCustomWidthPx(null)}
            title="Arraste para redimensionar o componente (duplo clique para 100%)"
            className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-4 h-16 flex items-center justify-center cursor-ew-resize z-20 touch-none select-none opacity-0 group-hover/frame:opacity-100 transition-opacity"
          >
            <div
              className={`w-1.5 h-10 rounded-full transition-all ${
                isDragging
                  ? 'bg-zinc-900 scale-y-125 shadow'
                  : 'bg-zinc-400/70 hover:bg-zinc-800'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
