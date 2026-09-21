const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');

if (menu && nav) {
  nav.id ||= 'site-navigation';
  menu.setAttribute('aria-controls', nav.id);
  for (const [href, label] of [['calendar.html', 'Calendar'], ['support.html', 'Support']]) {
    if (!nav.querySelector(`a[href="${href}"]`)) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      link.className = 'mobile-nav-link';
      nav.append(link);
    }
  }
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
  honorGate.setAttribute('aria-label', 'Enter Senses Yoga School');
  const background = [...document.body.children].filter(el => el !== honorGate);
  background.forEach(el => { el.inert = true; });
  honorOrb.focus();

  honorOrb.addEventListener('click', () => {
    honorText.hidden = false;
    honorGate.classList.add('revealed');
    honorGate.removeAttribute('aria-label');
    honorOrb.setAttribute('aria-expanded', 'true');
    honorEnter.focus();
  });

  const enterSchool = () => {
    if (honorGate.classList.contains('departing')) return;
    honorGate.classList.add('departing');
    document.body.classList.remove('honor-open');
    window.setTimeout(() => {
      honorGate.hidden = true;
      background.forEach(el => { el.inert = false; });
      document.querySelector('header a, main a, main button')?.focus();
    }, 520);
  };
  honorEnter.addEventListener('click', enterSchool);
  honorGate.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      enterSchool();
    }
    if (event.key === 'Tab') {
      const controls = honorText.hidden ? [honorOrb] : [honorOrb, honorEnter];
      const current = controls.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        controls.at(-1).focus();
      } else if (!event.shiftKey && current === controls.length - 1) {
        event.preventDefault();
        controls[0].focus();
      }
    }
  });
}

// Photographs from the V3 website archive accompany each page's opening.
// Keep the complete image visible; the illustrations and manuscripts remain in their study sections.
const pagePhotographs = {
  'index.html': {
    image: 'assets/selected-11.jpg',
    alt: 'A large group practicing yoga together outdoors in Milwaukee',
    caption: 'Our community is our campus',
    credit: 'Twisted Muse'
  },
  'practice.html': {
    image: 'assets/selected-08.jpg',
    alt: 'Community members practicing yoga together at Sherman Phoenix',
    caption: 'Yoga For Life in community',
    credit: 'Twisted Muse'
  },
  'learn.html': {
    image: 'assets/selected-07.jpg',
    alt: 'Luan practicing an arm balance in a bright studio',
    caption: 'Embodied inquiry and continuing practice',
    credit: 'Twisted Muse'
  },
  'schools.html': {
    image: 'assets/selected-16.jpg',
    alt: 'A group practicing yoga together in a Milwaukee public space',
    caption: 'Many learning paths meet in community',
    credit: 'Twisted Muse'
  },
  'serve.html': {
    image: 'assets/selected-14.jpg',
    alt: 'Hands tending seedling trays during garden work',
    caption: 'Learning through care for living things',
    credit: 'Twisted Muse'
  },
  'lead.html': {
    image: 'assets/selected-15.jpg',
    alt: 'A teacher guiding participants through yoga practice in a community room',
    caption: 'Teaching grows through practice and relationship',
    credit: 'Twisted Muse'
  },
  'partner.html': {
    image: 'assets/selected-12.jpg',
    alt: 'A group practicing yoga outdoors beside Lake Michigan',
    caption: 'Programs carried into shared spaces',
    credit: 'Twisted Muse'
  },
  'impact.html': {
    image: 'assets/selected-01.jpg',
    alt: 'The garden site at Neighborhood House before YAGI stewardship developed',
    caption: 'A place whose story continues through stewardship',
    credit: 'Twisted Muse'
  },
  'about.html': {
    image: 'assets/selected-02.jpg',
    alt: 'Luan practicing yoga in a sunlit studio',
    caption: 'A school rooted in lived practice',
    credit: 'Twisted Muse'
  },
  'calendar.html': {
    image: 'assets/selected-09.jpg',
    alt: 'A yoga instructor leading an outdoor summer class',
    caption: 'Gather for public practice',
    credit: 'Twisted Muse'
  },
  'support.html': {
    image: 'assets/selected-17.jpg',
    alt: 'A community yoga gathering at Sherman Phoenix',
    caption: 'Community support keeps practice accessible',
    credit: 'Twisted Muse'
  },
  'field-notes.html': {
    image: 'assets/yagi-early-beds.webp',
    alt: 'Early garden beds and materials at the YAGI site',
    caption: 'The site as a living record',
    credit: 'Senses / YAGI archive'
  },
  '404.html': {
    image: 'assets/selected-10.jpg',
    alt: 'A quiet yoga practice in a bright studio',
    caption: 'Return to the living campus',
    credit: 'Twisted Muse'
  }
};

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const pagePhoto = pagePhotographs[currentPage];
const pageOpening = document.querySelector('main > .pagehero, main > .impact-hero, main > .field-hero, main > .heroic-home-hero');
if (pagePhoto && pageOpening) {
  const banner = document.createElement('section');
  banner.className = 'site-photo-section';
  if (currentPage === 'index.html') banner.classList.add('photo-home');
  banner.setAttribute('aria-label', 'Photograph from the Senses Yoga School archive');
  banner.innerHTML = `
    <figure class="site-photo-banner">
      <div class="site-photo-matte">
        <img src="${pagePhoto.image}" alt="${pagePhoto.alt}" loading="eager" fetchpriority="high" decoding="async">
      </div>
      <figcaption><span>${pagePhoto.caption}</span><small>Photography · ${pagePhoto.credit}</small></figcaption>
    </figure>`;
  const breadcrumb = document.querySelector('main > .crumb');
  (breadcrumb || pageOpening).before(banner);
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
