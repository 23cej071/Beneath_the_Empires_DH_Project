import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * CompareSlider - Interactive zero-dependency before/after split image comparison slider.
 *
 * Props:
 * @param {string} beforeSrc - URL of the ground-truth archival image
 * @param {string} afterSrc - URL of the AI-generated comparison image
 * @param {string} [beforeAlt="Archival original scan"] - Alt text for the archival image
 * @param {string} [afterAlt="AI generated representation"] - Alt text for the AI image
 * @param {string} [beforeLabel="Archival scan"] - Chip label for the archival image
 * @param {string} [afterLabel="AI generation"] - Chip label for the AI image
 * @param {number} [initial=50] - Initial split position in percentage (0-100)
 */
export default function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Archival scan',
  afterAlt = 'AI generation',
  beforeLabel = 'Archival scan',
  afterLabel = 'AI generation',
  initial = 50,
}) {
  const [position, setPosition] = useState(() => Math.max(0, Math.min(100, initial)));
  const [isDragging, setIsDragging] = useState(false);

  // State adjustments during render (React best practice, avoiding effect setState)
  const [prevBeforeSrc, setPrevBeforeSrc] = useState(beforeSrc);
  const [beforeError, setBeforeError] = useState(false);
  if (prevBeforeSrc !== beforeSrc) {
    setPrevBeforeSrc(beforeSrc);
    setBeforeError(false);
  }

  const [prevAfterSrc, setPrevAfterSrc] = useState(afterSrc);
  const [afterError, setAfterError] = useState(false);
  if (prevAfterSrc !== afterSrc) {
    setPrevAfterSrc(afterSrc);
    setAfterError(false);
  }

  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const rafIdRef = useRef(null);
  const isPointerDownRef = useRef(false);

  // Cleanup requestAnimationFrame on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const offsetX = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setPosition(percent);
  }, []);

  // Pointer Events handling (supports mouse, touch, and pen in one unified path)
  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    const clientX = e.clientX;
    rafIdRef.current = requestAnimationFrame(() => {
      updatePosition(clientX);
    });
  };

  const handlePointerUp = (e) => {
    if (isPointerDownRef.current) {
      isPointerDownRef.current = false;
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer release fails
      }
    }
  };

  // Keyboard navigation on the slider handle (ArrowLeft/Right: 2%, Shift+Arrows: 10%, Home/End: 0/100%)
  const handleKeyDown = (e) => {
    let delta = 0;
    if (e.key === 'ArrowLeft') {
      delta = e.shiftKey ? -10 : -2;
    } else if (e.key === 'ArrowRight') {
      delta = e.shiftKey ? 10 : 2;
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPosition(0);
      return;
    } else if (e.key === 'End') {
      e.preventDefault();
      setPosition(100);
      return;
    }

    if (delta !== 0) {
      e.preventDefault();
      setPosition((prev) => Math.max(0, Math.min(100, prev + delta)));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      {/* Viewport Container with pan-y to allow vertical page scrolling */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
        className="relative w-full aspect-[4/3] bg-[#ECE5D8] rounded-lg overflow-hidden select-none border border-ash/40 shadow-inner cursor-ew-resize"
      >
        {/* Layer 1 (Left / Base): Archival Scan ("before" image) */}
        <div className="absolute inset-0 w-full h-full">
          {beforeError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#ECE5D8] text-ink">
              <svg className="w-10 h-10 text-ash mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-serif font-bold text-sm text-ink">{beforeLabel}</span>
              <p className="text-xs text-ash mt-1 max-w-xs">{beforeAlt || 'Archival image unavailable'}</p>
            </div>
          ) : (
            <img
              src={beforeSrc}
              alt={beforeAlt}
              onError={() => setBeforeError(true)}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          )}

          {/* Top-Left Corner Chip: beforeLabel */}
          <div className="absolute top-3 left-3 bg-ink/80 text-parchment text-xs font-medium px-2.5 py-1 rounded backdrop-blur-sm pointer-events-none border border-ash/30 shadow">
            {beforeLabel}
          </div>
        </div>

        {/* Layer 2 (Right / Clipped Overlay): AI Generated ("after" image) */}
        <div
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {afterError ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#1F1A17] text-parchment">
              <span className="px-2.5 py-0.5 rounded bg-madder/40 text-parchment font-mono text-xs uppercase tracking-wider mb-2 border border-madder/60">
                Audited Specimen
              </span>
              <span className="font-serif font-bold text-sm text-parchment">{afterLabel}</span>
              <p className="text-xs text-parchment/70 mt-1 max-w-xs">{afterAlt || 'AI generation specimen'}</p>
              <span className="text-[10px] text-turmeric mt-2 font-mono uppercase tracking-wider">
                Specimen placeholder active
              </span>
            </div>
          ) : (
            <img
              src={afterSrc}
              alt={afterAlt}
              onError={() => setAfterError(true)}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          )}

          {/* Top-Right Corner Chip: afterLabel */}
          <div className="absolute top-3 right-3 bg-ink/80 text-parchment text-xs font-medium px-2.5 py-1 rounded backdrop-blur-sm pointer-events-none border border-ash/30 shadow">
            {afterLabel}
          </div>
        </div>

        {/* Persistent Chip on AI Side: ALWAYS shown on bottom-right */}
        <div className="absolute bottom-3 right-3 bg-madder/90 text-parchment text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded backdrop-blur-sm shadow border border-parchment/20 pointer-events-none z-20">
          AI-generated, not historical evidence
        </div>

        {/* Vertical Divider Line and Circular Handle (min 44x44px target) */}
        <div
          style={{ left: `${position}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-parchment shadow-[0_0_10px_rgba(0,0,0,0.6)] pointer-events-none z-30"
        >
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-label="Comparison position"
            onKeyDown={handleKeyDown}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-parchment border-2 border-ink shadow-2xl cursor-ew-resize pointer-events-auto focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 focus:ring-offset-parchment transition-transform ${
              isDragging ? 'scale-110' : 'hover:scale-105'
            }`}
          >
            {/* Split arrow icon */}
            <svg
              className="w-5 h-5 text-ink"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Auxiliary keyboard & position helper note */}
      <div className="flex items-center justify-between text-[11px] text-ash px-1 font-mono">
        <span>Use Left/Right keys or drag split handle</span>
        <span>Split: {Math.round(position)}%</span>
      </div>
    </div>
  );
}
