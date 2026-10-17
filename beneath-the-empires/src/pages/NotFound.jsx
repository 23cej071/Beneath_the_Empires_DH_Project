import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page Not Found', 'The requested record or route does not exist in the Bombay Presidency archive index.');

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-block px-3 py-1 rounded bg-madder/15 text-madder font-mono text-xs uppercase font-bold tracking-wider">
        404 &bull; Archival Record Not Found
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink">
        Page Not Found
      </h1>
      <p className="text-ash text-base max-w-[68ch] mx-auto leading-relaxed font-serif">
        The requested record or exhibit route does not exist in the Bombay Presidency archive index.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-6 py-3 rounded bg-indigo-dye hover:bg-ink text-parchment font-semibold transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2"
        >
          Return to Archive Home
        </Link>
      </div>
    </div>
  );
}
