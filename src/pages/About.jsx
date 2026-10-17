import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function About() {
  useDocumentTitle(
    'About & Ethics',
    'Project credits, licensing, Dublin Core extended schema, and guidelines for submitting community and descendant corrections.'
  );

  const schemaFields = [
    { dc: 'dc:title', type: 'string', desc: 'Descriptive title of the archetype or object' },
    { dc: 'dc:creator', type: 'string', desc: 'Photographer or collector; "Unknown" if not recorded' },
    { dc: 'dc:date', type: 'string (ISO/circa)', desc: 'Date or circa range of the original photograph' },
    { dc: 'dc:subject', type: 'string[]', desc: 'Controlled keywords (labor type, garment, region)' },
    { dc: 'dcterms:spatial', type: 'string', desc: 'Place depicted or photographed' },
    { dc: 'dc:format', type: 'string', desc: 'Medium and digital format (e.g. albumen print, JPEG)' },
    { dc: 'dc:rights', type: 'string', desc: 'Licence or public-domain statement, with source URL' },
    { dc: 'dc:description', type: 'string', desc: 'Historical analysis written by the project' },
    { dc: 'dc:source', type: 'object', desc: 'Repository, Commons filename, URL' },
    { dc: 'bte:ergonomicFunction', type: 'string', desc: 'How garment/posture/ornament served the body at work' },
    { dc: 'bte:aiCritiqueNotes', type: 'string[]', desc: 'Documented errors in the paired AI generation' },
    { dc: 'bte:critiquePins', type: 'object[]', desc: 'Hotspot annotations with percent coordinates (0–100)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-ash/30 pb-6 space-y-2">
        <span className="text-[11px] uppercase font-mono tracking-widest text-indigo-dye font-bold">
          Digital Humanities &bull; Project Dossier &amp; Schema
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight">
          About &amp; Archival Ethics
        </h1>
        <p className="font-serif italic text-ash text-xl leading-relaxed max-w-[68ch]">
          Project scope, extended Dublin Core schema, scholarly literature, and the ethics of subaltern representation.
        </p>
      </div>

      {/* Project Vision */}
      <section className="space-y-4 max-w-[68ch] text-[18px] leading-[1.7] font-serif text-ink">
        <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">Project Vision</h2>
        <p>
          <strong>Beneath the Empires</strong> is an open-access Digital Humanities archive and AI audit suite dedicated to the labor, material culture, and bodily autonomy of working-class women in the Bombay Presidency across the period 1300–1947.
        </p>
        <p>
          By triangulating colonial photography, oral poetry (Ovi), and caste-coded bodily technologies against generative algorithmic hallucinations, the project exposes how generative models reproduce historic patriarchal and colonial erasures.
        </p>
      </section>

      {/* Dublin Core Extended Schema */}
      <section className="space-y-4 bg-[#EFE8DA] p-6 sm:p-8 rounded-xl border border-ash/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ash/20 pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">Dublin Core Extended Schema</h2>
            <p className="text-xs text-ash font-sans mt-0.5">
              15 Dublin Core Metadata Element Set terms + local bte: project namespace extensions.
            </p>
          </div>
          <span className="text-[11px] font-mono text-ash bg-ash/20 px-2.5 py-1 rounded">
            DCMES + bte:1.0
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-ash/30 text-ink font-mono uppercase tracking-wider text-[11px] bg-[#E4DBCB]">
                <th className="py-2.5 px-3">Metadata Property</th>
                <th className="py-2.5 px-3">Data Type</th>
                <th className="py-2.5 px-3">Definition &amp; Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash/20">
              {schemaFields.map((field, idx) => (
                <tr key={idx} className="hover:bg-parchment/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-dye">{field.dc}</td>
                  <td className="py-2.5 px-3 font-mono text-ash">{field.type}</td>
                  <td className="py-2.5 px-3 text-ink/90 font-serif leading-relaxed">{field.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Secondary Literature & Citations */}
      <section className="space-y-4 max-w-[68ch]">
        <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
          Secondary Literature &amp; Foundational Texts
        </h2>
        <ul className="space-y-3 text-sm text-ink/90 font-serif list-disc list-inside bg-[#EFE8DA] p-6 rounded-xl border border-ash/30">
          <li>
            <strong>Rege, Sharmila (2006).</strong> <em>Writing Caste, Writing Gender: Reading Dalit Women’s Testimonios.</em> Zubaan Books, New Delhi.
          </li>
          <li>
            <strong>Adarkar, Neera, and Meena Menon (2004).</strong> <em>One Hundred Years, One Hundred Voices: The Millworkers of Girangaon, an Oral History.</em> Seagull Books.
          </li>
          <li>
            <strong>Poitevin, Guy, and Hema Rairkar (1996).</strong> <em>Grindmill Songs Project / Centre for Cooperative Research in Social Sciences (CCRSS).</em> Digitized by the People’s Archive of Rural India (PARI).
          </li>
          <li>
            <strong>Gopal, Meena (2012).</strong> &ldquo;Caste, Sexuality and Labour: The Historical Trajectory of Working Class Women in Bombay.&rdquo; <em>Economic and Political Weekly</em>, Vol. 47, No. 4.
          </li>
          <li>
            <strong>Spivak, Gayatri Chakravorty (1988).</strong> &ldquo;Can the Subaltern Speak?&rdquo; in <em>Marxism and the Interpretation of Culture</em>, eds. Cary Nelson and Lawrence Grossberg.
          </li>
        </ul>
      </section>

      {/* Community & Descendant Corrections Invitation */}
      <section className="space-y-4 max-w-[68ch] bg-parchment p-6 rounded-xl border-2 border-indigo-dye/30 shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-indigo-dye tracking-tight">
          Community &amp; Descendant Corrections
        </h2>
        <p className="text-[17px] leading-[1.7] font-serif text-ink">
          Because colonial photographers recorded subjects without consent or biographical attribution, this archive maintains a standing invitation for community, family, and descendant corrections.
        </p>
        <p className="text-sm font-sans text-ash leading-relaxed">
          If you have oral histories, kinship memories, regional textile corrections, or linguistic clarifications regarding any of the photographed subjects or Ovi verses in this archive, please submit a correction via our GitHub issue tracker or contact the research team directly.
        </p>
        <div className="pt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-indigo-dye text-parchment text-xs font-semibold uppercase tracking-wider hover:bg-ink transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2"
          >
            Submit Archival Correction
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>
    </div>
  );
}
