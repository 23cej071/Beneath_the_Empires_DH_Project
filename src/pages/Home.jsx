import React from 'react';
import { Link } from 'react-router-dom';
import useArchives from '../hooks/useArchives';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle(
    'Home',
    'Beneath the Empires: Reconstructing the labor, material culture, and bodily autonomy of working-class women in the Bombay Presidency (1300–1947).'
  );

  const { items } = useArchives();

  const pillars = [
    {
      title: 'Garment as Technology',
      subtitle: 'Ergonomics & Movement',
      tag: 'Biomechanics',
      description:
        'Clothing functioned not as ornament, but as ergonomic technology: Nauvari split-drapes, knee-high kashta tucks for surf and fields, front-tied cholis, and twisted chumbal head-pads distributing heavy water loads down the spinal column.',
      accent: 'border-madder/40 hover:border-madder bg-madder/5',
      badgeColor: 'bg-madder/15 text-madder',
    },
    {
      title: 'Bodily Armor & Mobile Banking',
      subtitle: 'Pawnable Wealth & Tattoos',
      tag: 'Caste & Economy',
      description:
        'When sumptuary customs forbade gold, cast bell-metal and pewter ornaments served as portable family wealth pawnable in distress. Indelible godna tattoos marked caste lineage and bodily sovereignty that no creditor or state could seize.',
      accent: 'border-turmeric/50 hover:border-turmeric bg-turmeric/5',
      badgeColor: 'bg-turmeric/20 text-ink',
    },
    {
      title: 'Wartime & Industrial Home Front',
      subtitle: 'Bombay Mills & Girangaon',
      tag: 'Industrial Labor',
      description:
        'In the winding departments of Bombay textile mills during WWII, operatives tightly tucked their pallus to avoid high-speed machine amputation while enduring rationing, inflation, and grueling shift quotas.',
      accent: 'border-indigo-dye/40 hover:border-indigo-dye bg-indigo-dye/5',
      badgeColor: 'bg-indigo-dye/15 text-indigo-dye',
    },
    {
      title: 'Critical AI Audit',
      subtitle: 'Interrogating Algorithmic Erasure',
      tag: 'AI Diagnostic',
      description:
        'Text-to-image generative models routinely replace unhemmed cotton with opulent silk, swap base metals for gold, and erase signs of manual labor. Our audit suite treats these hallucinations as diagnostic data on modern visual bias.',
      accent: 'border-ink/40 hover:border-ink bg-ink/5',
      badgeColor: 'bg-ink/15 text-ink',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111A1E] via-[#162226] to-[#0D1518] text-parchment py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-ash/30 shadow-2xl">
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-turmeric/15 border border-turmeric/40 text-turmeric">
            <span className="w-1.5 h-1.5 rounded-full bg-turmeric animate-pulse" aria-hidden="true"></span>
            Digital Humanities &bull; Algorithmic Bias Audit Suite
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-parchment leading-[1.1]">
            Beneath the Empires
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-parchment/90 max-w-3xl mx-auto font-light leading-relaxed">
            Reconstructing the Labor, Material Culture, and Bodily Autonomy of Working-Class Women in the Bombay Presidency (1300–1947)
          </p>

          <p className="text-[18px] leading-[1.7] text-parchment/80 max-w-[68ch] mx-auto font-serif">
            Histories of Western India&rsquo;s dress and labor are dominated by elite, upper-caste, and colonial-administrative records that staged &ldquo;types&rdquo; and reduced subaltern women to decorative specimens.
            Beneath the Empires interrogates this silence by reading working women&rsquo;s clothing, bodily marks, and oral poetry as technologies of survival, auditing generative AI&rsquo;s algorithmic erasures against ground-truth material history.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/exhibit"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-8 py-3.5 rounded bg-indigo-dye hover:bg-ink text-parchment font-medium tracking-wide text-base shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-turmeric focus:ring-offset-2 focus:ring-offset-[#111A1E]"
            >
              Explore Archival Exhibit
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              to="/audit"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-3.5 rounded border border-parchment/40 hover:border-turmeric text-parchment/95 hover:text-turmeric text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-turmeric focus:ring-offset-2 focus:ring-offset-[#111A1E]"
            >
              Examine AI Audit Suite
            </Link>
          </div>

          {/* Quick archetype pill strip */}
          <div className="pt-6 border-t border-parchment/15 flex flex-wrap items-center justify-center gap-2 text-xs text-parchment/70 font-sans">
            <span className="font-semibold text-parchment/90 uppercase tracking-wider mr-2 font-mono text-[11px]">
              Ground-truth Archetypes:
            </span>
            {items.map((it) => (
              <Link
                key={it.id}
                to={`/exhibit/${it.id}`}
                className="px-2.5 py-1 rounded bg-parchment/10 hover:bg-turmeric/20 hover:text-turmeric transition-colors focus:outline-none focus:ring-2 focus:ring-turmeric"
              >
                {it.dc.title} ({it.era})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Four Thematic Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[68ch] mx-auto mb-12 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-madder block">
            Theoretical Scaffolds
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            Four Pillars of Subaltern Materiality
          </h2>
          <div className="w-20 h-1 bg-turmeric mx-auto mt-2" aria-hidden="true"></div>
          <p className="text-ash text-[18px] leading-[1.7] font-serif pt-2">
            Interrogating the intersection of colonial extractive records, sumptuary restrictions,
            ergonomic labor technologies, and modern algorithmic bias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <article
              key={idx}
              className={`flex flex-col justify-between p-6 rounded-xl border bg-parchment/60 backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${pillar.accent}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${pillar.badgeColor}`}>
                    {pillar.tag}
                  </span>
                  <span className="font-serif text-ash/50 font-bold text-xl">0{idx + 1}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-1">{pillar.title}</h3>
                <div className="text-xs text-ash font-medium mb-3 italic">{pillar.subtitle}</div>
                <p className="text-sm text-ink/90 leading-relaxed font-serif">{pillar.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-ash/20">
                <Link
                  to="/exhibit"
                  className="min-h-[44px] text-xs font-semibold uppercase tracking-wider text-indigo-dye hover:text-ink inline-flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-indigo-dye rounded"
                >
                  <span>View archival instances</span>
                  <span className="transform group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Archetypes Preview Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-ash/30 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-indigo-dye block">
              Archival Evidence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">
              Archetypes in the Collection
            </h2>
          </div>
          <Link
            to="/exhibit"
            className="min-h-[44px] text-sm font-semibold text-indigo-dye hover:text-ink inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-dye rounded"
          >
            <span>Open Full Exhibit Gallery</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/exhibit/${item.id}`}
              className="group block bg-[#ECE4D4] rounded-xl overflow-hidden border border-ash/30 hover:border-indigo-dye hover:shadow-md transition-all duration-200 flex flex-col focus:outline-none focus:ring-2 focus:ring-indigo-dye"
            >
              <div className="aspect-[4/3] bg-ink/10 overflow-hidden relative border-b border-ash/20">
                <img
                  src={item.image.url}
                  alt={item.image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-ink/90 text-parchment text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                  {item.era}
                </span>
                <span className="absolute bottom-2 right-2 bg-turmeric text-ink text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                  {item.laborType}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-sm font-bold text-ink group-hover:text-indigo-dye transition-colors line-clamp-1">
                    {item.dc.title}
                  </h3>
                  <p className="text-xs text-ash mt-1 line-clamp-2 font-serif">{item.dc.description}</p>
                </div>
                <div className="pt-2 border-t border-ash/20 text-[11px] text-indigo-dye font-semibold flex items-center justify-between font-mono">
                  <span>Inspect Record</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
