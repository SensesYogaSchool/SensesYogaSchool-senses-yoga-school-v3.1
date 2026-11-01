# Senses Yoga School — The Living Dream V1.0
Status: Phase I foundation in progress | Owner: Senses Yoga School | Principle: Community is our campus.

## Purpose
Unify the existing GitHub Pages site into one accessible digital campus without removing curriculum, program evidence, community photography, sacred artwork, attribution, or institutional history. The emotional journey is Wonder → Discovery → Manifestation: a dream becomes embodied learning and community service.

## Canonical information architecture
- Discover: index.html; about.html; contact and institutional orientation.
- Academics: schools.html (four schools); wellness.html, ecology.html, specialized-studies.html, creative-arts.html; lead.html apprenticeship; catalog.html; placements.
- Library: library.html (Library of Consciousness), learn.html (learning framework), heroic-yogi-atlas.html (sacred studies reading room), field guides and Dreamscaping materials.
- Campus: calendar.html, practice.html, serve.html, volunteer.html, community sites and gatherings.
- Impact: impact.html, documented outcomes and verified stewardship.
- Support: support.html, partnerships and sponsorship pathways.
These are navigation categories, not new independent schools. Maintain confirmed/developing distinctions.

## Shared components and maintenance
1. One global header/navigation pattern with six stable destinations; preserve calendar and support CTAs, logo, mobile menu behavior, and existing deep links.
2. One consistent footer containing institutional identity, six destination links, and contact/accessibility information when verified.
3. Shared breadcrumbs, page hero, school discovery cards, learning-resource cards, status labels, call-to-action blocks and art credits.
4. One campus design stylesheet (living-dream.css), loaded after legacy styles as a controlled transition. Avoid expanding the large legacy styles.css with additional one-off overrides.
5. Future phase: shared templates or a small static build system; do not introduce a paid CMS or browser-only private student records.

## Design tokens
- Dream plum #220D38; violet #4A285F; sacred gold #E3B94F; ivory #F7F0E2; living green #456A50; ink #21162B.
- Typography: Playfair Display SC for ceremonial titles, Cinzel for navigation and academic labels, Crimson Text for reading.
- Desktop display clamp(2.6rem,5vw,5rem); section titles clamp(1.9rem,3.2vw,3.1rem); body clamp(1.05rem,1.25vw,1.2rem), line-height >=1.55.
- Mobile: 320–480px fluid widths, no horizontal overflow, readable cards and minimum 44px tap targets.
- Prefer ivory on dark images, dark ink on ivory surfaces; verify WCAG AA contrast for essential text. Avoid dark-purple headlines on photographs.

## Imagery and motion
- Real school photography establishes evidence and trust. Cosmic effects frame inquiry, never obscure educational content.
- Preserve sacred art provenance and existing credit text; confirm license and attribution before expanding artwork use. Avoid Baháʼu'lláh portraits and insensitive depictions of Haudenosaunee teachings.
- Use light star textures and restrained fades only; no mandatory autoplay, no essential content hidden by animation, respect prefers-reduced-motion, and keep motion toggles keyboard accessible.
- Respect semantic headings, focus visibility, alt text, keyboard menu behavior and screen reader labels.

## Phased commits and acceptance gates
Phase I — Foundation: commit this plan; add shared campus tokens/styles; standardize navigation on initial public entry pages (home, schools, learn, practice, about) while retaining content. Verify GitHub file state and source-level checks; then verify deployed pages visually on mobile/desktop before expanding.
Phase II — Academic hierarchy: apply header/footer/breadcrumb patterns to four school pages and catalog; align program status and links; validate learning routes and credit retention.
Phase III — Library integration: unify library, Atlas, Dreamscaping and field guides without merging distinct religious traditions or overwriting library-cosmos components.
Phase IV — Community and impact: standardize calendar, campus locations, partner pathways, documented outcomes and support.
Phase V — Quality assurance: automated link checks, accessibility scans, responsive screenshots at 320/390/768/1440px, reduced-motion checks, browser testing, and deployment verification. Record each changed file and commit.

## Rollback and publishing
Use small commits with specific messages; never assume a commit proves GitHub Pages publication. Revert individual changes if layout, mobile menu or contrast regress. Verify https://www.sensesyoga.org/ after deployment, and report failures separately.
