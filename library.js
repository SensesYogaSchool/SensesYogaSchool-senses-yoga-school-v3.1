const $=id=>document.getElementById(id);let records=[];const dialog=$('record');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Edition-aware cover presentation. ISBN covers are requested from Open Library;
// where none is documented, a readable title jacket avoids misleading imagery.
function coverMarkup(r){
 const isbn=(r.edition||'').match(/ISBN(?:-1[03])?\s*[:#]?\s*([0-9Xx -]{10,20})/i);
 const code=isbn?isbn[1].replace(/[^0-9Xx]/g,''):'';
 const jacket='<div class="book-title-jacket"><span class="jacket-kicker">Senses Yoga School · Reading Collection</span><strong>'+esc(r.title)+'</strong><small>'+esc(r.collection)+'</small></div>';
 return code?'<div class="book-cover-frame"><img loading="lazy" src="https://covers.openlibrary.org/b/isbn/'+encodeURIComponent(code)+'-L.jpg?default=false" alt="Cover for '+esc(r.title)+'" onerror="this.remove();this.parentElement.classList.add(\'cover-unavailable\')">'+jacket+'</div>':'<div class="book-cover-frame cover-unavailable">'+jacket+'</div>';
}
function render(){const q=$('search').value.trim().toLowerCase(),collection=$('collection').value,access=$('access').value;const shown=records.filter(r=>(collection==='all'||r.collection===collection)&&(access==='all'||(access==='catalog'?r.catalogText:r.access===access))&&[r.title,r.sanskrit,r.summary,...r.tags].join(' ').toLowerCase().includes(q));$('books').innerHTML=shown.map(r=>`<article class="book" id="text-${esc(r.id)}"><img loading="lazy" src="${esc(r.image)}" alt="${esc(r.imageAlt)}"><p class="image-credit">${esc(r.imageCredit)} · <a href="${esc(r.imageSource)}" target="_blank" rel="noopener">Source</a>${r.imageLicense?` · <a href="${esc(r.imageLicense)}" target="_blank" rel="noopener">License</a>`:""}</p><span class="label">${esc(r.collection)}</span><h3>${esc(r.title)}</h3><p lang="sa">${esc(r.sanskrit)}</p><p>${esc(r.summary)}</p><p class="note">${esc(r.status)}</p><div class="book-actions"><button data-record="${esc(r.id)}">Edition details</button><a href="${esc((r.links?.[0]?.url)||r.url)}" target="_blank" rel="noopener">${esc((r.links?.[0]?.label)||r.linkLabel)} ↗</a></div></article>`).join('');$('count').textContent=`${shown.length} of ${records.length} library records`;$('empty').hidden=shown.length!==0;}
function openRecord(id){const r=records.find(r=>r.id===id);if(!r)return;$('record-content').innerHTML=`<div class="record-grid"><img src="${esc(r.image)}" alt="${esc(r.imageAlt)}"><div><p class="eyebrow">${esc(r.collection)}</p><h2>${esc(r.title)}</h2><p lang="sa">${esc(r.sanskrit)}</p><p class="status">${esc(r.status)}</p><p>${esc(r.summary)}</p></div></div><dl class="metadata"><dt>Edition</dt><dd>${esc(r.edition)}</dd><dt>Access & rights</dt><dd>${esc(r.rights)}</dd><dt>Access</dt><dd class="source-links">${(r.links?.length?r.links:[{label:r.linkLabel,url:r.url,type:"Source"}]).map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener"><span>${esc(link.type)}</span>${esc(link.label)} ↗</a>`).join('')}</dd><dt>Curriculum</dt><dd>${esc(r.curriculum)}</dd><dt>Practice question</dt><dd>${esc(r.question)}</dd><dt>Scribing</dt><dd>Name the edition and section. Distinguish the source teaching from your interpretation and observation.</dd><dt>Provenance</dt><dd>${esc(r.provenance)}</dd><dt>Image</dt><dd>${esc(r.imageCaption)} ${esc(r.imageCredit)}. <a href="${esc(r.imageSource)}" target="_blank" rel="noopener">Image source</a>${r.imageLicense?` · <a href="${esc(r.imageLicense)}" target="_blank" rel="noopener">License</a>`:""}. ${esc(r.imageChanges)}</dd></dl>`;dialog.showModal();}
$('search').addEventListener('input',render);$('collection').addEventListener('change',render);$('access').addEventListener('change',render);$('books').addEventListener('click',e=>{const button=e.target.closest('[data-record]');if(button)openRecord(button.dataset.record)});$('close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>{$('search').value=b.dataset.question;$('collection').value='all';render();$('texts').scrollIntoView();$('search').focus({preventScroll:true})}));
fetch('data/library.json?v=20261101-artwork').then(r=>{if(!r.ok)throw Error('Library data unavailable');return r.json()}).then(data=>{records=data.records;[...new Set(records.map(r=>r.collection))].sort().forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;$('collection').append(o)});const params=new URLSearchParams(location.search);const requested=params.get('text');const access=params.get('access');if(access&&[...$('access').options].some(o=>o.value===access))$('access').value=access;if(requested){const record=records.find(r=>r.id===requested);if(record){$('search').value=record.title;}}render();if(requested){requestAnimationFrame(()=>document.querySelector('#text-'+CSS.escape(requested))?.scrollIntoView({behavior:'smooth',block:'center'}));}}).catch(()=>{$('count').textContent='The records could not load. Refresh the page or visit the school’s current resources.'});

/* Original, browser-synthesized ambient space sound: no third-party audio or tracking */
(function(){
 const button=document.getElementById('shelf-audio-toggle'),volume=document.getElementById('shelf-volume');
 if(!button||!volume)return;
 let ctx=null,master=null,oscillators=[],lfo=null;
 function stop(){
  if(master){master.gain.setTargetAtTime(0,ctx.currentTime,.18);}
  const old=ctx;const nodes=oscillators.slice();const mod=lfo;
  oscillators=[];lfo=null;ctx=null;master=null;
  if(old){setTimeout(()=>{nodes.forEach(o=>{try{o.stop()}catch(e){}});try{mod?.stop()}catch(e){}old.close().catch(()=>{})},850);}
  button.textContent='♫ Play ambience';button.setAttribute('aria-pressed','false');
 }
 async function start(){
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext){button.textContent='Audio unsupported';button.disabled=true;return;}
  ctx=new AudioContext();await ctx.resume();
  master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=330;filter.Q.value=.25;filter.connect(master);
  [55,82.41,110,164.81].forEach((frequency,i)=>{
   const oscillator=ctx.createOscillator(),gain=ctx.createGain();
   oscillator.type=i%2?'sine':'triangle';oscillator.frequency.value=frequency;
   gain.gain.value=[.16,.09,.045,.025][i];oscillator.connect(gain);gain.connect(filter);
   oscillator.start();oscillators.push(oscillator);
  });
  lfo=ctx.createOscillator();const depth=ctx.createGain();lfo.frequency.value=.045;depth.gain.value=95;lfo.connect(depth);depth.connect(filter.frequency);lfo.start();
  master.gain.setTargetAtTime(Number(volume.value)/100*.3,ctx.currentTime,.8);
  button.textContent='Ⅱ Pause ambience';button.setAttribute('aria-pressed','true');
 }
 button.addEventListener('click',()=>{if(ctx)stop();else start().catch(()=>{stop();button.textContent='Audio unavailable';});});
 volume.addEventListener('input',()=>{if(ctx&&master)master.gain.setTargetAtTime(Number(volume.value)/100*.3,ctx.currentTime,.05);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&ctx)stop();});
 window.addEventListener('pagehide',()=>{if(ctx)stop();});
}());

/* Visitor-controlled cosmic motion; silent by default and respectful of reduced motion */
(function(){
 const video=document.getElementById('shelf-nebula'),button=document.getElementById('shelf-motion-toggle');
 if(!video||!button)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function stop(){video.pause();button.setAttribute('aria-pressed','false');button.textContent='▶ Play nebula';}
 button.addEventListener('click',async()=>{
  if(!video.paused){stop();return;}
  video.preload='metadata';
  try{await video.play();button.setAttribute('aria-pressed','true');button.textContent='Ⅱ Pause nebula';}
  catch(e){stop();button.textContent='Nebula video unavailable';}
 });
 reduced.addEventListener?.('change',()=>{if(reduced.matches)stop()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener('pagehide',stop);
}());
