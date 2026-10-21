const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const receiver = fs.readFileSync('integrations/heroic-yogi-applications.gs','utf8');
const client = fs.readFileSync('winter-application.js','utf8').replace('const admissionsOpen = false;','const admissionsOpen = true;');
const uuid = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
const headers = ['Timestamp','Application ID','Full name','Preferred name','Email','Phone','Neighborhood','Adult 18+','Motivation','Personal practice','Previous study','Learning questions','Interests','Service reflection','Weekly availability','Milwaukee in-person availability','Participation support','Mentor questions','Acknowledgment','Review status','Mentor notes'];
function fixture(overrides={}) {
 const parameters = Object.fromEntries(Object.entries({fullName:'FICTIONAL TEST — River Sample',preferredName:'River',email:'winter-test@example.com',phone:'+1 414 555 0100',neighborhood:'Milwaukee',adult:'Yes',motivation:'Practice in community',practice:'Daily reflection',priorStudy:'No teaching credentials',learning:'Read and reflect',interests:['Sādhana and yoga practice','Library of Consciousness and study','Sevā and community service'],service:'Garden volunteering',weeklyAvailability:'3–5 hours',inPerson:'Sometimes, depending on schedule',support:'Evening meetings',questions:'When is orientation?',acknowledged:'on',requestId:uuid,...overrides}).map(([k,v])=>[k,Array.isArray(v)?v:[v]]));
 return {parameters,parameter:Object.fromEntries(Object.entries(parameters).map(([k,v])=>[k,v[0]])),contentLength:1500};
}
function server({badHeaders=false,writeFail=false,locked=false}={}) {
 const rows=[badHeaders?['wrong']:headers]; const cache=new Map();
 const sheet={getLastRow:()=>rows.length,appendRow:r=>{if(writeFail)throw Error('write');rows.push(r);},getRange:(row,col)=>({getValues:()=>[rows[row-1]],getValue:()=>rows[row-1]?.[col-1],createTextFinder:id=>({matchEntireCell(){return this;},findNext:()=>rows.slice(1).some(r=>r[1]===id)?{}:null})})};
 const ctx={SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush(){}},LockService:{getScriptLock:()=>({tryLock:()=>!locked,releaseLock(){}})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})},Utilities:{base64EncodeWebSafe:v=>v,computeDigest:(_,v)=>v,DigestAlgorithm:{SHA_256:'sha'}},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})}};
 vm.createContext(ctx);vm.runInContext(receiver,ctx);return {ctx,rows,cache};
}
test('maps all 21 columns, preserves multiple interests and safe phone text',()=>{
 const {ctx,rows}=server();const r=ctx.doPost(fixture());assert.equal(r.status,'success');assert.equal(rows.length,2);assert.equal(rows[1].length,21);
 const expected=['HY-'+uuid.toUpperCase(),'FICTIONAL TEST — River Sample','River','winter-test@example.com',"'+1 414 555 0100",'Milwaukee','Yes','Practice in community','Daily reflection','No teaching credentials','Read and reflect','Sādhana and yoga practice; Library of Consciousness and study; Sevā and community service','Garden volunteering','3–5 hours','Sometimes, depending on schedule','Evening meetings','When is orientation?','Yes','New',''];
 assert.deepEqual(Array.from(rows[1].slice(1)),expected);assert.ok(Number.isFinite(+rows[1][0]));
});
test('same request ID creates exactly one row',()=>{const {ctx,rows}=server();for(let i=0;i<3;i++)assert.equal(ctx.doPost(fixture()).status,'success');assert.equal(rows.length,2);});
for(const [name,override] of Object.entries({blankName:{fullName:'  '},missingPractice:{practice:''},invalidEmail:{email:'bad@'},missingAcknowledgment:{acknowledged:''},notAdult:{adult:'No'},honeypot:{website:'spam'},invalidChoice:{weeklyAvailability:'anything'},invalidInterest:{interests:['unexpected']},duplicateField:{fullName:['One','Two']},longResponse:{motivation:'a'.repeat(3001)},invalidId:{requestId:'bad'}})) {
 test('rejects '+name+' without writing',()=>{const {ctx,rows}=server();assert.equal(ctx.doPost(fixture(override)).status,'error');assert.equal(rows.length,1);});
}
test('formula-leading inputs stay strings',()=>{const {ctx,rows}=server();ctx.doPost(fixture({preferredName:'  =1+1',support:'@SUM(1)',questions:'-1+2'}));assert.equal(rows[1][3],"'=1+1");assert.equal(rows[1][16],"'@SUM(1)");assert.equal(rows[1][17],"'-1+2");});
for(const option of ['badHeaders','writeFail','locked'])test('fails closed on '+option,()=>{const {ctx,rows}=server({[option]:true});assert.equal(ctx.doPost(fixture()).status,'error');assert.equal(rows.length,1);});
test('rate limit blocks sixth new request; existing request can retry',()=>{const {ctx,rows}=server();for(let i=0;i<6;i++){const e=fixture({requestId:uuid.replace('aaaaaaaa','aaaaaaa'+i)});assert.equal(ctx.doPost(e).status,i<5?'success':'error');}assert.equal(rows.length,6);assert.equal(ctx.doPost(fixture({requestId:uuid.replace('aaaaaaaa','aaaaaaa0')})).status,'success');});
test('GET returns no applicant records',()=>{const {ctx}=server();ctx.doPost(fixture());assert.deepEqual(JSON.parse(JSON.stringify(ctx.doGet())),{status:'ready',source:'heroic-yogi-app'});});
function browserFixture(fetch,valid=true){
 let handler,reset=false;const controls=[{disabled:false}];const button={disabled:true,removeAttribute(){},textContent:''};const status={textContent:'',classList:{toggle(){}},focus(){}};
 const form={elements:{adult:{value:'Yes',setCustomValidity(){},addEventListener(){}}},querySelector:()=>button,querySelectorAll:()=>controls,reportValidity:()=>valid,addEventListener:(_,f)=>handler=f,setAttribute(){},removeAttribute(){},reset(){reset=true;}};
 const ctx={document:{getElementById:id=>id==='heroic-winter-form'?form:status},crypto:{randomUUID:()=>uuid},URLSearchParams,FormData:class{*[Symbol.iterator](){yield ['email','winter-test@example.com'];}},AbortController,setTimeout:()=>1,clearTimeout(){},fetch};vm.createContext(ctx);vm.runInContext(client,ctx);
 return {submit:()=>handler({preventDefault(){}}),button,status,controls,wasReset:()=>reset};
}
test('invalid browser fields do not send a request',async()=>{let called=false;const b=browserFixture(()=>{called=true;},false);await b.submit();assert.equal(called,false);});
test('client success requires matching receipt; repeat submit blocked',async()=>{let calls=0;const b=browserFixture(async()=>{calls++;return {ok:true,json:async()=>({status:'success',source:'heroic-yogi-app',applicationId:'HY-'+uuid.toUpperCase()})};});await b.submit();await b.submit();assert.equal(calls,1);assert.match(b.status.textContent,/has been received/);assert.equal(b.button.disabled,true);assert.equal(b.wasReset(),true);});
for(const [name,result] of Object.entries({serverError:{status:'error'},wrongId:{status:'success',source:'heroic-yogi-app',applicationId:'wrong'},wrongSource:{status:'success',source:'other',applicationId:'HY-'+uuid.toUpperCase()}}))test('no false success: '+name,async()=>{const b=browserFixture(async()=>({ok:true,json:async()=>result}));await b.submit();assert.match(b.status.textContent,/could not confirm/);assert.equal(b.wasReset(),false);});
test('network failure retries identical payload and ID',async()=>{const bodies=[];const b=browserFixture(async(_,o)=>{bodies.push(o.body.toString());throw Error('network');});await b.submit();await b.submit();assert.equal(bodies.length,2);assert.equal(bodies[0],bodies[1]);assert.match(b.status.textContent,/could not confirm/);});
test('validation failure permits correction',async()=>{const b=browserFixture(async()=>({ok:true,json:async()=>({status:'error',code:'validation'})}));await b.submit();assert.equal(b.controls[0].disabled,false);assert.equal(b.button.textContent,'Send my application');assert.equal(b.wasReset(),false);});
