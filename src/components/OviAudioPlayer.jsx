import React, { useState, useRef, useEffect } from 'react';
import defaultCues from '../data/ovi-cues.json';

/**
 * Format seconds into m:ss format.
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * OviAudioPlayer - Native audio player synchronized with bilingual Ovi transcript cues.
 *
 * Props:
 * @param {string} src - Audio URL path
 * @param {string} [title="Ovi Grindmill Song"] - Title of the recording/archetype
 * @param {Array} [cues] - Array of { start, end, mr, en } cue timestamps in seconds
 */
export default function OviAudioPlayer({
  src,
  title = 'Ovi Grindmill Song',
  cues = defaultCues,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [bilingualMode, setBilingualMode] = useState('both'); // 'both' | 'mr' | 'en'
  const [hasLoadError, setHasLoadError] = useState(false);

  // Render-time state reset on audio src change (React 18+ best practice)
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setIsPlaying(false);
    setCurrentTime(0);
    setHasLoadError(false);
  }

  const audioRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const cueElementsRef = useRef({});
  const lastUserScrollTimeRef = useRef(0);
  const isAutoScrollingRef = useRef(false);

  const effectiveCues = cues && cues.length > 0 ? cues : defaultCues;

  // Active cue search (binary or find)
  const activeCueIndex = effectiveCues.findIndex(
    (c) => currentTime >= c.start && currentTime < c.end
  );

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sync playback speed to native audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Synchronized auto-scroll to active cue
  useEffect(() => {
    if (activeCueIndex === -1) return;
    const activeEl = cueElementsRef.current[activeCueIndex];
    if (!activeEl) return;

    const timeSinceUserScroll = Date.now() - lastUserScrollTimeRef.current;
    // Don't auto-scroll if the user manually scrolled within the last 3 seconds
    if (timeSinceUserScroll > 3000) {
      isAutoScrollingRef.current = true;
      activeEl.scrollIntoView({
        block: 'center',
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      const timer = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeCueIndex, prefersReducedMotion]);

  const handleTranscriptScroll = () => {
    if (!isAutoScrollingRef.current) {
      lastUserScrollTimeRef.current = Date.now();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('[OviAudioPlayer] Playback was prevented or file failed:', err);
          setHasLoadError(true);
        });
    }
  };

  const handleSeek = (e) => {
    const nextTime = Number(e.target.value);
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleCueClick = (cue) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = cue.start;
    setCurrentTime(cue.start);
    if (!isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const speeds = [0.75, 1, 1.25];

  return (
    <div className="w-full bg-[#EFE8DA] rounded-xl border border-ash/30 p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Native HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 30);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => setHasLoadError(true)}
        preload="metadata"
      />

      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ash/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-turmeric animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-madder">
              Bilingual Ovi Player
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-ink">{title}</h3>
        </div>

        {/* Bilingual View Selector */}
        <div className="flex items-center gap-1 bg-parchment rounded-lg p-1 border border-ash/30 text-xs">
          <span className="text-[10px] font-mono text-ash uppercase px-2 font-semibold">View:</span>
          <button
            type="button"
            onClick={() => setBilingualMode('both')}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              bilingualMode === 'both' ? 'bg-ink text-parchment font-semibold shadow-sm' : 'text-ash hover:text-ink'
            }`}
          >
            Both
          </button>
          <button
            type="button"
            onClick={() => setBilingualMode('mr')}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              bilingualMode === 'mr' ? 'bg-ink text-parchment font-semibold shadow-sm' : 'text-ash hover:text-ink'
            }`}
          >
            मराठी
          </button>
          <button
            type="button"
            onClick={() => setBilingualMode('en')}
            className={`px-2.5 py-1 rounded transition-colors font-medium ${
              bilingualMode === 'en' ? 'bg-ink text-parchment font-semibold shadow-sm' : 'text-ash hover:text-ink'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Audio Error Notice */}
      {hasLoadError && (
        <div className="p-3 bg-madder/10 border border-madder/30 rounded-lg text-xs text-madder flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            Audio file unavailable or placeholder active. The bilingual transcript remains fully accessible below.
          </span>
        </div>
      )}

      {/* Primary Player Controls */}
      <div className="space-y-3 bg-[#E5DDCB] p-4 rounded-lg border border-ash/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-ink text-parchment hover:bg-madder flex items-center justify-center shadow transition-colors focus:outline-none focus:ring-4 focus:ring-madder/40"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Timers */}
            <div className="font-mono text-xs text-ink">
              <span className="font-bold">{formatTime(currentTime)}</span>
              <span className="text-ash mx-1">/</span>
              <span className="text-ash">{formatTime(duration || 30)}</span>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <span className="text-[10px] font-mono text-ash uppercase font-semibold">Speed:</span>
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                aria-label={`Set speed to ${s}x`}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  playbackSpeed === s
                    ? 'bg-ink text-parchment font-bold'
                    : 'bg-parchment/60 text-ash hover:text-ink'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Seekable Range Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={duration || 30}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek time position in recording"
            className="w-full h-2 bg-ash/30 rounded-lg appearance-none cursor-pointer accent-madder focus:outline-none focus:ring-2 focus:ring-madder"
          />
        </div>
      </div>

      {/* Transcript Panel (Scrollable, Synced Cues) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-ash">
          <span className="font-serif font-semibold text-ink uppercase tracking-wider">
            Synchronized Transcript ({effectiveCues.length} Cues)
          </span>
          <span className="italic">Click any cue to seek audio</span>
        </div>

        <div
          ref={transcriptContainerRef}
          onScroll={handleTranscriptScroll}
          className="max-h-64 overflow-y-auto rounded-lg border border-ash/30 bg-parchment/80 p-2 space-y-2 divide-y divide-ash/15"
          tabIndex={0}
          aria-label="Scrollable transcript of Ovi song"
        >
          {effectiveCues.map((cue, idx) => {
            const isActive = idx === activeCueIndex;

            return (
              <div
                key={idx}
                ref={(el) => (cueElementsRef.current[idx] = el)}
                onClick={() => handleCueClick(cue)}
                aria-current={isActive ? 'true' : undefined}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCueClick(cue);
                  }
                }}
                className={`p-3 rounded-lg transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-madder ${
                  isActive
                    ? 'bg-[#E5DAC6] border-l-4 border-madder shadow-sm font-medium'
                    : 'hover:bg-ash/10 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-ash mb-1">
                  <span className="font-bold text-ink">
                    Cue 0{idx + 1} &bull; {formatTime(cue.start)} - {formatTime(cue.end)}
                  </span>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold text-madder px-1.5 py-0.2 rounded bg-madder/15">
                      Singing Now
                    </span>
                  )}
                </div>

                {/* Marathi Text with Noto Sans Devanagari */}
                {(bilingualMode === 'both' || bilingualMode === 'mr') && (
                  <div
                    lang="mr"
                    className="font-devanagari text-base sm:text-lg text-ink font-semibold tracking-wide leading-relaxed"
                  >
                    {cue.mr}
                  </div>
                )}

                {/* English Translation */}
                {(bilingualMode === 'both' || bilingualMode === 'en') && (
                  <div
                    lang="en"
                    className={`font-sans text-xs text-ink/80 leading-relaxed ${
                      bilingualMode === 'both' ? 'mt-1 pt-1 border-t border-ash/15 italic' : ''
                    }`}
                  >
                    {cue.en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Scholarly Integrity Notice */}
      <div className="p-3 bg-ash/15 rounded-lg border border-ash/25 text-xs text-ash leading-relaxed">
        <strong className="text-ink">Archival Notice:</strong> Placeholder transcript. Replace with licensed Ovi
        recordings and transcriptions (e.g. the Grindmill Songs Project on PARI) with credit to singers and collectors.
      </div>
    </div>
  );
}
