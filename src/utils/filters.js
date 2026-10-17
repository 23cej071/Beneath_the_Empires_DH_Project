/**
 * Validator for archive items according to project schema:
 * Logs a console warning if any item is missing id, dc.title, image.url or pins.
 */
export function validateArchiveItem(item, index = 0) {
  const missing = [];
  if (!item?.id) missing.push('id');
  if (!item?.dc?.title) missing.push('dc.title');
  if (!item?.image?.url) missing.push('image.url');
  if (!item?.pins || !Array.isArray(item.pins)) missing.push('pins');

  if (missing.length > 0) {
    console.warn(
      `[Archive Validator] Item at index ${index} (${item?.id ? `id: "${item.id}"` : 'missing id'}) is missing required fields: ${missing.join(', ')}`,
      item
    );
    return false;
  }
  return true;
}

export function validateArchives(data) {
  if (!data || !Array.isArray(data.items)) {
    console.warn('[Archive Validator] Data is missing or "items" is not an array:', data);
    return false;
  }
  let valid = true;
  data.items.forEach((item, idx) => {
    if (!validateArchiveItem(item, idx)) {
      valid = false;
    }
  });
  return valid;
}

/**
 * Filter items with:
 * - AND across groups (Era, Labor Type, Material Element)
 * - OR within a group (e.g. any selected labor type or material element matches)
 *
 * @param {Array} items
 * @param {Object} filters - { era: 'All'|string, labor: string[], material: string[] }
 */
export function filterArchiveItems(items = [], filters = {}) {
  const { era = 'All', labor = [], material = [] } = filters;

  return items.filter((item) => {
    // 1. Era filter (single-select: 'All' or specific era)
    if (era && era !== 'All' && item.era !== era) {
      return false;
    }

    // 2. Labor Type filter (multi-select, OR within group)
    if (labor && labor.length > 0) {
      if (!labor.includes(item.laborType)) {
        return false;
      }
    }

    // 3. Material Element filter (multi-select, OR within group)
    if (material && material.length > 0) {
      const itemMaterials = item.materialElements || [];
      const hasAnySelected = material.some((m) => itemMaterials.includes(m));
      if (!hasAnySelected) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Parse URL search params into active filter state
 */
export function parseFiltersFromParams(searchParams) {
  const era = searchParams.get('era') || 'All';
  const laborParam = searchParams.get('labor');
  const materialParam = searchParams.get('material');

  const labor = laborParam ? laborParam.split(',').filter(Boolean) : [];
  const material = materialParam ? materialParam.split(',').filter(Boolean) : [];

  return { era, labor, material };
}

/**
 * Serialize active filter state into URL search params object
 */
export function serializeFiltersToParams(filters) {
  const params = {};
  if (filters.era && filters.era !== 'All') {
    params.era = filters.era;
  }
  if (filters.labor && filters.labor.length > 0) {
    params.labor = filters.labor.join(',');
  }
  if (filters.material && filters.material.length > 0) {
    params.material = filters.material.join(',');
  }
  return params;
}
