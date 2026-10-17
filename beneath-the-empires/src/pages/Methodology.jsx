import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Methodology() {
  useDocumentTitle(
    'Methodology',
    'Curatorial and Subaltern Studies methodology statement for Beneath the Empires: reading colonial records against the grain.'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-ash/30 pb-6 space-y-2">
        <span className="text-[11px] uppercase font-mono tracking-widest text-indigo-dye font-bold">
          Section 1.2 &bull; Curatorial &amp; Subaltern Methodology Statement
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight">
          Curatorial &amp; Subaltern Methodology
        </h1>
        <p className="font-serif italic text-ash text-xl leading-relaxed max-w-[68ch]">
          Reconstructing the labor, material culture, and bodily autonomy of working-class women in the Bombay Presidency (1300–1947).
        </p>
      </div>

      {/* Main Narrative - styled at 18px / 1.7 line height, max 68ch */}
      <article className="space-y-10 text-[18px] leading-[1.7] text-ink font-serif max-w-[68ch]">
        {/* Archival Silence */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
            Archival Silence
          </h2>
          <p>
            Following Gayatri Spivak&rsquo;s question, and the Subaltern Studies tradition of reading &ldquo;against the grain,&rdquo; we begin from the premise that official records (census tables, mill registers, colonial ethnography) were written <em>about</em> these women, not <em>by</em> them. Absence of testimony is a feature of power, not evidence of insignificance.
          </p>
        </section>

        {/* Alternative Evidence Streams */}
        <section className="space-y-4 bg-[#EFE8DA] p-6 sm:p-8 rounded-xl border border-ash/30 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
            Alternative Evidence Streams
          </h2>
          <p className="text-[17px]">
            Because the written record is thin, the project triangulates three evidence types:
          </p>

          <ul className="space-y-4 pt-2 text-[17px] font-sans list-none">
            <li className="border-l-3 border-indigo-dye pl-4 space-y-1">
              <strong className="font-serif text-lg text-ink block font-bold">
                &bull; Oral and musical sources (Ovi grindmill songs).
              </strong>
              <p className="text-ink/90 leading-relaxed font-serif">
                Composed and transmitted by women during daily grinding, Ovis are among the few first-person records of emotion, kinship, critique and economic reality in women&rsquo;s own voices. Their meter is tied to the rhythm of the stone, so they also document the physical act of labor.
              </p>
            </li>

            <li className="border-l-3 border-turmeric pl-4 space-y-1">
              <strong className="font-serif text-lg text-ink block font-bold">
                &bull; Bodily marks and ornament (godna tattoos, cast metal jewelry).
              </strong>
              <p className="text-ink/90 leading-relaxed font-serif">
                Tattoos encoded caste, region and marital status and were widely understood as protection that stayed with the body when property could not. Pewter, bell-metal and silver ornaments were portable savings, pawnable in hardship, and were sometimes limited by caste sumptuary custom.
              </p>
            </li>

            <li className="border-l-3 border-madder pl-4 space-y-1">
              <strong className="font-serif text-lg text-ink block font-bold">
                &bull; Labor and material logs.
              </strong>
              <p className="text-ink/90 leading-relaxed font-serif">
                Mill registers, wage tables, rationing records and trade reports are read for the women they undercount, the departments they were confined to, and the adjustments (tucked pallus, shortened drapes) visible in photographs.
              </p>
            </li>
          </ul>
        </section>

        {/* Photographs as Contested Evidence */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
            Photographs as Contested Evidence
          </h2>
          <p>
            Colonial photographs are treated as staged and extractive but still informative about posture, fabric, tools and ornament. Each is annotated with its collector, date, and probable framing intent.
          </p>
        </section>

        {/* Generative AI as a Second Archive of Bias */}
        <section className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
            Generative AI as a Second Archive of Bias
          </h2>
          <p>
            Rather than avoiding AI imagery, the project audits it under controlled prompts, treating its hallucinations as data about dominant visual cultures. All AI images are clearly labeled, never presented as historical, and always paired with the archival original.
          </p>
        </section>

        {/* Ethical Commitments */}
        <section className="space-y-3 pt-6 border-t border-ash/30">
          <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
            Ethical Commitments
          </h2>
          <p>
            Dignity and agency over exoticism; no identification claims about individuals in photographs; caste terms used in their historical context with scholarly framing; open licensing; and a standing invitation for community and descendant correction.
          </p>
        </section>
      </article>
    </div>
  );
}
