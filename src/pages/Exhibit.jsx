import React, { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import useArchives from '../hooks/useArchives';
import useDocumentTitle from '../hooks/useDocumentTitle';
import {
  filterArchiveItems,
  parseFiltersFromParams,
  serializeFiltersToParams,
} from '../utils/filters';
import FilterBar from '../components/FilterBar';
import GalleryGrid from '../components/GalleryGrid';
import ItemModal from '../components/ItemModal';

export default function Exhibit() {
  const { items, vocab, getById } = useArchives();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filter state from URL search parameters
  const currentFilters = useMemo(() => {
    return parseFiltersFromParams(searchParams);
  }, [searchParams]);

  // Combined AND/OR filtering
  const filteredItems = useMemo(() => {
    return filterArchiveItems(items, currentFilters);
  }, [items, currentFilters]);

  // Active archetype for the deep-link modal
  const activeItem = useMemo(() => {
    return id ? getById(id) : null;
  }, [id, getById]);

  useDocumentTitle(
    activeItem ? `${activeItem.dc.title} — Archival Record` : 'Exhibit Gallery',
    'Faceted archival gallery of subaltern women’s labor in the Bombay Presidency across domestic, fishing, carrying, artisan, and industrial spheres.'
  );

  // Update URL search parameters whenever filters change
  const handleFilterChange = (newFilters) => {
    const params = serializeFiltersToParams(newFilters);
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const handleCloseModal = () => {
    // Navigate back to /exhibit while preserving current search query params
    navigate({
      pathname: '/exhibit',
      search: location.search,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Exhibit Header */}
      <div className="border-b border-ash/30 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-dye/15 text-indigo-dye font-mono text-xs uppercase font-bold tracking-wider">
          Digital Humanities Archival Corpus &bull; 1300–1947
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight">
          Archival Exhibit Gallery
        </h1>
        <p className="font-serif text-ash text-xl max-w-[68ch] leading-relaxed italic">
          Ground-truth visual records of subaltern women&rsquo;s labor in the Bombay Presidency.
          Filter across historical eras, labor classifications, and material culture elements.
        </p>
      </div>

      {/* FilterBar Console */}
      <FilterBar
        vocab={vocab}
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Result Count with aria-live="polite" */}
      <div
        aria-live="polite"
        className="flex items-center justify-between text-xs font-mono text-ash bg-[#ECE4D4] px-4 py-3 rounded-lg border border-ash/30"
      >
        <span>
          Showing <strong className="text-ink text-sm">{filteredItems.length}</strong> of{' '}
          <strong className="text-ink text-sm">{items.length}</strong> archetypes in archive
        </span>
        {filteredItems.length > 0 && (
          <span className="hidden sm:inline italic font-serif text-ash/90">
            Click any record to launch the deep-dive inspector
          </span>
        )}
      </div>

      {/* Archetypes Responsive Grid */}
      <GalleryGrid items={filteredItems} onResetFilters={handleResetFilters} />

      {/* Deep-link Item Modal */}
      {id && activeItem && (
        <ItemModal
          item={activeItem}
          filteredItems={filteredItems}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
