import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * GalleryGrid - Responsive grid of archival archetype cards.
 *
 * Props:
 * @param {Array} items - Filtered archetype items
 * @param {function} [onResetFilters] - Reset callback for the empty state
 */
export default function GalleryGrid({ items = [], onResetFilters }) {
  const location = useLocation();

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#EFE8DA] rounded-xl border border-dashed border-ash/40 space-y-4">
        <svg className="w-12 h-12 mx-auto text-ash" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-bold text-ink">No Matching Archetypes Found</h3>
          <p className="text-sm text-ash max-w-md mx-auto">
            No archival records match the combination of your selected era, labor types, and material culture elements.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded bg-madder hover:bg-ink text-parchment text-xs font-semibold uppercase tracking-wider transition-colors shadow"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {items.map((item) => {
        // Preserve query string so deep links maintain the user's active filter view
        const linkTo = `/exhibit/${item.id}${location.search}`;

        return (
          <Link
            key={item.id}
            to={linkTo}
            id={`archetype-card-${item.id}`}
            aria-label={`Open record: ${item.dc.title}`}
            className="group block bg-[#ECE4D4] rounded-xl overflow-hidden border border-ash/30 hover:border-madder hover:shadow-xl transition-all duration-300 flex flex-col focus:outline-none focus:ring-4 focus:ring-madder/40"
          >
            {/* Archival Image (lazy-loaded, fixed 4/3 aspect ratio) */}
            <div className="relative aspect-[4/3] bg-ink/10 overflow-hidden">
              <img
                src={item.image.url}
                alt={item.image.alt}
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="bg-ink/90 text-parchment font-mono text-[11px] px-2 py-0.5 rounded shadow">
                  {item.era}
                </span>
                <span className="bg-turmeric text-ink font-sans font-bold text-[11px] px-2 py-0.5 rounded shadow uppercase">
                  {item.laborType}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-madder/90 text-parchment text-[10px] font-mono px-2 py-0.5 rounded shadow">
                {item.pins?.length || 0} Pins
              </div>
            </div>

            {/* Card Content Block */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-ash">
                  <span className="italic truncate mr-2">{item.dc.creator}</span>
                  <span className="font-mono whitespace-nowrap">{item.dc.date}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-ink group-hover:text-madder transition-colors leading-snug">
                  {item.dc.title}
                </h3>

                {/* One-line ergonomic function excerpt */}
                <p className="text-xs text-ink/80 leading-relaxed line-clamp-1 italic font-sans" title={item.bte?.ergonomicFunction}>
                  <strong className="not-italic text-ash uppercase text-[10px] mr-1">Ergonomics:</strong>
                  {item.bte?.ergonomicFunction}
                </p>
              </div>

              {/* Card Footer with Material Tags */}
              <div className="pt-3 border-t border-ash/20 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.materialElements?.map((elem) => (
                    <span
                      key={elem}
                      className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ash/15 text-ash"
                    >
                      {elem}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-semibold text-madder group-hover:translate-x-1 transition-transform inline-flex items-center">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
