import React, { useState } from 'react';

export default function FilterBar({
  vocab = {},
  filters = { era: 'All', labor: [], material: [] },
  onFilterChange,
  onReset,
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const eras = ['All', ...(vocab.era || [])];
  const laborTypes = vocab.laborType || [];
  const materialElements = vocab.materialElement || [];

  const handleEraSelect = (eraVal) => {
    onFilterChange({
      ...filters,
      era: eraVal,
    });
  };

  const handleLaborToggle = (laborVal) => {
    const current = filters.labor || [];
    const next = current.includes(laborVal)
      ? current.filter((l) => l !== laborVal)
      : [...current, laborVal];
    onFilterChange({
      ...filters,
      labor: next,
    });
  };

  const handleMaterialToggle = (materialVal) => {
    const current = filters.material || [];
    const next = current.includes(materialVal)
      ? current.filter((m) => m !== materialVal)
      : [...current, materialVal];
    onFilterChange({
      ...filters,
      material: next,
    });
  };

  const activeCount =
    (filters.era !== 'All' ? 1 : 0) +
    (filters.labor?.length || 0) +
    (filters.material?.length || 0);

  const hasActiveFilters = activeCount > 0;

  return (
    <div className="bg-[#EFE8DA] rounded-xl border border-ash/30 p-4 sm:p-6 space-y-4 shadow-sm">
      {/* Mobile Disclosure Button & Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-ink">Faceted Filter Console</h2>
          <p className="text-xs text-ash hidden sm:block">
            Refine collection across historical eras, labor classifications, and material elements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileExpanded((prev) => !prev)}
            aria-expanded={mobileExpanded}
            aria-controls="filter-groups-container"
            className="sm:hidden min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg bg-ink text-parchment text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-dye"
          >
            <span>{mobileExpanded ? 'Hide Filters' : 'Filters'}</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-turmeric text-ink flex items-center justify-center font-mono font-bold text-[10px]">
                {activeCount}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] px-3 py-2 text-xs font-semibold text-madder hover:text-ink underline decoration-dotted transition-colors focus:outline-none focus:ring-2 focus:ring-madder rounded"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Groups Container (Collapsible on mobile, always visible on sm+) */}
      <div
        id="filter-groups-container"
        className={`space-y-5 pt-2 border-t border-ash/20 ${mobileExpanded ? 'block' : 'hidden sm:block'}`}
      >
        {/* Group 1: Era (Single-select chips + 'All') */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink font-mono text-[11px]">
              Historical Era <span className="font-normal text-ash font-sans">(Single-select)</span>
            </span>
            {filters.era !== 'All' && (
              <span className="font-mono text-[11px] text-indigo-dye font-semibold">Active: {filters.era}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {eras.map((era) => {
              const isSelected = filters.era === era;
              return (
                <button
                  key={era}
                  type="button"
                  onClick={() => handleEraSelect(era)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 focus:ring-offset-parchment ${
                    isSelected
                      ? 'bg-ink text-parchment shadow-md font-semibold ring-2 ring-turmeric'
                      : 'bg-parchment text-ink/80 hover:bg-ash/20 border border-ash/30'
                  }`}
                >
                  {era}
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 2: Labor Type (Multi-select) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink font-mono text-[11px]">
              Labor Classification <span className="font-normal text-ash font-sans">(Multi-select, OR)</span>
            </span>
            {filters.labor?.length > 0 && (
              <span className="font-mono text-[11px] text-indigo-dye font-semibold">
                {filters.labor.length} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {laborTypes.map((labor) => {
              const isSelected = filters.labor?.includes(labor);
              return (
                <button
                  key={labor}
                  type="button"
                  onClick={() => handleLaborToggle(labor)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 focus:ring-offset-parchment ${
                    isSelected
                      ? 'bg-madder text-parchment shadow font-semibold'
                      : 'bg-parchment text-ink/80 hover:bg-ash/20 border border-ash/30'
                  }`}
                >
                  <span>{labor}</span>
                  {isSelected && <span className="text-[11px] leading-none" aria-hidden="true">&times;</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 3: Material Element (Multi-select) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink font-mono text-[11px]">
              Material Culture Element <span className="font-normal text-ash font-sans">(Multi-select, OR)</span>
            </span>
            {filters.material?.length > 0 && (
              <span className="font-mono text-[11px] text-indigo-dye font-semibold">
                {filters.material.length} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {materialElements.map((elem) => {
              const isSelected = filters.material?.includes(elem);
              return (
                <button
                  key={elem}
                  type="button"
                  onClick={() => handleMaterialToggle(elem)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2 focus:ring-offset-parchment ${
                    isSelected
                      ? 'bg-indigo-dye text-parchment shadow font-semibold'
                      : 'bg-parchment text-ink/80 hover:bg-ash/20 border border-ash/30'
                  }`}
                >
                  <span>{elem}</span>
                  {isSelected && <span className="text-[11px] leading-none" aria-hidden="true">&times;</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
