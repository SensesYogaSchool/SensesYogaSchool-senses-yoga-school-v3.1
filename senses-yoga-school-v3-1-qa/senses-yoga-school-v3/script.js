const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

const honorGate = document.querySelector('#honor-gate');
const honorOrb = document.querySelector('#honor-orb');
const honorText = document.querySelector('#honor-text');
const honorEnter = document.querySelector('#honor-enter');

if (honorGate && honorOrb && honorText && honorEnter) {
  document.body.classList.add('honor-open');
  honorOrb.focus();

  honorOrb.addEventListener('click', () => {
    honorText.hidden = false;
    honorGate.classList.add('revealed');
    honorOrb.setAttribute('aria-expanded', 'true');
    honorText.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  honorEnter.addEventListener('click', () => {
    honorGate.classList.add('departing');
    document.body.classList.remove('honor-open');
    window.setTimeout(() => {
      honorGate.hidden = true;
      document.querySelector('header a, main a, main button')?.focus();
    }, 520);
  });
}

const livingSources = [
  {
    image: 'assets/hatha-pradipika-manuscript.webp',
    alt: 'A nineteenth-century manuscript copy of the Hatha Yoga Pradipika',
    title: 'Haṭha Yoga Pradīpikā',
    text: 'A manuscript witness to the wider discipline of Haṭha Yoga: posture, breath, mudrā, concentration, preparation, and liberation.',
    source: 'https://commons.wikimedia.org/wiki/File:19th_century_manuscript_copy,_15th_century_Hatha_yoga_pradipika,_Schoyen_Collection_Norway.jpg',
    credit: 'Ms Sarah Welch · CC BY-SA 4.0'
  },
  {
    image: 'assets/bhagavad-gita-manuscript.webp',
    alt: 'A sixteenth-century Sanskrit Bhagavad Gita palm-leaf manuscript from Kerala',
    title: 'Bhagavad Gītā',
    text: 'A palm-leaf record of an enduring dialogue on action, devotion, knowledge, discernment, and responsibility.',
    source: 'https://commons.wikimedia.org/wiki/File:16th_century_Bhagavad_Gita_palm_leaf_manuscript,_Sanskrit,_Malayalam_script,_Kerala.jpg',
    credit: 'Ms Sarah Welch · CC BY-SA 4.0'
  },
  {
    image: 'assets/patanjali-yogabhasya-manuscript.webp',
    alt: 'Sanskrit Devanagari manuscript pages from Patanjali’s Yogabhasya',
    title: 'Pātañjalayogaśāstra',
    text: 'Text and commentary preserve a disciplined inquiry into practice, attention, transformation, and freedom.',
    source: 'https://commons.wikimedia.org/wiki/File:Patanjali%27s_Yogabhasya,_Sanskrit,_Devanagari_script,_sample_pages.jpg',
    credit: 'Ms Sarah Welch · CC BY-SA 4.0'
  }
];

const sourceByPage = {
  'index.html': 0,
  'practice.html': 0,
  'learn.html': 2,
  'schools.html': 1,
  'serve.html': 1,
  'lead.html': 2,
  'partner.html': 1,
  'impact.html': 1,
  'about.html': 2,
  'calendar.html': 2,
  'support.html': 0,
  'field-notes.html': 0
};

const pageName = window.location.pathname.split('/').pop() || 'index.html';
const footer = document.querySelector('footer');
const sourceIndex = sourceByPage[pageName];

if (footer && sourceIndex !== undefined) {
  const source = livingSources[sourceIndex];
  const section = document.createElement('section');
  section.className = 'living-source';
  section.setAttribute('aria-label', 'A source from the living library');
  section.innerHTML = `
    <div class="wrap living-source-grid">
      <figure>
        <img src="${source.image}" alt="${source.alt}" loading="lazy" decoding="async">
      </figure>
      <div>
        <div class="eyebrow">From the Living Library</div>
        <h2>${source.title}</h2>
        <p class="lead">${source.text}</p>
        <p class="source-credit"><a href="${source.source}" target="_blank" rel="noopener">Manuscript image source</a> · ${source.credit}</p>
        <p class="source-principle">The texts are not scenery. They are invitations to careful study, practice, comparison, and responsible interpretation.</p>
      </div>
    </div>`;
  footer.before(section);
}
