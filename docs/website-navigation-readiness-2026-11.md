# Website navigation readiness — 7 November 2026

**Scope:** Source-level initial audit of Senses Yoga School's GitHub website. This is not a completed live browser or mobile device QA pass.

## Verified in source
- `index.html`, `schools.html`, `calendar.html`, and `community-in-practice.html` contain the same six top-level navigation labels and destinations: Discover → index.html; Academics → schools.html; Library → library.html; Campus → calendar.html; Impact → impact.html; Support → support.html.
- These four pages include `site-navigation.css` and a mobile `Menu` button with `aria-expanded` initially false.
- School of Ecology and Specialized Studies should be discoverable through the existing Schools of Practice page rather than new top-level navigation items.
- `academics.html`, `school-of-ecology.html`, and `school-of-specialized-studies.html` do not exist as root-level files. Do not link to these invented paths.

## Required release checks
1. Enumerate all public HTML routes and compare their header markup, stylesheet and menu behavior against the six-link navigation standard.
2. Verify mobile menu open/close behavior, keyboard focus, accessible name, and `aria-expanded` updates on actual mobile viewport.
3. Crawl internal links, check missing targets and unintended redirects; preserve all existing URLs.
4. Check readability, contrast, tap targets and wrapping on narrow screens, including School pages, Library, Living Atlas, Calendar, Impact and Support.
5. Check calendar schedule wording for the current November 2026 season and archive versus active events.
6. Confirm each school is reachable within two interactions from Academics and that a visitor can return to the shared Schools page.
7. Verify external links, forms, contact methods, and page-specific assets; record any failures and fixes.
8. Do not publish the Svetta pilot recruitment page until navigation QA and founder review are complete.

## Release status
**Not yet certified ready.** Four important pages show consistent top-level navigation in source. Full-site route coverage, browser behavior, and mobile accessibility remain to be verified. Svetta's interdisciplinary pilot remains in separate draft PR #9.
