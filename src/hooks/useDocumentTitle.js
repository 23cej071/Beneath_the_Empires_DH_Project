import { useEffect } from 'react';

/**
 * useDocumentTitle - Hook to dynamically set document title and meta description.
 *
 * @param {string} title - Page title suffix (e.g. "Exhibit Gallery")
 * @param {string} [description] - Optional meta description
 */
export function useDocumentTitle(title, description = '') {
  useEffect(() => {
    const baseTitle = 'Beneath the Empires';
    document.title = title ? `${title} | ${baseTitle}` : `${baseTitle} — Working-Class Women of the Bombay Presidency (1300–1947)`;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
}

export default useDocumentTitle;
