import React, { useState, useRef, useEffect, useCallback } from 'react';

// Color and styling map for each critique category
const categoryConfig = {
  Fabric: {
    bg: 'bg-indigo-dye',
    text: 'text-parchment',
    border: 'border-indigo-dye',
    ring: 'focus:ring-indigo-dye',
    icon: (
      // Loom / woven fabric icon glyph
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M7 3v18M12 3v18M17 3v18" />
      </svg>
    ),
  },
  Jewelry: {
    bg: 'bg-turmeric',
    text: 'text-ink',
    border: 'border-turmeric',
    ring: 'focus:ring-turmeric',
    icon: (
      // Ornament / gemstone / bangle glyph
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l4 5-4 15-4-15 4-5zm-7 5h14M8 7l4 15m4-15l-4 15" />
      </svg>
    ),
  },
  Posture: {
    bg: 'bg-madder',
    text: 'text-parchment',
    border: 'border-madder',
    ring: 'focus:ring-madder',
    icon: (
      // Biomechanical spine / posture stance glyph
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="12" cy="4.5" r="2.5" fill="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.5v8m-3.5-5l3.5-3.5 3.5 3.5m-5 9l1.5-4 1.5 4" />
      </svg>
    ),
  },
  Tool: {
    bg: 'bg-ash',
    text: 'text-parchment',
    border: 'border-ash',
    ring: 'focus:ring-ash',
    icon: (
      // Chakki stone / wrench / tool glyph
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.9 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
};

/**
 * CritiquePins - Accessible hotspot pin overlay with popover critiques and text list toggle.
 *
 * Props:
 * @param {Array} pins - Array of hotspot annotations [{ id, x, y, category, label, text }]
 * @param {React.ReactNode} children - The image or element to wrap
 * @param {function} [onPinSelect] - Callback when a pin is selected
 * @param {string} [activeId] - Currently active pin ID (controlled)
 */
export default function CritiquePins({
  pins = [],
  children,
  onPinSelect = null,
  activeId = null,
}) {
  const [internalActiveId, setInternalActiveId] = useState(null);
  const [visitedPins, setVisitedPins] = useState(() => new Set());
  const [showTextList, setShowTextList] = useState(false);

  const containerRef = useRef(null);
  const pinButtonRefs = useRef({});
  const popoverRef = useRef(null);

  const currentActiveId = activeId !== null && activeId !== undefined ? activeId : internalActiveId;
  const activePin = pins.find((p) => p.id === currentActiveId) || null;

  // Toggle or select a pin
  const handlePinClick = (pin) => {
    const nextId = currentActiveId === pin.id ? null : pin.id;
    setInternalActiveId(nextId);
    setVisitedPins((prev) => new Set(prev).add(pin.id));
    if (onPinSelect) {
      onPinSelect(nextId ? pin : null);
    }
  };

  const handleClosePopover = useCallback(() => {
    const closedId = currentActiveId;
    setInternalActiveId(null);
    if (onPinSelect) onPinSelect(null);

    // Return focus to the trigger pin button for accessibility
    if (closedId && pinButtonRefs.current[closedId]) {
      pinButtonRefs.current[closedId]?.focus();
    }
  }, [currentActiveId, onPinSelect]);

  // Close on Escape or outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activePin) {
        e.preventDefault();
        handleClosePopover();
      }
    };

    const handlePointerDown = (e) => {
      if (!activePin) return;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        !Object.values(pinButtonRefs.current).some((btn) => btn && btn.contains(e.target))
      ) {
        handleClosePopover();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [activePin, handleClosePopover]);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Relative Image Viewport Container */}
      <div ref={containerRef} className="relative w-full rounded-lg overflow-hidden border border-ash/30">
        {children}

        {/* Pins Interactive Layer */}
        {pins.map((pin) => {
          const config = categoryConfig[pin.category] || categoryConfig.Posture;
          const isSelected = pin.id === currentActiveId;
          const isVisited = visitedPins.has(pin.id);

          return (
            <div
              key={pin.id}
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 pointer-events-auto"
            >
              {/* Hit area button: min 44x44px touch target, 28x28px visible marker */}
              <button
                ref={(el) => (pinButtonRefs.current[pin.id] = el)}
                type="button"
                onClick={() => handlePinClick(pin)}
                aria-label={`${pin.category}: ${pin.label}`}
                aria-expanded={isSelected}
                className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 focus:ring-offset-parchment group"
              >
                {/* Pulse animation for unvisited pins (disabled under prefers-reduced-motion) */}
                {!isVisited && (
                  <span
                    className={`absolute inset-1.5 rounded-full animate-ping opacity-40 ${config.bg} motion-reduce:hidden pointer-events-none`}
                  />
                )}

                {/* Visible 28px marker with 2px border for forced-colors mode */}
                <span
                  className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center shadow-lg border-2 border-parchment forced-colors:border-[ButtonText] transition-transform ${
                    config.bg
                  } ${config.text} ${isSelected ? 'scale-125 ring-2 ring-indigo-dye' : 'group-hover:scale-110'}`}
                >
                  {config.icon}
                </span>
              </button>

              {/* Popover Card: Flips side when near edges, clamped within container */}
              {isSelected && (
                <div
                  ref={popoverRef}
                  tabIndex={-1}
                  role="dialog"
                  aria-label={pin.label}
                  className={`absolute z-30 w-64 sm:w-72 p-4 bg-ink/95 text-parchment rounded-lg shadow-2xl border border-ash/50 text-left pointer-events-auto animate-fade-in ${
                    pin.y > 60 ? 'bottom-full mb-3' : 'top-full mt-3'
                  } ${
                    pin.x > 60
                      ? 'right-0 translate-x-2'
                      : pin.x < 40
                      ? 'left-0 -translate-x-2'
                      : 'left-1/2 -translate-x-1/2'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-ash/30">
                    <span className="font-serif font-bold text-sm text-parchment line-clamp-1">
                      {pin.label}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className={`text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${config.bg} ${config.text}`}>
                        {pin.category}
                      </span>
                      <button
                        type="button"
                        onClick={handleClosePopover}
                        className="text-parchment/60 hover:text-parchment p-1 rounded hover:bg-ash/20 focus:outline-none"
                        aria-label="Close critique popup"
                      >
                        &times;
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-parchment/90 leading-relaxed font-sans font-light">
                    {pin.text}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Non-visual alternative: "Show all critiques" toggle & accessible text list */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowTextList((prev) => !prev)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-madder hover:text-ink transition-colors focus:outline-none focus:underline"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showTextList ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span>
            {showTextList ? 'Hide critique text list' : `Show all critiques (${pins.length})`}
          </span>
        </button>

        {showTextList && (
          <div className="bg-[#ECE4D4] border border-ash/30 rounded-lg p-4 space-y-3 text-left">
            <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-ink border-b border-ash/20 pb-1.5">
              Annotated Material &amp; Ergonomic Critiques ({pins.length})
            </h5>
            <ul className="space-y-2.5 divide-y divide-ash/20 pt-1">
              {pins.map((pin) => {
                const config = categoryConfig[pin.category] || categoryConfig.Posture;
                return (
                  <li key={pin.id} className="pt-2 first:pt-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${config.bg} ${config.text}`}>
                        {config.icon}
                      </span>
                      <span className="font-serif font-bold text-xs text-ink">{pin.label}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-ash/20 text-ash">
                        {pin.category} &bull; ({pin.x}%, {pin.y}%)
                      </span>
                    </div>
                    <p className="text-xs text-ink/80 leading-relaxed pl-7">{pin.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
