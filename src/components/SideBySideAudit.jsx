import React, { useState, useRef, useEffect, useCallback } from 'react';
import CompareSlider from './CompareSlider';

/**
 * SideBySideAudit - Interactive AI Audit & Prompt Inspection Component
 *
 * Provides:
 * 1. Top Bar: Simulated "Prompt Terminal / Card" displaying model tag and prompt text with copy feature.
 * 2. View Mode Toggle: "Side-by-Side Audit" | "Side-by-Side Slider" | "View Archival Reality" | "View AI Hallucination".
 * 3. Center Dual-Pane View: Archival Photo (Ground Truth) vs. Generative AI Output with interactive red audit pins.
 * 4. Bottom Panel: 3-column Algorithmic Discrepancy Breakdown (Fabric, Ornaments, Biomechanics)
 *    with contrasting Emerald (Ground Truth) vs. Rose (AI Hallucination) badges.
 */
export default function SideBySideAudit({ item, initialMode = 'side-by-side', className = '' }) {
  const [viewMode, setViewMode] = useState(initialMode);
  const [activePinId, setActivePinId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showPinList, setShowPinList] = useState(false);

  const popoverRef = useRef(null);
  const pinButtonsRef = useRef({});

  // Fallback prompt and model if item has no custom ai field
  const promptText =
    item?.prompt ||
    item?.ai?.prompt ||
    `Historical documentary photograph of an 1870s working-class Indian woman, ${item?.dc?.title || 'worker'}, natural lighting, documentary archival style, nineteenth century Bombay Presidency --v 6.1 --style raw`;

  const modelTag =
    item?.model ||
    item?.aiImage?.generator ||
    'Midjourney v6.1 [Historical Bias Benchmark]';

  // Audit pins: read from item.auditPins, or item.ai?.critique_pins, or default mapped pins
  const rawAuditPins = item?.auditPins || item?.ai?.critique_pins || [];
  const auditPins = rawAuditPins.length > 0
    ? rawAuditPins
    : [
        {
          id: 'audit-p1',
          x: 48,
          y: 60,
          category: 'Fabric',
          label: 'Hallucination: Luxury Silk Drape',
          text: 'Model generated smooth, high-luster silk. Ground truth evidence confirms coarse, rough-spun handloom cotton tailored to resist dirt and friction.',
        },
        {
          id: 'audit-p2',
          x: 55,
          y: 40,
          category: 'Jewelry',
          label: 'Hallucination: Gold Bridal Ornaments',
          text: 'Model hallucinated delicate gold filigree jewelry despite strict historical caste sumptuary bans and physical labor hazard.',
        },
        {
          id: 'audit-p3',
          x: 45,
          y: 30,
          category: 'Posture',
          label: 'Hallucination: Demure Studio Posing',
          text: 'Model depicted a relaxed, coy smile facing the lens. Historical labor required dynamic, muscular bracing and ergonomic load-bearing.',
        },
      ];

  // 3-Column Discrepancies
  const discrepancies = item?.discrepancies || {
    fabric: {
      title: 'Fabric & Material Texture',
      groundTruth:
        item?.bte?.ergonomicFunction ||
        'Coarse handspun cotton; rough weave and unhemmed hems allow bodily articulation while absorbing grit and perspiration.',
      hallucination:
        'Lustrous, spotless Banarasi silk with metallic borders; completely unsuited for heavy physical labor.',
    },
    jewelry: {
      title: 'Ornaments & Body Markings',
      groundTruth:
        'Modest cast pewter or brass bangles, cord amulets, and protective soot godna tattoos; absence of expensive precious metals.',
      hallucination:
        'Bridal-tier gold filigree necklaces, gemstone earrings, and lightened complexion adhering to elite beauty standards.',
    },
    ergonomics: {
      title: 'Biomechanics & Utilitarian Stance',
      groundTruth:
        'Functional mechanical leverage (low splayed-knee seated stability, vertical spinal load stacking, or tucked pallu).',
      hallucination:
        'Demure, languid studio pose with coy smile, exhibiting zero mechanical awareness or physical exertion.',
    },
  };

  const handleCopyPrompt = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleClosePopover = useCallback(() => {
    const closedId = activePinId;
    setActivePinId(null);
    if (closedId && pinButtonsRef.current[closedId]) {
      pinButtonsRef.current[closedId]?.focus();
    }
  }, [activePinId]);

  // Escape key and outside click handling for audit pin popovers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activePinId) {
        e.preventDefault();
        handleClosePopover();
      }
    };

    const handlePointerDown = (e) => {
      if (!activePinId) return;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        !Object.values(pinButtonsRef.current).some((btn) => btn && btn.contains(e.target))
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
  }, [activePinId, handleClosePopover]);

  const activePin = auditPins.find((p) => p.id === activePinId) || null;

  const archivalUrl = item?.image?.url || '';
  const archivalAlt = item?.image?.alt || item?.dc?.title || 'Archival ground truth photograph';
  const aiUrl = item?.aiImage?.url || '/ai/ai-01.jpg';
  const aiAlt = item?.aiImage?.alt || 'AI generated comparative specimen';

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* =========================================================================
          1. TOP BAR: PROMPT TERMINAL & MODEL CARD
          ========================================================================= */}
      <div className="bg-[#181615] text-[#ECE5D8] rounded-xl border border-ash/40 shadow-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#12100F] border-b border-ash/30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-ash font-semibold">
              Generative Prompt Terminal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 font-mono text-[11px] font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{modelTag}</span>
            </span>

            <button
              type="button"
              onClick={handleCopyPrompt}
              aria-label="Copy AI prompt string"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#24201D] hover:bg-ash/30 text-parchment text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-dye"
            >
              <svg className="w-3.5 h-3.5 text-ash" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start gap-2 text-parchment/95">
            <span className="text-emerald-400 font-bold select-none">&gt;&nbsp;prompt:</span>
            <span className="text-parchment font-light tracking-wide">{promptText}</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-ash/20 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ash">
            <span>
              Target Subject: <strong className="text-parchment font-semibold">{item?.dc?.title || 'Subaltern Worker'}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Era: <strong className="text-parchment font-semibold">{item?.era || '19th Century'}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Caste/Labor: <strong className="text-parchment font-semibold">{item?.laborType || 'Manual'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. VIEW MODE TOGGLE SWITCH
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#ECE4D4] p-2.5 rounded-lg border border-ash/30">
        <span className="font-serif text-xs font-bold uppercase tracking-wider text-ink px-2">
          Audit Display Mode
        </span>

        <div
          role="radiogroup"
          aria-label="Audit Display Mode"
          className="inline-flex rounded-lg bg-parchment p-1 border border-ash/40 shadow-inner w-full sm:w-auto"
        >
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'side-by-side'}
            onClick={() => setViewMode('side-by-side')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-indigo-dye text-parchment shadow-sm font-semibold'
                : 'text-ink/80 hover:text-ink hover:bg-ash/20'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>Side-by-Side</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'slider'}
            onClick={() => setViewMode('slider')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'slider'
                ? 'bg-indigo-dye text-parchment shadow-sm font-semibold'
                : 'text-ink/80 hover:text-ink hover:bg-ash/20'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
            </svg>
            <span>Split Slider</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'archival'}
            onClick={() => setViewMode('archival')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'archival'
                ? 'bg-emerald-800 text-parchment shadow-sm font-semibold'
                : 'text-ink/80 hover:text-ink hover:bg-ash/20'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Archival Reality</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'ai'}
            onClick={() => setViewMode('ai')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'ai'
                ? 'bg-rose-700 text-parchment shadow-sm font-semibold'
                : 'text-ink/80 hover:text-ink hover:bg-ash/20'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>AI Hallucination</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. CENTER VIEW: DUAL-PANE SIDE-BY-SIDE / SPLIT / FOCUSED
          ========================================================================= */}

      {/* Mode A: Side-by-Side Dual-Pane (Desktop 2-column grid) */}
      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Archival Reality (Ground Truth) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/20 text-emerald-900 border border-emerald-700/30 font-mono text-xs font-bold uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Archival Reality (Ground Truth)</span>
              </span>

              <span className="text-xs font-mono text-ash font-medium">{item?.dc?.date || 'Historical'}</span>
            </div>

            {/* Archival Image with thin parchment border */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#ECE5D8] border border-ash/40 shadow-md">
              <img
                src={archivalUrl}
                alt={archivalAlt}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 bg-ink/80 text-parchment text-[11px] font-mono px-2 py-0.5 rounded backdrop-blur-sm shadow border border-ash/30">
                Primary Source Scan
              </div>
            </div>

            {/* Archival Citation & Date */}
            <figcaption className="text-xs text-ash leading-relaxed border-l-2 border-emerald-700/50 pl-3 py-0.5">
              <strong className="text-ink font-serif text-[13px] block mb-0.5">
                {item?.dc?.title} ({item?.dc?.date})
              </strong>
              <span>
                {item?.dc?.creator} &bull; {item?.dc?.spatial} &bull; {item?.dc?.source?.repository || 'Wikimedia Commons'}.{' '}
                <span className="italic">{item?.dc?.rights}</span>
              </span>
            </figcaption>
          </div>

          {/* Right Column: Generative AI Output with Red Audit Pins */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/20 text-rose-900 border border-rose-700/30 font-mono text-xs font-bold uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Generative AI Output (Specimen)</span>
              </span>

              <span className="text-xs font-mono text-madder font-semibold">
                {auditPins.length} Hallucinations Pinned
              </span>
            </div>

            {/* AI Image Container with Madder Dashed Border */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1F1A17] border-2 border-dashed border-madder shadow-md group">
              <img
                src={aiUrl}
                alt={aiAlt}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />

              {/* Persistent Warning Badge */}
              <div className="absolute bottom-2.5 right-2.5 bg-madder/90 text-parchment text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded backdrop-blur-sm shadow border border-parchment/20 pointer-events-none z-10">
                AI-generated, not historical evidence
              </div>

              {/* Red Audit Pins Overlaid on AI Image */}
              {auditPins.map((pin) => {
                const isSelected = pin.id === activePinId;
                return (
                  <div
                    key={pin.id}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
                    className="absolute z-20 pointer-events-auto"
                  >
                    <button
                      ref={(el) => (pinButtonsRef.current[pin.id] = el)}
                      type="button"
                      onClick={() => setActivePinId(isSelected ? null : pin.id)}
                      onMouseEnter={() => setActivePinId(pin.id)}
                      aria-label={`${pin.category} Hallucination: ${pin.label}`}
                      aria-expanded={isSelected}
                      className="relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-parchment group/pin"
                    >
                      {/* Pulsing Alert Ping */}
                      <span className="absolute inset-2 rounded-full animate-ping opacity-60 bg-rose-600 motion-reduce:hidden pointer-events-none" />

                      {/* 28px Center Pin Badge */}
                      <span
                        className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center shadow-2xl border-2 border-white text-white font-mono text-xs font-black transition-transform bg-rose-600 ${
                          isSelected ? 'scale-125 ring-2 ring-rose-400 bg-rose-700' : 'group-hover/pin:scale-110'
                        }`}
                      >
                        !
                      </span>
                    </button>

                    {/* Popover Card */}
                    {isSelected && (
                      <div
                        ref={popoverRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-label={pin.label}
                        className={`absolute z-30 w-64 sm:w-72 p-4 bg-[#181615]/95 text-parchment rounded-xl shadow-2xl border border-rose-500/50 text-left pointer-events-auto animate-fade-in ${
                          pin.y > 55 ? 'bottom-full mb-3' : 'top-full mt-3'
                        } ${
                          pin.x > 60
                            ? 'right-0 translate-x-2'
                            : pin.x < 40
                            ? 'left-0 -translate-x-2'
                            : 'left-1/2 -translate-x-1/2'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-ash/30">
                          <span className="font-serif font-bold text-xs text-rose-300 line-clamp-1">
                            {pin.label}
                          </span>
                          <div className="flex items-center gap-1.5 ml-2">
                            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/50">
                              {pin.category}
                            </span>
                            <button
                              type="button"
                              onClick={handleClosePopover}
                              className="text-parchment/60 hover:text-parchment p-1 rounded hover:bg-ash/20 focus:outline-none"
                              aria-label="Close hallucination popover"
                            >
                              &times;
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-parchment/90 leading-relaxed font-sans font-light">
                          {pin.text}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-ash/20 text-[10px] font-mono text-ash flex items-center justify-between">
                          <span>Coordinate: ({pin.x}%, {pin.y}%)</span>
                          <span className="text-rose-400 font-semibold">Audit Finding</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Image Caption & Hint */}
            <div className="flex items-center justify-between text-xs text-ash border-l-2 border-rose-700/50 pl-3 py-0.5">
              <span>
                Generated from raw prompt using <strong className="text-ink">{modelTag}</strong>.
              </span>
              <span className="text-[11px] font-mono text-madder hidden sm:inline italic">
                Hover or click red pins to inspect
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Split Drag-Slider (CompareSlider) */}
      {viewMode === 'slider' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-base font-bold text-ink">
              Interactive Split-Slider Inspection
            </h4>
            <span className="text-xs text-ash italic">
              Drag circular divider or use Left/Right Arrow keys to compare
            </span>
          </div>

          <div className="border-2 border-dashed border-madder rounded-lg overflow-hidden relative shadow-md">
            <CompareSlider
              beforeSrc={archivalUrl}
              afterSrc={aiUrl}
              beforeAlt={archivalAlt}
              afterAlt={aiAlt}
              beforeLabel="Archival scan"
              afterLabel="AI generation"
              initial={50}
            />
          </div>

          <figcaption className="text-xs text-ash leading-relaxed border-l-2 border-ash/40 pl-3">
            <strong className="text-ink">Caption:</strong> {item?.dc?.title} ({item?.dc?.date}),{' '}
            {item?.dc?.source?.repository || 'Wikimedia Commons'}. {item?.dc?.rights}.
          </figcaption>
        </div>
      )}

      {/* Mode C: Archival Reality Only (Full Width) */}
      {viewMode === 'archival' && (
        <div className="space-y-3 bg-[#ECE5D8] p-5 rounded-xl border border-ash/40 shadow-sm">
          <div className="flex items-center justify-between border-b border-ash/30 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/20 text-emerald-900 border border-emerald-700/30 font-mono text-xs font-bold uppercase tracking-wider">
                Archival Ground Truth Record
              </span>
              <h4 className="font-serif text-xl font-bold text-ink mt-1">
                {item?.dc?.title} ({item?.dc?.date})
              </h4>
            </div>
            <span className="text-xs font-mono text-ash">{item?.id}</span>
          </div>

          <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[500px] w-full rounded-lg overflow-hidden bg-parchment border border-ash/30 shadow-inner">
            <img
              src={archivalUrl}
              alt={archivalAlt}
              className="w-full h-full object-contain object-center"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ink/90 pt-2 border-t border-ash/20">
            <div>
              <strong className="block font-serif text-sm text-ink mb-1">Historical Context:</strong>
              <p className="leading-relaxed">{item?.dc?.description}</p>
            </div>
            <div className="space-y-1">
              <strong className="block font-serif text-sm text-ink mb-1">Archival Provenance:</strong>
              <p>Collector: {item?.dc?.creator}</p>
              <p>Repository: {item?.dc?.source?.repository}</p>
              <p>Rights: {item?.dc?.rights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mode D: AI Hallucination Only (Full Width with Pins) */}
      {viewMode === 'ai' && (
        <div className="space-y-3 bg-[#1F1A17] text-parchment p-5 rounded-xl border-2 border-dashed border-madder shadow-lg">
          <div className="flex items-center justify-between border-b border-ash/30 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700/50 font-mono text-xs font-bold uppercase tracking-wider">
                Generative AI Specimen &amp; Visual Audit
              </span>
              <h4 className="font-serif text-xl font-bold text-parchment mt-1">
                Audited Model Output: {modelTag}
              </h4>
            </div>
            <span className="text-xs font-mono text-turmeric">{auditPins.length} Hallucinations Flagged</span>
          </div>

          <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[500px] w-full rounded-lg overflow-hidden bg-[#12100F] border border-ash/40">
            <img
              src={aiUrl}
              alt={aiAlt}
              className="w-full h-full object-contain object-center"
            />

            {/* Persistent badge */}
            <div className="absolute bottom-3 right-3 bg-madder text-parchment text-xs font-semibold px-3 py-1 rounded shadow border border-parchment/20">
              AI-generated, not historical evidence
            </div>

            {/* Pins */}
            {auditPins.map((pin) => (
              <div
                key={pin.id}
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
                className="absolute z-20 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={() => setActivePinId(activePinId === pin.id ? null : pin.id)}
                  aria-label={`${pin.category}: ${pin.label}`}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center bg-rose-600 text-white font-mono font-bold text-xs border-2 border-white shadow-xl">
                    !
                  </span>
                </button>
              </div>
            ))}
          </div>

          {activePin && (
            <div className="bg-[#12100F] p-4 rounded-lg border border-rose-500/50 text-left">
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-ash/30">
                <span className="font-serif font-bold text-sm text-rose-300">{activePin.label}</span>
                <span className="text-[10px] font-mono uppercase bg-rose-950 px-2 py-0.5 rounded text-rose-300">
                  {activePin.category}
                </span>
              </div>
              <p className="text-xs text-parchment/90 leading-relaxed">{activePin.text}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Collapsible List of Hallucination Pins */}
      <div className="text-left">
        <button
          type="button"
          onClick={() => setShowPinList(!showPinList)}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-madder hover:text-ink transition-colors focus:outline-none focus:underline"
        >
          <svg className={`w-4 h-4 transition-transform ${showPinList ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span>{showPinList ? 'Hide Hallucination Details' : `Inspect All Hallucination Pins (${auditPins.length})`}</span>
        </button>

        {showPinList && (
          <div className="mt-3 bg-[#ECE4D4] border border-ash/30 rounded-xl p-4 sm:p-5 space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-ink border-b border-ash/30 pb-2">
              Audited Hallucination Catalog
            </h5>
            <ul className="space-y-3 divide-y divide-ash/20">
              {auditPins.map((pin) => (
                <li key={pin.id} className="pt-2.5 first:pt-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      !
                    </span>
                    <strong className="font-serif text-sm text-ink">{pin.label}</strong>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-ash/20 text-ash">
                      {pin.category} &bull; ({pin.x}%, {pin.y}%)
                    </span>
                  </div>
                  <p className="text-xs text-ink/80 pl-7 leading-relaxed">{pin.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. BOTTOM PANEL: RESPONSIVE 3-COLUMN ALGORITHMIC DISCREPANCY BREAKDOWN
          ========================================================================= */}
      <div className="pt-4 border-t border-ash/30 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-bold text-ink">
            Algorithmic Discrepancy Breakdown
          </h4>
          <span className="text-xs font-mono text-ash uppercase hidden sm:inline">
            Triangulated Material Audit
          </span>
        </div>

        {/* 3-Column Comparative Audit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Fabric & Material Texture */}
          <div className="bg-[#ECE4D4] rounded-xl border border-ash/30 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-ash/25 pb-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-dye text-parchment flex items-center justify-center shadow-sm">
                  {/* Loom icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M7 3v18M12 3v18M17 3v18" />
                  </svg>
                </span>
                <h5 className="font-serif text-base font-bold text-ink">
                  {discrepancies.fabric.title}
                </h5>
              </div>

              {/* Historical Ground Truth */}
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-900 border border-emerald-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                  Ground Truth (Archival)
                </span>
                <p className="text-xs text-ink/90 leading-relaxed font-sans">
                  {discrepancies.fabric.groundTruth}
                </p>
              </div>

              {/* AI Hallucination */}
              <div className="space-y-1.5 pt-2 border-t border-ash/20">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/20 text-rose-900 border border-rose-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                  AI Hallucination
                </span>
                <p className="text-xs text-ink/80 leading-relaxed font-sans">
                  {discrepancies.fabric.hallucination}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Ornaments & Body Markings */}
          <div className="bg-[#ECE4D4] rounded-xl border border-ash/30 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-ash/25 pb-2">
                <span className="w-7 h-7 rounded-lg bg-turmeric text-ink flex items-center justify-center shadow-sm">
                  {/* Bangle / jewel icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l4 5-4 15-4-15 4-5zm-7 5h14M8 7l4 15m4-15l-4 15" />
                  </svg>
                </span>
                <h5 className="font-serif text-base font-bold text-ink">
                  {discrepancies.jewelry.title}
                </h5>
              </div>

              {/* Historical Ground Truth */}
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-900 border border-emerald-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                  Ground Truth (Archival)
                </span>
                <p className="text-xs text-ink/90 leading-relaxed font-sans">
                  {discrepancies.jewelry.groundTruth}
                </p>
              </div>

              {/* AI Hallucination */}
              <div className="space-y-1.5 pt-2 border-t border-ash/20">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/20 text-rose-900 border border-rose-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                  AI Hallucination
                </span>
                <p className="text-xs text-ink/80 leading-relaxed font-sans">
                  {discrepancies.jewelry.hallucination}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Biomechanics & Utilitarian Stance */}
          <div className="bg-[#ECE4D4] rounded-xl border border-ash/30 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-ash/25 pb-2">
                <span className="w-7 h-7 rounded-lg bg-madder text-parchment flex items-center justify-center shadow-sm">
                  {/* Spine / posture icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="4.5" r="2.5" fill="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.5v8m-3.5-5l3.5-3.5 3.5 3.5m-5 9l1.5-4 1.5 4" />
                  </svg>
                </span>
                <h5 className="font-serif text-base font-bold text-ink">
                  {discrepancies.ergonomics.title}
                </h5>
              </div>

              {/* Historical Ground Truth */}
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-900 border border-emerald-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                  Ground Truth (Archival)
                </span>
                <p className="text-xs text-ink/90 leading-relaxed font-sans">
                  {discrepancies.ergonomics.groundTruth}
                </p>
              </div>

              {/* AI Hallucination */}
              <div className="space-y-1.5 pt-2 border-t border-ash/20">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/20 text-rose-900 border border-rose-700/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                  AI Hallucination
                </span>
                <p className="text-xs text-ink/80 leading-relaxed font-sans">
                  {discrepancies.ergonomics.hallucination}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
