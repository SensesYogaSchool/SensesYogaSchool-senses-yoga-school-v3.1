const API='https://gqowglwyumkzyhwxtxng.supabase.co';
const KEY='sb_publishable_bCOv6eCVVhrIlDqR4MdNNA_tVW2fSCv';
const statusEl=document.getElementById('admin-status');
const gate=document.getElementById('admin-gate');
const workspace=document.getElementById('admin-workspace');
const form=document.getElementById('admin-login');
let session=null;
try { session=JSON.parse(sessionStorage.getItem('senses_admin_session')||'null'); } catch { session=null; }
function save(s){session=s;sessionStorage.setItem('senses_admin_session',JSON.stringify(s));}
function clear(){session=null;sessionStorage.removeItem('senses_admin_session');}
function showGate(message){statusEl.textContent=message;gate.hidden=false;workspace.hidden=true;}
async function request(path,opts={}){
 const headers={apikey:KEY,...opts.headers};
 const response=await fetch(API+path,{...opts,headers});
 if(!response.ok)throw new Error(`Request failed (${response.status})`);
 return response.status===204?null:response.json();
}
async function authenticated(path){return request(path,{headers:{Authorization:`Bearer ${session.access_token}`}});}
async function refresh(){
 if(!session?.refresh_token)throw new Error('Session expired');
 save(await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})}));
}
function addCell(row,value){const td=document.createElement('td');td.textContent=String(value??'—');row.append(td);}
async function load(){
 if(!session){showGate('Administrator sign-in required.');return;}
 try{
  let user;
  try{user=await authenticated('/auth/v1/user');}catch{await refresh();user=await authenticated('/auth/v1/user');}
  if(user.app_metadata?.school_role!=='admin'){clear();showGate('This account is not authorized as a school administrator.');return;}
  const names=['apprentice_profiles','apprentice_reflections','service_hours','lesson_assignments'];
  let records;
  try{records=await Promise.all(names.map(name=>authenticated(`/rest/v1/${name}?select=*`)));}
  catch{await refresh();records=await Promise.all(names.map(name=>authenticated(`/rest/v1/${name}?select=*`)));}
  ['people','reflections','hours','lessons'].forEach((name,i)=>document.getElementById('count-'+name).textContent=records[i].length.toLocaleString());
  const tbody=document.getElementById('admin-people');tbody.replaceChildren();
  for(const p of records[0]){const tr=document.createElement('tr');[p.display_name,p.cohort,p.role,p.active?'Yes':'No'].forEach(v=>addCell(tr,v));tbody.append(tr);}
  if(!records[0].length){const tr=document.createElement('tr');const td=document.createElement('td');td.colSpan=4;td.textContent='No activated apprentice profiles yet.';tr.append(td);tbody.append(tr);}
  gate.hidden=true;workspace.hidden=false;statusEl.textContent='Authorized administrator session.';
 }catch(e){clear();showGate('Unable to open the dashboard. '+e.message);}
}
form?.addEventListener('submit',async event=>{
 event.preventDefault();const button=form.querySelector('button');button.disabled=true;statusEl.textContent='Signing in…';
 try{
  const email=document.getElementById('admin-email').value.trim();
  const password=document.getElementById('admin-password').value;
  const result=await request('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  document.getElementById('admin-password').value='';save(result);await load();
 }catch{clear();showGate('Sign-in failed. Check your email, password, and account status.');}
 finally{button.disabled=false;}
});
document.getElementById('admin-signout').addEventListener('click',async()=>{
 const access=session?.access_token;clear();showGate('Signed out.');
 if(access)try{await request('/auth/v1/logout',{method:'POST',headers:{Authorization:`Bearer ${access}`}});}catch{}
});
load();