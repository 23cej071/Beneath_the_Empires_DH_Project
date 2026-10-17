import React from 'react';
import useArchives from '../hooks/useArchives';
import useDocumentTitle from '../hooks/useDocumentTitle';
import SideBySideAudit from '../components/SideBySideAudit';

export default function Audit() {
  useDocumentTitle(
    'Critical AI Audit Suite',
    'Systematic evaluation checklist and side-by-side audit of generative AI hallucinations against colonial-era visual records.'
  );

  const { items } = useArchives();

  const auditMatrix = [
    {
      archetype: 'Domestic Grain Miller (1871)',
      fabric: 'Hallucinated as dyed, hemmed silk instead of coarse unhemmed cotton',
      jewelry: 'Added fine jewelry inconsistent with pre-dawn stone grinding',
      posture: 'Face-to-camera smile erasing rotational pelvic torque',
      tool: 'Chakki rendered as decorative prop with flawed mechanics',
    },
    {
      archetype: 'Koli Fisherwoman (1860s)',
      fabric: 'Drape lengthened to ankle, erasing split-leg surf mobility',
      jewelry: 'Exaggerated gold nose-ring; staged exotic glamour pose',
      posture: 'Dance-like posture replacing grounded barefoot sand grip',
      tool: 'Cane tokri fish basket replaced with decorative brass vessel',
    },
    {
      archetype: 'Urban Water Carrier (1873)',
      fabric: 'Eliminated functional cloth head-ring',
      jewelry: 'Added ornamental jewelry contrary to wage-labor reality',
      posture: 'Implausible cervical spinal alignment; vessel floating',
      tool: 'Chumbal cloth pad omitted; utilitarian handa made ornate',
    },
    {
      archetype: 'Dhed Dalit Artisan (1850s)',
      fabric: 'Replaced coarse handspun cloth with fine embroidery',
      jewelry: 'Gold and gems substituted for cast pewter armlets',
      posture: 'Subsumed sumptuary marker into generic royal Indian trope',
      tool: 'Handloom weaving context completely erased',
    },
    {
      archetype: 'Textile Mill Worker (1940s)',
      fabric: 'Loose flowing pallu: severe industrial snag/amputation hazard',
      jewelry: 'Sanitized attire omitting machine grease and cotton dust',
      posture: 'Romanticized "happy wartime worker" propaganda pose',
      tool: 'Anachronistic spindles; no factory lint or noise depicted',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-ash/30 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-madder/15 text-madder font-mono text-xs uppercase font-bold tracking-wider">
          Diagnostic Method &bull; Algorithmic Bias Checklist
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight">
          Critical AI Audit Suite
        </h1>
        <p className="font-serif italic text-ash text-xl max-w-[68ch] leading-relaxed">
          Systematic interrogation of text-to-image hallucinations across 5 working-class archetypes in the Bombay Presidency.
        </p>
      </div>

      {/* Audit Checklist Summary Table */}
      <section className="bg-[#EFE8DA] rounded-xl border border-ash/30 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ash/20 pb-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Systemic Hallucination Checklist Matrix
            </h2>
            <p className="text-xs text-ash font-sans mt-0.5">
              Comparative diagnostic of documented generative biases across four material categories.
            </p>
          </div>
          <span className="text-[11px] font-mono text-madder font-semibold uppercase bg-madder/10 px-2.5 py-1 rounded">
            5 Archetypes Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-ash/30 text-ink font-mono uppercase tracking-wider text-[11px] bg-[#E5DDCB]">
                <th className="py-3 px-3">Archetype</th>
                <th className="py-3 px-3">Fabric &amp; Draping</th>
                <th className="py-3 px-3">Jewelry &amp; Sumptuary</th>
                <th className="py-3 px-3">Biomechanics &amp; Posture</th>
                <th className="py-3 px-3">Tool Mechanics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ash/20 text-ink/90">
              {auditMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-parchment/60 transition-colors">
                  <td className="py-3 px-3 font-serif font-bold text-ink whitespace-nowrap">
                    {row.archetype}
                  </td>
                  <td className="py-3 px-3 max-w-[200px] leading-relaxed">
                    <span className="text-madder font-bold mr-1">&times;</span>
                    {row.fabric}
                  </td>
                  <td className="py-3 px-3 max-w-[200px] leading-relaxed">
                    <span className="text-madder font-bold mr-1">&times;</span>
                    {row.jewelry}
                  </td>
                  <td className="py-3 px-3 max-w-[200px] leading-relaxed">
                    <span className="text-madder font-bold mr-1">&times;</span>
                    {row.posture}
                  </td>
                  <td className="py-3 px-3 max-w-[200px] leading-relaxed">
                    <span className="text-madder font-bold mr-1">&times;</span>
                    {row.tool}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Archetype Case Studies */}
      <section className="space-y-16">
        <div className="border-b border-ash/30 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Individual Archetype Case Studies
          </h2>
        </div>

        {items.map((item, index) => (
          <article
            key={item.id}
            className="bg-[#EFE8DA] rounded-xl border border-ash/30 p-6 sm:p-8 shadow-sm space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ash/20 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-turmeric text-ink">
                    Archetype 0{index + 1}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-ink text-parchment font-medium">
                    {item.era}
                  </span>
                  <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded bg-ash/20 text-ink">
                    {item.laborType}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  {item.dc.title}
                </h3>
                <div className="text-xs text-ash">
                  <span>Collector: {item.dc.creator}</span> &bull; <span>{item.dc.spatial}</span> &bull;{' '}
                  <span className="font-mono">{item.dc.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-ash uppercase block">Dublin Core ID</span>
                <code className="text-xs font-mono font-semibold text-ink">{item.id}</code>
              </div>
            </div>

            {/* Interactive AI Audit & Prompt Inspection */}
            <SideBySideAudit item={item} initialMode="side-by-side" />
          </article>
        ))}
      </section>
    </div>
  );
}
