import { useMemo, useEffect } from 'react';
import archivesData from '../data/archives.json';
import { validateArchives } from '../utils/filters';

export function useArchives() {
  useEffect(() => {
    // Validate schema compliance on mount
    validateArchives(archivesData);
    // Explicitly log items as required by acceptance criteria
    console.log('[useArchives] Loaded archival archetype items:', archivesData.items);
  }, []);

  const items = useMemo(() => archivesData.items || [], []);
  const vocab = useMemo(() => archivesData.vocab || {}, []);

  const getById = useMemo(() => {
    const itemMap = new Map((archivesData.items || []).map((item) => [item.id, item]));
    return (id) => itemMap.get(id) || null;
  }, []);

  return {
    items,
    vocab,
    getById,
    project: archivesData.project,
    schemaVersion: archivesData.schemaVersion,
  };
}

export default useArchives;
