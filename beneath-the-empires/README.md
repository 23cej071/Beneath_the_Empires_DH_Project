# Beneath the Empires: Working-Class Women of the Bombay Presidency (1300–1947)

> **A Digital Humanities Visual Archive & Critical Generative AI Audit Suite**  
> Reconstructing the Labor, Material Culture, and Bodily Autonomy of Subaltern Women in Western India.

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA%20Compliant-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## Table of Contents
1. [Project Overview & Historiographical Grounding](#project-overview--historiographical-grounding)
2. [Key Architecture & Features](#key-architecture--features)
3. [Repository Layout](#repository-layout)
4. [Local Setup & Development Scripts](#local-setup--development-scripts)
5. [Archival Data Schema (`archives.json`)](#archival-data-schema-archivesjson)
6. [Curatorial Guide: Adding a New Archetype Item](#curatorial-guide-adding-a-new-archetype-item)
7. [AI Audit Guide: Adding Audited Specimens & Pins](#ai-audit-guide-adding-audited-specimens--pins)
8. [Accessibility (WCAG 2.2 AA) Standards](#accessibility-wcag-22-aa-standards)
9. [Production Deployment (Netlify, Vercel, GitHub Pages)](#production-deployment)
10. [Academic Citations, Ethics & Rights](#academic-citations-ethics--rights)

---

## Project Overview & Historiographical Grounding

Histories of dress, domesticity, and labor in colonial Western India have long been dominated by elite Brahminical and British imperial administrative archives. Colonial studio photography (*The People of India*, 1868–1875) systematically staged subaltern women as inert ethnographic "types," stripping them of personal agency, historical context, and labor realities. 

Contemporary text-to-image generative artificial intelligence systems (e.g., Midjourney, Stable Diffusion, DALL-E) inherit and magnify these historical distortions. When prompted for historic working-class Indian women, AI models default to orientalist tropes: spotless silk sarees, heavy gold bridal jewelry, Bollywood postures, and pastoral serenity—algorithmically erasing the physical toll of water portage, handloom weaving, salt-pan fishing, grain milling, and textile spinning.

**Beneath the Empires** counters this double erasure through a dual-track Digital Humanities methodology:
- **Ground-Truth Archival Corpus**: Reconstructing subaltern material technologies (coarse *khadi* / *charkha* cotton, nine-yard *Nauvari* drapes hitched between thighs for mobility, head-cushioning *chumbal* pads, protective *godna* soot tattoos, pewter/silver savings bangles, calloused bare feet).
- **Critical AI Visual Audit Suite**: Directly confronting synthetic representations against verifiable historical artifacts using interactive before/after split sliders, coordinate-pinned anatomical critiques, and systematic bias category matrices.
- **Oral History & Ovi Tradition**: Situating agrarian labor alongside working songs (*grindmill ovis*) transcribed in bilingual Devanagari Marathi (`lang="mr"`) and English translation.

### Academic Theoretical Framework
- **Gayatri Chakravorty Spivak**: *"Can the Subaltern Speak?"* (1988) — Interrogating epistemic violence in colonial and machine-learning representations.
- **Sharmila Rege**: *Writing Caste, Writing Gender: Reading Dalit Women's Testimonies* (2006) — Dalit feminist standpoint epistemology; moving past generic "Indian womanhood."
- **Hema Rairkar & Guy Poitevin**: *Grindmill Songs Project* (Centre for Cooperative Research in Social Sciences, Pune) — Oral folk poetry as bodily testimony and collective consciousness.
- **Neera Adarkar & Meena Gopal**: Historiography of Bombay's *Girangaon* ("City of Mills") and working-class women's industrial labor.

---

## Key Architecture & Features

Built with a zero-dependency front-end philosophy (**pure React 18, React Router v6, Tailwind CSS 3**):

1. **CompareSlider (`src/components/CompareSlider.jsx`)**:
   - Zero-dependency before/after split slider powered by single pointer event capture (`onPointerDown/Move/Up/Cancel` with `setPointerCapture`) and `touch-action: pan-y`.
   - Full keyboard accessibility: Left/Right arrows (1% step), Shift+Arrows (10% jump), Home (0%), End (100%), with `role="slider"` and live `aria-valuenow`.
   - Clear visual differentiation: Archival image has a thin parchment border; AI specimen is enclosed in a 2px madder dashed border with a persistent *"AI-generated, not historical evidence"* badge.
2. **CritiquePins (`src/components/CritiquePins.jsx`)**:
   - Interactive SVG coordinate markers placed directly over generative AI hallucination sites.
   - Minimum 44×44px touch targets (`role="button"`, `aria-expanded`) with pulsing indicators and high-contrast WCAG 2.2 compliant category colors (*Fabric*, *Jewelry*, *Posture*, *Tool*).
   - Boundary-aware popovers that flip orientation near container edges, dismissible via `Escape` or outside pointer tap.
   - Accessible collapsible text list disclosure for screen readers and comprehensive review.
3. **OviAudioPlayer (`src/components/OviAudioPlayer.jsx`)**:
   - Custom native `<audio>` controller with seekable slider, playback speed toggles (0.75×, 1×, 1.25×), and bilingual display switch (*Both / Marathi / English*).
   - Synchronized cue highlighting with smooth auto-scroll to the active verse (auto-disabled for 3 seconds if the user manually scrolls).
   - Full typography support for Devanagari (*Noto Sans Devanagari*) with strict semantic `lang="mr"` tags.
4. **Faceted FilterBar & GalleryGrid**:
   - Responsive multi-facet filtering across Era (Single-select radio buttons), Labor Domain, and Material Culture (Multi-select checkboxes).
   - URL parameter synchronization (`?era=...&labor=...&material=...`) enabling deep bookmarking and sharing.
   - Filter count badges with screen-reader live region (`aria-live="polite"`).
5. **ItemModal (`src/components/ItemModal.jsx`)**:
   - Accessible deep-dive dialog with URL route syncing (`/exhibit/:id`).
   - WAI-ARIA tablist (*Analysis, AI Audit, Metadata, Listen*) with Left/Right arrow tab navigation.
   - Screen-reader focus trap with body-scroll locking and filtered Prev/Next item navigation.

---

## Repository Layout

```
beneath-the-empires/
├── public/
│   ├── ai/                      # AI-generated audit specimens (ai-01.jpg ... ai-05.jpg)
│   ├── audio/                   # Grindmill Ovi audio recordings (grindmill-demo.wav)
│   ├── favicon.svg              # Archival emblem SVG favicon
│   ├── robots.txt               # Search crawler policy
│   ├── _redirects               # Netlify SPA redirect rules
│   └── 404.html                 # GitHub Pages SPA fallback script
├── scripts/
│   ├── check-images.mjs         # Online HTTP verification of Wikimedia Commons image URLs
│   └── generate-demo-audio.mjs  # Synthesis script for grinding-stone rhythmic demonstration audio
├── src/
│   ├── components/
│   │   ├── CompareSlider.jsx    # Interactive split-view pointer/keyboard slider
│   │   ├── CritiquePins.jsx     # Coordinate-mapped visual critique markers & popovers
│   │   ├── FilterBar.jsx        # Multi-facet filter console with mobile disclosure
│   │   ├── GalleryGrid.jsx      # Responsive 3-column card grid with fallback handling
│   │   ├── ItemModal.jsx        # Accessible deep-dive dialog with focus trap & tabs
│   │   ├── Layout.jsx           # Global banner, skip link, responsive nav & CC footer
│   │   ├── OviAudioPlayer.jsx   # Bilingual oral history player with timed cue sync
│   │   └── SideBySideAudit.jsx  # Dual-pane prompt terminal, view toggle & 3-column discrepancy audit
│   ├── data/
│   │   ├── archives.json        # Archival catalog (Dublin Core + bte: extension metadata)
│   │   └── ovi-cues.json        # Timed bilingual lyrics for grindmill songs (Devanagari + EN)
│   ├── hooks/
│   │   ├── useArchives.js       # Data provider & faceted search filter hook
│   │   └── useDocumentTitle.js  # Route-based dynamic <title> and meta description hook
│   ├── pages/
│   │   ├── Home.jsx             # Curatorial landing page & manifesto
│   │   ├── Exhibit.jsx          # Filterable gallery & deep-link modal host
│   │   ├── Audit.jsx            # Generative AI audit suite & systematic critique matrix
│   │   ├── Methodology.jsx      # Curatorial ethics & historiographical essay
│   │   ├── About.jsx            # Research team, schema documentation & descendant corrections
│   │   └── NotFound.jsx         # Accessible 404 error page with navigation shortcuts
│   ├── utils/
│   │   └── filters.js           # Pure functional filtering & URL search query serialization
│   ├── App.jsx                  # Code-split router configuration (React.lazy + Suspense)
│   ├── index.css                # Tailwind base directives & custom scrollbar/utility tokens
│   └── main.jsx                 # Vite application entry point
├── index.html                   # HTML5 root with semantic meta tags, fonts & noscript notice
├── package.json                 # Project scripts and dependencies
├── tailwind.config.js           # Tailored palette (parchment, ink, indigo-dye, madder, turmeric)
└── vite.config.js               # Vite build configuration (base: '/')
```

---

## Local Setup & Development Scripts

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
# Navigate to the project root
cd beneath-the-empires

# Install dependencies
npm install
```

### Available Scripts

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | Launch Dev Server | Starts local development server at `http://localhost:5173/` with hot module replacement (HMR). |
| `npm run build` | Production Build | Runs Vite production build, generating code-split bundles into `dist/`. |
| `npm run preview` | Preview Production | Serves the production `dist/` directory at `http://localhost:4173/` to test production assets and routing. |
| `npm run lint` / `npx oxlint` | Code Quality Audit | Executes fast static analysis across all 24 JSX and JS source files (0 errors, 0 warnings). |
| `node scripts/check-images.mjs` | Archival Link Check | Follows HTTP redirect chains for all 5 Wikimedia Commons archival scans, ensuring 200 OK responses. |
| `node scripts/generate-demo-audio.mjs` | Generate Audio | Synthesizes a valid 30-second WAV file with grinding-stone rhythmic pulses for oral history testing. |

---

## Archival Data Schema (`archives.json`)

The archive implements a qualified **Dublin Core (`dc:`)** schema paired with a domain-specific **Beneath the Empires (`bte:`)** extension namespace:

```json
{
  "id": "grain-miller-1871",
  "dc": {
    "title": "Grain Millers in Household Courtyard (Kunbi / Agrarian Labor)",
    "date": "1871",
    "creator": "Unknown British colonial photographer / administrative survey",
    "subject": [
      "Kunbi agrarian caste",
      "Domestic and subsistence labor",
      "Grain milling (Jate)",
      "Nauvari saree drape",
      "Chumbal head-ring technology"
    ],
    "description": "Two women seated opposite each other at a heavy stone hand-mill (jate)...",
    "rights": "Public Domain (photographic work created before 1925; source: Wikimedia Commons)",
    "source": "Wikimedia Commons (Special:FilePath)",
    "identifier": "https://commons.wikimedia.org/wiki/File:Photograph_of_two_women_grinding_grain..."
  },
  "bte": {
    "caste_class_context": "Kunbi / Maratha-Kunbi agrarian subaltern caste...",
    "labor_type": "Domestic / Subsistence Grain Processing",
    "material_technologies": [
      "Coarse handloom cotton (Nauvari drape)",
      "Cast stone grindmill (jate)",
      "Pewter and copper alloy wrist ornaments"
    ],
    "bodily_autonomy": "Seated splayed-leg posture providing physical leverage...",
    "critique_points": [
      "Colonial administrative framing categorized this living domestic chore as a timeless 'type'...",
      "AI generative models routinely replace rough handloom with opulent Banarasi silks..."
    ]
  },
  "image": "https://upload.wikimedia.org/wikipedia/commons/2/25/Photograph_of_two_women_grinding...",
  "audio": "/audio/grindmill-demo.wav",
  "ai": {
    "prompt": "Historical photograph of an Indian working-class woman in 1870...",
    "image": "/ai/ai-01.jpg",
    "critique_pins": [
      {
        "id": "pin-01-fabric",
        "category": "Fabric",
        "x": 42.5,
        "y": 64.0,
        "label": "Fabric Hallucination: Regal Silk Saree",
        "text": "The AI model generated a high-sheen satin-silk garment with gold zari borders..."
      }
    ],
    "bias_categories": [
      "Fabric Opulence Distortion",
      "Ornamentation Inflation",
      "Ergonomic / Postural Erasure"
    ]
  }
}
```

---

## Curatorial Guide: Adding a New Archetype Item

To incorporate a new historical archetype into the repository:

1. **Verify Archival Scan**:
   - Locate a high-resolution, public-domain scan on Wikimedia Commons, the Library of Congress, or the British Library.
   - Run `node scripts/check-images.mjs` or confirm that the image URL is stable and directly accessible.
2. **Add Record to `src/data/archives.json`**:
   - Create a unique slug for the `id` (e.g., `salt-pan-worker-1890s`).
   - Populate the `dc` (Dublin Core) block with full attribution, dates, and licensing tags.
   - Populate the `bte` block detailing caste/class context, material culture technologies, and bodily autonomy analysis grounded in secondary sources.
3. **Connect Oral History Audio (Optional)**:
   - If an oral history or song is available, place an audio recording in `public/audio/<filename>.wav` or `.mp3`.
   - Update `src/data/ovi-cues.json` with synchronized timestamps (`start`, `end` in seconds) and bilingual text (`mr` in Devanagari, `en` in English).

---

## AI Audit Guide: Adding Audited Specimens & Pins

To audit a new generative AI model's historical depiction:

1. **Execute Prompt**:
   - Run a standardized academic prompt against the generative model (e.g., Midjourney v6, DALL-E 3, Stable Diffusion XL):
     ```
     Historical documentary photograph of a 19th century working-class Bombay woman, 
     water carrier, carrying heavy brass pot, 1873, natural lighting, documentary archival style.
     ```
2. **Save Audited Specimen**:
   - Save the raw image output into `public/ai/` (e.g., `public/ai/ai-06.jpg`).
3. **Map Critique Coordinate Pins**:
   - In `archives.json`, define coordinate pins within `ai.critique_pins`:
     - `x`: Horizontal percentage across the image (0.0 to 100.0).
     - `y`: Vertical percentage down the image (0.0 to 100.0).
     - `category`: Must be one of `Fabric`, `Jewelry`, `Posture`, or `Tool`.
     - `label`: Short heading (e.g., *"Jewelry Inflation"*).
     - `text`: Detailed scholarly critique explaining the historical inaccuracy.
4. **Tag Bias Matrix**:
   - Add the observed systemic failures to `ai.bias_categories` to include them in the automated audit matrix.

---

## Accessibility (WCAG 2.2 AA) Standards

The application has been engineered to comply strictly with **WCAG 2.2 Level AA**:

- **Color Contrast**: All text pairings on `#F6F0E4` (`parchment`) exceed the minimum 4.5:1 ratio:
  - Body Text (`#1F1A17` Ink): **14.5:1** (AAA Compliant)
  - Interactive Links (`#2B4C6F` Indigo Dye): **5.8:1** (AA Compliant)
  - Audit Badges (`#9C3B2E` Madder): **5.4:1** (AA Compliant)
- **Keyboard Navigation**:
  - Global skip link (`<a href="#main-content">`) visible upon first tab press.
  - Consistent 2px indigo-dye focus rings with 2px offset (`focus:ring-2 focus:ring-indigo-dye focus:ring-offset-2`).
  - Dialog focus trap inside `ItemModal` that restores focus to the trigger card upon closing.
  - Compare slider controllable via Arrow keys, Shift+Arrow, Home, and End.
- **Touch Target Sizing**:
  - All interactive buttons, menu toggles, slider handles, and critique pins have hit areas of at least **44×44px** (`min-w-[44px] min-h-[44px]`).
- **Screen Reader Semantics**:
  - Strict single `<h1>` per page with a hierarchical header tree.
  - Active filter count updates communicated through `aria-live="polite"`.
  - Non-English text tagged with language attributes: `<span lang="mr">` for Marathi and `lang="en"` for translations.
  - `<noscript>` fallback alerting users to JavaScript requirements for interactive components.

---

## Production Deployment

### 1. Netlify
The repository includes a `public/_redirects` file:
```
/*    /index.html   200
```
- Build command: `npm run build`
- Publish directory: `dist`

### 2. Vercel
For Vercel deployment, configure `rewrites` in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. GitHub Pages
The project includes a `public/404.html` SPA routing script that converts 404 paths into URL query parameters on direct reload, seamlessly restored by `index.html`.
- If hosting under a repository subpath (e.g., `username.github.io/beneath-the-empires/`), update `base: '/beneath-the-empires/'` in `vite.config.js`.
- If hosting on a custom root domain (e.g., `beneath-the-empires.org`), leave `base: '/'`.

---

## Academic Citations, Ethics & Rights

### Creative Commons License
The curatorial essays, interface design, metadata taxonomy, and critical audit annotations of **Beneath the Empires** are licensed under the **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)** license.

### Archival Evidence Rights
Original archival photographic scans utilized in this archive are in the **Public Domain** (created prior to 1925), sourced via Wikimedia Commons, the Library of Congress, and the British Library. Complete provenance and source links are provided within each item's Dublin Core metadata record.

### Descendant & Community Correction Policy
We recognize that colonial ethnographic photographic records carry enduring caste, gender, and colonial violence. Descendants, community members, and scholars are warmly invited to submit contextual additions, orthographic adjustments, or curatorial corrections.
- **Curatorial Contact**: `curatorial@beneath-the-empires.org`
- **GitHub Discussions**: Open a pull request or issue citing relevant primary or secondary sources.

---

*Beneath the Empires &bull; Dedicated to the memory and bodily endurance of working-class women across Western India.*
