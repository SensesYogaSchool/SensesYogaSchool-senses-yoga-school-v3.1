# Heroic Yogi winter admissions — staff and maintenance guide

**Release status: NOT OPEN.** Receiver source is saved in the existing Apps Script project. Google authorization and the updated deployment are pending. Website submission remains disabled. Do not merge PR #7 until the live acceptance checks below pass.

## Assets to preserve

- Website: https://www.sensesyoga.org/heroic-yogi-apprenticeship.html
- PR: https://github.com/SensesYogaSchool/SensesYogaSchool-senses-yoga-school-v3.1/pull/7
- Branch: `feature/winter-apprenticeship-native-application`
- Private sheet: https://docs.google.com/spreadsheets/d/1MvIu1JAmR_5udAPkMyE9gRm497GVYpw5FLTLKCSAov4/edit
- Script: https://script.google.com/home/projects/1-07qgVlag3CuPVTfRvmW9aPl7dk5uy5vmQhNHTm6-0TvfKzVAyrBhGHY/edit
- Existing endpoint: `https://script.google.com/macros/s/AKfycby5Ua5AmP1ujVPGmkG0b7nKRQ0bsGpBBjaEoALENme_epotWjcVyQUPqQWIo26ejnG1kg/exec`

Do not create replacement sheets, script projects, or web app deployments. Keep the Applications tab's 21 headers unchanged; the receiver fails closed if they differ.

## Everyday review

1. Sign into the authorized school account and open the private sheet. Review new applications regularly during admissions, ideally twice weekly.
2. Change **Review status (T)** from New to Under Review. Read the applicant's practice, learning, service, and realistic winter availability together.
3. Contact the applicant privately using **Email (E)** or their optional phone. Include the application ID when useful. Never send them the spreadsheet link or another person's responses.
4. Use Interview/Orientation while arranging a conversation. Record reviewer initials, date contacted, and next action in **Mentor notes (U)**.
5. A mentor records Accepted, Waitlisted, or Declined after discussion and capacity review. Winter intake is approximately one or two apprentices. No automated admissions decisions.
6. Keep notes respectful and limited to admissions. Do not request or retain sensitive medical details. Only grant sheet access to individually approved reviewers. Review access when volunteers change.
7. Before each season, review the privacy wording and retention needs; agree a retention period with school leadership and remove records no longer needed using the school's authorized process.

The confirmation is on the website, not an automatic email. Staff send follow-up messages themselves. Everyday review needs only Google Sheets and school email; no TinyFish or AI subscription is required.

## Technical maintenance

- `winter-application.js` submits URL-encoded form fields with `fetch`, follows Google's redirect, and reads a JSON receipt. Never use `no-cors`, a timer, or iframe load as proof of success.
- A random request ID travels with the application. The receiver stores it in Application ID under a script lock. Repeating that request returns the same receipt without adding another row. Browser retries preserve the original body and ID; they cannot edit an uncertain submission. Reloading loses that temporary retry state.
- No applicant answers go into browser storage, analytics, URLs, or application logs. Only a hashed email rate-limit key is temporarily cached by the receiver.
- The server validates required answers, adult acknowledgment, email, choices, repeated fields, and lengths. Multi-select interests are joined into column M. Potential formula-leading text is escaped.
- A honeypot and best-effort limit of five new applications per email per hour reduce spam. They are not a complete bot defense. Monitor the sheet and Apps Script quotas. If abused, close admissions first; assess additional safeguards only if needed.
- The only public GET response is a readiness marker. There is no applicant-list or record-reading endpoint. This marker does not prove that writes work.
- Spreadsheet time zone is America/Chicago. Submitted timestamps are server timestamps. Review status starts at New; Mentor notes starts blank.
- Google requests the Sheets OAuth scope for `openById`. The reviewed code opens only the fixed application spreadsheet. Keep project edit access restricted; editors could change code.
- To change receiving code: update the repository source, copy it into Code.gs, save, then **Deploy → Manage deployments → Edit → New version → Deploy** on the existing deployment. Preserve execute-as school account and access Anyone. Do not choose New deployment.
- To close admissions: set `admissionsOpen = false` in `winter-application.js`, restore closed admissions wording, publish, and verify the disabled button. The endpoint itself remains reachable until separately disabled in Apps Script.

## Release acceptance checks — still required

1. Complete Google authorization and update the existing deployment. Verify source and /exec readiness.
2. Preview the existing page with the release gate enabled, without opening public admissions.
3. Submit one clearly labeled fictional application using an example.com email and multiple interests. Check exactly one new row, all A:U values, timestamp, and application ID.
4. Retry the same request ID: exactly one row must remain. Check required fields, malformed email, missing acknowledgment, blank-only text, and honeypot rejection.
5. Confirm the browser shows success only for a matching successful receipt. Test network/timeout, non-JSON, wrong receipt, and server error paths. Check anonymous access, mobile/tablet/desktop layout, keyboard focus, labels, and contrast.
6. Remove only the verified fictional test row. Preserve every genuine applicant and all headers.
7. Update page wording from preview to open admissions, enable the release gate, complete PR #7, and publish. Confirm production delivers the new assets; perform one final fictional smoke test and remove it.

## Checks completed in this work session

- Confirmed the existing Apps Script originally contained only myFunction; installed the reviewed receiver and verified exact editor text against source.
- Confirmed existing deployment uses luan@sensesyoga.org and access Anyone. Deployment update stopped at Google authorization; not declared operational.
- Confirmed spreadsheet was private to its owner and 21 application/review headers matched.
- Added review-status validation, review instructions, and Central time zone without changing application columns or records.
- `node --test tests/winter-application.test.cjs`: 26 passing mocked regression tests. These cover field mapping, multi-selects, duplicate request IDs, validation, formula escaping, write failures, rate limiting, and client success/error handling. They do not substitute for Google/browser end-to-end tests.
