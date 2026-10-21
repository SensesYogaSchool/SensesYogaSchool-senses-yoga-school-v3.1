# Heroic Yogi Winter Applications — Google Sheets connection

**Status:** Staged, not accepting submissions. Do not publish until end-to-end testing succeeds.

## Private destination
Spreadsheet: https://docs.google.com/spreadsheets/d/1MvIu1JAmR_5udAPkMyE9gRm497GVYpw5FLTLKCSAov4/edit
Tab: Applications. Keep sharing restricted to approved reviewers. Do not grant public viewer access.

## One-time Google Apps Script deployment
1. Open the spreadsheet, choose **Extensions → Apps Script**.
2. Replace the default Code.gs with the exact contents of `integrations/heroic-yogi-applications.gs` in this repository.
3. Save; select **Deploy → New deployment → Web app**.
4. Execute as **Me**. Who has access: **Anyone** (anonymous applicants). Authorize access to the spreadsheet when prompted.
5. Copy the generated URL ending in `/exec`. Keep it in website configuration, not in applicant-facing prose.
6. Update the form `action` to the /exec URL, set `method="POST"` and `target` to a named hidden iframe, enable the submit button, and attach the success/error UI listener. This must happen on the development branch first.
7. Test with a clearly marked non-sensitive test applicant, verify all columns (especially multi-select interests) and the response confirmation, then remove the test row.
8. Confirm spreadsheet permissions, spam controls, and the privacy statement before merging the branch and opening admissions.

## Important implementation notes
- Google Apps Script public web apps are not authenticated applicant portals. Do not ask for health details or government identifiers.
- The honeypot and validation reduce accidental/automated misuse but do not stop sophisticated spam. Monitor submissions; consider CAPTCHA or rate-limiting proxy if abused.
- Do not send applicants directly to the private spreadsheet.
- On failure, tell applicants to retry or contact the school; never display the application contents or spreadsheet credentials.
- Existing admissions form stays linked on the live website until the new workflow is verified.
