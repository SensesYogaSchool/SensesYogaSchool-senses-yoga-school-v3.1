/** Senses Yoga School · website announcement feed (Google Apps Script).
 * Bind this script to the Website Announcement Publishing Register spreadsheet.
 * Deploy as web app: Execute as me; access Anyone. Only approved announcement fields are public.
 * Public output uses JSONP because Google Apps Script ContentService does not guarantee CORS.
 */
const SHEET_NAME = 'Announcements';
function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  if (!/^SensesAnnouncementFeed_[A-Za-z0-9_]{1,48}$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback').setMimeType(ContentService.MimeType.TEXT);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet ? sheet.getDataRange().getDisplayValues().slice(1) : [];
  const now = Date.now();
  const candidates = rows.map(r => ({
    id: r[0], status: r[1], eyebrow: r[2], title: r[3], message: r[4],
    date: r[5], place: r[6], link: r[7], linkText: r[8],
    publishAt: r[9], expiresAt: r[10], approvedBy: r[11]
  })).filter(a => a.id && a.status === 'Approved' && a.approvedBy.trim() &&
    a.title && a.message && a.expiresAt &&
    (!a.publishAt || (Number.isFinite(Date.parse(a.publishAt)) && Date.parse(a.publishAt) <= now)) &&
    Number.isFinite(Date.parse(a.expiresAt)) && Date.parse(a.expiresAt) > now &&
    (!a.link || /^https:\/\//i.test(a.link)));
  const a = candidates.length ? candidates[candidates.length - 1] : null;
  const payload = a ? {
    enabled: true, id: a.id, eyebrow: a.eyebrow, title: a.title,
    message: a.message, date: a.date, place: a.place, link: a.link,
    linkText: a.linkText, expiresAt: a.expiresAt, delayMs: 10000
  } : {enabled:false};
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(payload).replace(/</g, '\\u003c') + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
