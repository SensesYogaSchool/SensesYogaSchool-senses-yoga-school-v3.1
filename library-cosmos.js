(function(){
  const root=document.querySelector('#celestial-library');
  if(!root)return;
  const map=root.querySelector('#celestial-map');
  const filters=root.querySelector('#constellation-filters');
  const card=root.querySelector('#celestial-card');
  const constellationById={
    'yoga-sutras':'Foundations','hatha':'Foundations','light-on-pranayama':'Foundations',
    'bhagavad-gita':'Epics & Dharma','ramayana':'Epics & Dharma',
    'mandukya':'Consciousness','katha-paramananda':'Consciousness',
    'gospel-ramakrishna':'Devotion','vivekananda-bhakti':'Devotion',
    'nada-bindu':'Sacred Sound & Arts','natya':'Sacred Sound & Arts','sangita-ratnakara':'Sacred Sound & Arts',
    'yagi':'Ecology'
  };
  const labels=['All paths','Foundations','Epics & Dharma','Consciousness','Devotion','Sacred Sound & Arts','Ecology'];
  const accessLabel={'public-domain':'Public domain','open-access':'Open access','copyrighted':'Borrow or purchase','school-created':'School-created'};
  const escape=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let records=[];
  function show(record){
    root.querySelectorAll('.cosmos-node').forEach(node=>node.setAttribute('aria-current',String(node.dataset.id===record.id)));
    card.innerHTML='<span class="catalog-state">'+escape(accessLabel[record.access]||record.status)+'</span>'+
      '<p class="celestial-collection">'+escape(constellationById[record.id]||record.collection)+'</p>'+
      '<h3>'+escape(record.title)+'</h3>'+
      '<p class="celestial-sanskrit" lang="sa">'+escape(record.sanskrit||'')+'</p>'+
      '<p class="celestial-summary">'+escape(record.summary)+'</p>'+
      '<p class="celestial-question">“'+escape(record.question)+'”</p>'+
      '<a class="button" href="'+escape(record.url)+'" target="_blank" rel="noopener">'+escape(record.linkLabel||'Read the text')+' ↗</a>';
  }
  function positionNodes(){
    const nodes=[...map.querySelectorAll('.cosmos-node')];
    nodes.forEach((node,index)=>{
      const inner=index<6;
      const local=inner?index:index-6;
      const count=inner?6:Math.max(nodes.length-6,1);
      const angle=(-90+(360/count)*local+(inner?0:18))*Math.PI/180;
      const radius=inner?27:43;
      node.style.left=(50+Math.cos(angle)*radius)+'%';
      node.style.top=(50+Math.sin(angle)*radius)+'%';
    });
  }
  function filter(name,button){
    filters.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    map.querySelectorAll('.cosmos-node').forEach(node=>node.classList.toggle('is-dim',name!=='All paths'&&node.dataset.constellation!==name));
  }
  fetch('data/library.json?v=20261020-cosmos').then(response=>response.json()).then(data=>{
    records=data.records.filter(record=>record.catalogText);
    labels.forEach((label,index)=>{
      const button=document.createElement('button');
      button.type='button';button.className='constellation-filter';button.textContent=label;
      button.setAttribute('aria-pressed',String(index===0));
      button.addEventListener('click',()=>filter(label,button));filters.appendChild(button);
    });
    records.forEach((record,index)=>{
      const button=document.createElement('button');
      button.type='button';button.className='cosmos-node';button.dataset.id=record.id;
      button.dataset.access=record.access;button.dataset.constellation=constellationById[record.id]||'Foundations';
      button.setAttribute('aria-label',record.title+', '+(accessLabel[record.access]||record.status));
      button.innerHTML='<span>'+escape(record.title)+'</span>';
      button.style.animationDelay=(index*.21)+'s';
      button.addEventListener('click',()=>show(record));map.appendChild(button);
    });
    positionNodes();
    const requested=new URLSearchParams(location.search).get('text');
    show(records.find(record=>record.id===requested)||records.find(record=>record.id==='bhagavad-gita')||records[0]);
  }).catch(()=>{
    card.innerHTML='<h3>The celestial path is resting.</h3><p>The accessible text library remains available below.</p><a class="button" href="#texts">Open the text list</a>';
  });
}());
