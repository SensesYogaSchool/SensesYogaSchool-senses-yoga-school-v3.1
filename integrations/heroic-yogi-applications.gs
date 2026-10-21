/**
 * Heroic Yogi winter admissions receiver. Keep the destination private.
 * Update the EXISTING web app deployment: execute as luan@sensesyoga.org,
 * access Anyone. No applicant data is returned by GET or POST.
 */
const SHEET_ID = '1MvIu1JAmR_5udAPkMyE9gRm497GVYpw5FLTLKCSAov4';
const SHEET_NAME = 'Applications';
const HEADERS = ['Timestamp','Application ID','Full name','Preferred name','Email','Phone','Neighborhood','Adult 18+','Motivation','Personal practice','Previous study','Learning questions','Interests','Service reflection','Weekly availability','Milwaukee in-person availability','Participation support','Mentor questions','Acknowledgment','Review status','Mentor notes'];
const EXPECTED_FIELDS = ['fullName','preferredName','email','phone','neighborhood','adult','motivation','practice','priorStudy','learning','interests','service','weeklyAvailability','inPerson','support','questions','acknowledged'];
const MAX_LENGTHS = {fullName:120,preferredName:120,email:180,phone:40,neighborhood:120,motivation:3000,practice:3000,priorStudy:2500,learning:3000,interests:500,service:3000,weeklyAvailability:80,inPerson:80,support:2000,questions:2000};
const INTERESTS = ['Sādhana and yoga practice','Library of Consciousness and study','Reflection and journaling','Gardening, ecology, and foodways','Sevā and community service','Mentorship and teaching'];
function doGet() {
  return response_({status:'ready',source:'heroic-yogi-app'});
}
function doPost(e) {
  try {
    const p = e && e.parameter;
    if (!p || !e.parameters || Number(e.contentLength) > 100000 || p.website) return response_({status:'error',code:'validation'});
    const fields = {};
    EXPECTED_FIELDS.forEach(k => {
      if (k !== 'interests' && (e.parameters[k] || []).length > 1) throw Error('validation');
      fields[k] = String(p[k] || '').trim();
    });
    const interests = e.parameters.interests || [];
    if (interests.length > INTERESTS.length || interests.some(v => !INTERESTS.includes(v))) throw Error('validation');
    fields.interests = [...new Set(interests)].join('; ');
    const required = ['fullName','email','motivation','practice','learning','weeklyAvailability','inPerson'];
    if (required.some(k => !fields[k]) || fields.adult !== 'Yes' || fields.acknowledged !== 'on') throw Error('validation');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) throw Error('validation');
    if (!['Less than 3 hours','3–5 hours','6–8 hours','More than 8 hours','Not sure yet'].includes(fields.weeklyAvailability)) throw Error('validation');
    if (!['Yes','Sometimes, depending on schedule','No'].includes(fields.inPerson)) throw Error('validation');
    EXPECTED_FIELDS.forEach(k => { if (fields[k].length > (MAX_LENGTHS[k] || 500)) throw Error('validation'); });
    const requestId = String(p.requestId || '');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) throw Error('validation');
    const id = 'HY-' + requestId.toUpperCase();
    const safe = s => /^[=+@\-\t\r\n]/.test(s) ? "'" + s : s;
    const values = EXPECTED_FIELDS.slice(0,16).map(k => safe(fields[k])).concat('Yes');
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return response_({status:'error',code:'busy'});
    try {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet || JSON.stringify(sheet.getRange(1,1,1,21).getValues()[0]) !== JSON.stringify(HEADERS)) throw Error('configuration');
      const last = sheet.getLastRow();
      // The client retains this random ID for retries. Concurrent retries cannot add rows.
      const match = last > 1 ? sheet.getRange(2,2,last-1,1).createTextFinder(id).matchEntireCell(true).findNext() : null;
      if (match) return response_({status:'success',source:'heroic-yogi-app',applicationId:id});
      // Best-effort per-email limit; hashed keys only, no applicant details in logs/cache.
      const key = 'rate:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,fields.email.toLowerCase()));
      const cache = CacheService.getScriptCache();
      const count = Number(cache.get(key) || 0);
      if (count >= 5) return response_({status:'error',code:'rate'});
      sheet.appendRow([new Date(),id,...values,'New','']);
      SpreadsheetApp.flush();
      if (sheet.getRange(last+1,2).getValue() !== id) throw Error('write');
      cache.put(key,String(count+1),3600);
      return response_({status:'success',source:'heroic-yogi-app',applicationId:id});
    } finally { lock.releaseLock(); }
  } catch (err) {
    // Do not log the request or private applicant responses.
    return response_({status:'error',code:err.message === 'validation' ? 'validation' : 'unavailable'});
  }
}
function response_(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
