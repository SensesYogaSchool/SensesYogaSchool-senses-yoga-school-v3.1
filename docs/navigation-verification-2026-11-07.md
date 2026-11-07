# Navigation verification report — 7 November 2026

## Source checks completed

- Four pages missing shared navigation assets were patched on this branch: `specialized-studies.html`, `practice.html`, `volunteer.html`, `resources.html`.
- The shared controller `site-navigation.js` now keeps the mobile open state synchronized with `aria-expanded`, supports Escape/focus return, outside-click dismissal, and viewport change dismissal.
- Source inspection confirms the intended four destinations are `index.html` (Discover), `schools.html` (Learn), `atlas.html` (Explore), and `partner.html` (Connect).
- Extracted 30 distinct local HTML destinations from 15 core pages and verified that **all 30 exist** on the repository's default branch. This is a file-existence check, not a full browser or link-status crawl.

## Outstanding release checks

- Browser-test menu at mobile widths and desktop, including touch, keyboard and screen-reader navigation.
- Confirm JavaScript does not conflict with older `script.js` event listeners and header mutations.
- Check links, assets, forms and redirects on every public page, not just the 15 sampled pages.
- Confirm live deployment matches GitHub `main` and verify cache invalidation for changed navigation script.
- Review current calendar and other time-sensitive content.
- Obtain founder approval before merging and promoting the Svetta pilot.

## Release gate

**Not yet approved for production.** No live deployment is claimed.
