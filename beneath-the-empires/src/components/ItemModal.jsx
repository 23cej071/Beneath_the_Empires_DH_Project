import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideBySideAudit from './SideBySideAudit';
import CritiquePins from './CritiquePins';
import OviAudioPlayer from './OviAudioPlayer';
import oviCues from '../data/ovi-cues.json';

/**
 * ItemModal - Deep dive dialog inspecting archival evidence, AI critique, metadata, and oral audio.
 *
 * Props:
 * @param {Object} item - Current active archetype object from archives.json
 * @param {Array} filteredItems - Array of current filtered items for Prev/Next navigation
 * @param {function} onClose - Callback to close the modal
 */
export default function ItemModal({ item, filteredItems = [], onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('analysis');
  const [activePin, setActivePin] = useState(null);

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const tabRefs = useRef({});
  const lastActiveElementRef = useRef(null);

  // Available tabs: Listen is only present if item.audio is not null
  const availableTabs = [
    { id: 'analysis', label: 'Analysis' },
    { id: 'audit', label: 'AI Audit' },
    { id: 'metadata', label: 'Metadata' },
    ...(item?.audio ? [{ id: 'listen', label: 'Listen' }] : []),
  ];

  // Derived active tab: fallback to analysis if listen tab is selected but current item has no audio
  const resolvedTab = activeTab === 'listen' && !item?.audio ? 'analysis' : activeTab;

  // Index in currently filtered items for Prev/Next navigation
  const currentIndex = filteredItems.findIndex((it) => it.id === item?.id);
  const prevItem = currentIndex > 0 ? filteredItems[currentIndex - 1] : null;
  const nextItem = currentIndex < filteredItems.length - 1 ? filteredItems[currentIndex + 1] : null;

  const navigateToItem = (targetItem) => {
    if (!targetItem) return;
    navigate({
      pathname: `/exhibit/${targetItem.id}`,
      search: location.search,
    });
  };

  // Keyboard navigation & focus trap
  useEffect(() => {
    lastActiveElementRef.current = document.activeElement;

    // Lock body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button initially
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      // Escape closes modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableSelectors =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll(focusableSelectors)
        ).filter((el) => !el.disabled && el.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // Restore focus to originating card
      const cardEl = document.getElementById(`archetype-card-${item?.id}`);
      if (cardEl) {
        cardEl.focus();
      } else if (lastActiveElementRef.current?.focus) {
        lastActiveElementRef.current.focus();
      }
    };
  }, [item?.id, onClose]);

  // WAI-ARIA Tab Arrow Key Navigation
  const handleTabKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % availableTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + availableTabs.length) % availableTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = availableTabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = availableTabs[nextIndex];
      setActiveTab(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    }
  };

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
    >
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Shell: Fullscreen Sheet on mobile, rounded card on sm+ */}
      <div
        ref={dialogRef}
        className="relative w-full h-full sm:h-auto sm:max-h-[94vh] max-w-6xl bg-parchment sm:rounded-2xl shadow-2xl border-0 sm:border border-ash/40 overflow-hidden z-10 flex flex-col"
      >
        {/* Top Navigation Bar */}
        <div className="p-4 sm:p-5 border-b border-ash/30 flex flex-wrap items-center justify-between gap-3 bg-[#EFE8DA] shrink-0">
          <div className="flex items-center gap-3">
            {/* Prev / Next controls (min 44px touch targets) */}
            <div className="flex items-center gap-1 bg-parchment rounded-lg border border-ash/30 p-1">
              <button
                type="button"
                onClick={() => navigateToItem(prevItem)}
                disabled={!prevItem}
                aria-label="Previous filtered archetype"
                className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-semibold rounded hover:bg-ash/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-dye"
              >
                &larr; Prev
              </button>
              <span className="text-[11px] font-mono text-ash px-2">
                {currentIndex !== -1 ? `${currentIndex + 1} of ${filteredItems.length}` : ''}
              </span>
              <button
                type="button"
                onClick={() => navigateToItem(nextItem)}
                disabled={!nextItem}
                aria-label="Next filtered archetype"
                className="min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-semibold rounded hover:bg-ash/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-dye"
              >
                Next &rarr;
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-turmeric text-ink font-bold">
                {item.era}
              </span>
              <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded bg-ash/20 text-ink">
                {item.laborType}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg bg-ink hover:bg-madder text-parchment text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2"
            aria-label="Close dialog"
          >
            <span>Close</span>
            <span className="text-base leading-none" aria-hidden="true">&times;</span>
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Bar across modal: Title context & Tab Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ash/30 pb-3">
            <div>
              <h2 id="item-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                {item.dc.title}
              </h2>
              <div className="text-xs text-ash mt-0.5">
                <span>{item.dc.creator}</span> &bull; <span>{item.dc.spatial}</span> &bull;{' '}
                <span className="font-mono">{item.dc.date}</span>
              </div>
            </div>

            {/* Accessible Tablist */}
            <div
              role="tablist"
              aria-label="Archetype details"
              className="flex items-center gap-1.5 overflow-x-auto bg-[#ECE4D4] p-1 rounded-xl border border-ash/30"
            >
              {availableTabs.map((tab, idx) => {
                const isSelected = resolvedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => (tabRefs.current[tab.id] = el)}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-controls={`panel-${tab.id}`}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-dye whitespace-nowrap ${
                      isSelected
                        ? 'bg-indigo-dye text-parchment shadow-md'
                        : 'text-ink/80 hover:text-ink hover:bg-ash/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              VIEW OPTION 1: FULL-WIDTH AI AUDIT & DUAL-PANE PROMPT INSPECTION
              ========================================================================= */}
          {resolvedTab === 'audit' && (
            <div
              role="tabpanel"
              id="panel-audit"
              aria-labelledby="tab-audit"
              tabIndex={0}
              className="focus:outline-none bg-[#ECE4D4] p-4 sm:p-6 rounded-2xl border border-ash/30 shadow-sm"
            >
              <SideBySideAudit item={item} initialMode="side-by-side" />
            </div>
          )}

          {/* =========================================================================
              VIEW OPTION 2: 2-COLUMN LAYOUT FOR ANALYSIS, METADATA, AND ORAL AUDIO
              ========================================================================= */}
          {resolvedTab !== 'audit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Column 1 (Left): Archival Image with Thin Parchment Border & CritiquePins */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-ash">
                  <span className="font-semibold uppercase tracking-wider text-ink font-mono text-[11px]">
                    Annotated Archival Record
                  </span>
                  <span className="italic">Click pins for ergonomic hotspots</span>
                </div>

                {/* Thin parchment-border around archival image */}
                <div className="border border-parchment rounded-lg overflow-hidden shadow-sm">
                  <CritiquePins
                    pins={item.pins}
                    activeId={activePin?.id}
                    onPinSelect={(pin) => setActivePin(pin)}
                  >
                    <img
                      src={item.image.url}
                      alt={item.image.alt}
                      className="w-full aspect-[4/3] object-cover object-top"
                    />
                  </CritiquePins>
                </div>

                {/* Archival caption */}
                <figcaption className="text-xs text-ash leading-relaxed border-l-2 border-ash/40 pl-2 italic font-serif">
                  <strong className="text-ink not-italic font-sans text-[10px] uppercase mr-1">Provenance:</strong>
                  {item.dc.title} ({item.dc.date}), {item.dc.source?.repository}. {item.dc.rights}.
                </figcaption>
              </div>

              {/* Column 2 (Right): Selected Tab Panel */}
              <div className="space-y-4">
                {/* Tabpanel 1: Analysis */}
                {resolvedTab === 'analysis' && (
                  <div
                    role="tabpanel"
                    id="panel-analysis"
                    aria-labelledby="tab-analysis"
                    tabIndex={0}
                    className="space-y-5 focus:outline-none bg-[#ECE4D4] p-5 rounded-lg border border-ash/30"
                  >
                    <div className="space-y-2">
                      <h3 className="font-serif text-base font-bold text-ink">Historical Context</h3>
                      <p className="font-serif text-[17px] leading-[1.7] text-ink/90">
                        {item.dc.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-ash/20">
                      <h3 className="font-serif text-base font-bold text-indigo-dye flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-dye"></span>
                        <span>Ergonomic &amp; Bodily Technology</span>
                      </h3>
                      <p className="text-[17px] leading-[1.7] text-ink/90 font-serif">
                        {item.bte?.ergonomicFunction}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-ash/20 flex flex-wrap gap-1.5 items-center">
                      <span className="text-xs font-semibold text-ash font-mono uppercase mr-2 text-[11px]">
                        Materials:
                      </span>
                      {item.materialElements?.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded bg-ash/20 font-mono text-[10px] text-ink">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabpanel 3: Metadata (Dublin Core Definition List) */}
                {resolvedTab === 'metadata' && (
                  <div
                    role="tabpanel"
                    id="panel-metadata"
                    aria-labelledby="tab-metadata"
                    tabIndex={0}
                    className="space-y-4 focus:outline-none bg-[#ECE4D4] p-5 rounded-lg border border-ash/30"
                  >
                    <div className="flex items-center justify-between border-b border-ash/20 pb-2">
                      <h3 className="font-serif text-base font-bold text-ink">Dublin Core Schema Record</h3>
                      <span className="text-[10px] font-mono text-ash uppercase bg-ash/20 px-2 py-0.5 rounded">
                        DCMES + bte:1.0
                      </span>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                      <div className="p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:title</dt>
                        <dd className="font-semibold text-ink mt-0.5">{item.dc.title}</dd>
                      </div>

                      <div className="p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:creator</dt>
                        <dd className="text-ink mt-0.5">{item.dc.creator}</dd>
                      </div>

                      <div className="p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:date</dt>
                        <dd className="font-mono text-ink mt-0.5">{item.dc.date}</dd>
                      </div>

                      <div className="p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dcterms:spatial</dt>
                        <dd className="text-ink mt-0.5">{item.dc.spatial}</dd>
                      </div>

                      <div className="p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:format</dt>
                        <dd className="text-ink mt-0.5">{item.dc.format}</dd>
                      </div>

                      <div className="p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:rights</dt>
                        <dd className="text-ink mt-0.5">{item.dc.rights}</dd>
                      </div>

                      <div className="sm:col-span-2 p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:subject</dt>
                        <dd className="flex flex-wrap gap-1 mt-1">
                          {item.dc.subject?.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-ash/15 rounded font-mono text-[10px]">
                              {s}
                            </span>
                          ))}
                        </dd>
                      </div>

                      <div className="sm:col-span-2 p-2.5 rounded bg-parchment border border-ash/20">
                        <dt className="font-mono text-[10px] uppercase font-bold text-ash">dc:source</dt>
                        <dd className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-ink">
                          <span>{item.dc.source?.repository} &bull; {item.dc.source?.file}</span>
                          {item.dc.source?.url && (
                            <a
                              href={item.dc.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-dye hover:underline font-semibold"
                            >
                              View Commons Source &rarr;
                            </a>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}

                {/* Tabpanel 4: Listen (only rendered if item.audio is not null) */}
                {resolvedTab === 'listen' && item.audio && (
                  <div
                    role="tabpanel"
                    id="panel-listen"
                    aria-labelledby="tab-listen"
                    tabIndex={0}
                    className="space-y-4 focus:outline-none"
                  >
                    <OviAudioPlayer
                      src={item.audio.src}
                      title={`Grindmill Ovi (${item.dc.title})`}
                      cues={oviCues}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
