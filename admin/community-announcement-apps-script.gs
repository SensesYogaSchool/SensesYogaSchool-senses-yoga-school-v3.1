/**
 * Senses Yoga School · Community Announcement Feed
 * In Google Sheets: Extensions > Apps Script. Paste this code and deploy
 * as a web app (execute as owner, access Anyone). Never expose spreadsheet itself.
 * After deployment, configure the website to consume the deployment URL.
 */
const SHEET_NAME = 'Announcements';
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return json_({announcement:null});
  const data = sheet.getDataRange().getDisplayValues();
  const headings = data.shift();
  const now = Date.now();
  const records = data.map(row => Object.fromEntries(headings.map((h,i)=>[h,row[i]||''])));
  const approved = records.filter(r => {
    const from = Date.parse(r['Publish From (ISO Central)']);
    const until = Date.parse(r['Expires At (ISO Central)']);
    return r.Status === 'Published' && r.Approval === 'Approved'
      && r['Announcement ID'] && r.Headline
      && Number.isFinite(from) && Number.isFinite(until)
      && now >= from && now < until;
  }).sort((a,b) => (Number(a.Priority)||999)-(Number(b.Priority)||999));
  const r = approved[0];
  const safeLink = r && /^https:\/\//i.test(r['Button URL']) ? r['Button URL'] : 'https://www.sensesyoga.org/calendar.html';
  return json_({announcement:r ? {
    id:r['Announcement ID'], enabled:true, eyebrow:r.Eyebrow,
    title:r.Headline, message:r.Message, date:r['Event Date'],
    place:r.Location, link:safeLink, linkText:r['Button Text'],
    expiresAt:r['Expires At (ISO Central)'], delayMs:10000
  }:null});
}
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
