/**
 * Senses Yoga School — Heroic Yogi Winter 2026–2027 admissions.
 * Deploy as a Google Apps Script WEB APP attached to the private applications Sheet.
 * Run as: Me. Access: Anyone. The spreadsheet must remain private.
 *
 * The website uses a standard HTML form POST (not JSON/fetch) to avoid browser
 * CORS preflight issues. The response is delivered to a hidden iframe.
 * Note: an anonymous public endpoint can receive spam; monitor submissions.
 */
const SHEET_NAME = 'Applications';
const EXPECTED_FIELDS = ['fullName','preferredName','email','phone','neighborhood','adult','motivation','practice','priorStudy','learning','interests','service','weeklyAvailability','inPerson','support','questions','acknowledged'];
const MAX_LENGTHS = {fullName:120,preferredName:120,email:180,phone:40,neighborhood:120,motivation:3000,practice:3000,priorStudy:2500,learning:3000,interests:500,service:3000,weeklyAvailability:80,inPerson:80,support:2000,questions:2000};
function doPost(e) {
  try {
    if (!e || !e.parameter) throw Error('Missing submission.');
    const p = e.parameter;
    if (p.website) throw Error('Invalid submission.'); // Honeypot
    if (!p.fullName || !p.email || !p.motivation || !p.practice || !p.learning || !p.weeklyAvailability || !p.inPerson || p.adult !== 'Yes' || p.acknowledged !== 'on') throw Error('Required fields missing.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) throw Error('Invalid email.');
    const values = EXPECTED_FIELDS.map(k => k === 'interests' ? (e.parameters.interests || []).join('; ').trim() : String(p[k] || '').trim());
    EXPECTED_FIELDS.forEach((k,i)=>{ if (values[i].length > (MAX_LENGTHS[k] || 500)) throw Error('A response exceeds its length limit.'); });
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) throw Error('Please try again shortly.');
    let id;
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) throw Error('Application sheet is missing.');
      id = 'HY-' + Utilities.getUuid().slice(0,8).toUpperCase();
      // Prefix potentially executable spreadsheet formula values with a quote.
      const safe = s => /^[=+@\-\t\r]/.test(s) ? "'" + s : s;
      sheet.appendRow([new Date(), id, ...values.slice(0,16).map(safe), values[16] === 'on' ? 'Yes' : 'No', 'New', '']);
    } finally { lock.releaseLock(); }
    return response_('success',id);
  } catch (err) {
    console.error(err);
    return response_('error','');
  }
}
function response_(status,id) {
  // The public page checks origin of postMessage. The Apps Script iframe is
  // sandboxed by Google; do not send applicant details back to the browser.
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>parent.postMessage(' +
    JSON.stringify({source:'heroic-yogi-app',status:status,applicationId:id}) +
    ',"*");<\/script></body></html>');
}
