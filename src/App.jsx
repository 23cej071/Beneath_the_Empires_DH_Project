import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Code-splitting routes with React.lazy
const Home = lazy(() => import('./pages/Home'));
const Exhibit = lazy(() => import('./pages/Exhibit'));
const Audit = lazy(() => import('./pages/Audit'));
const Methodology = lazy(() => import('./pages/Methodology'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-3"
    >
      <div className="w-8 h-8 rounded-full border-2 border-indigo-dye border-t-transparent animate-spin"></div>
      <span className="font-mono text-xs text-ash uppercase tracking-wider">
        Loading Archival Record...
      </span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/exhibit"
            element={
              <Suspense fallback={<PageLoader />}>
                <Exhibit />
              </Suspense>
            }
          />
          <Route
            path="/exhibit/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <Exhibit />
              </Suspense>
            }
          />
          <Route
            path="/audit"
            element={
              <Suspense fallback={<PageLoader />}>
                <Audit />
              </Suspense>
            }
          />
          <Route
            path="/methodology"
            element={
              <Suspense fallback={<PageLoader />}>
                <Methodology />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
