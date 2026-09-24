(function () {
  const source = window.SENSES_CATALOG_SOURCE;
  const reader = document.querySelector('#catalog-reader');
  const toc = document.querySelector('#catalog-toc');
  const mobileToc = document.querySelector('#catalog-mobile-toc');
  if (!source || !reader || !toc || !mobileToc) return;

  const chapterNames = [
    ['one', 'Welcome to Senses Yoga School'], ['two', 'Mission, Vision & Educational Philosophy'],
    ['three', 'The Educational Model'], ['four', "The Learner's Journey"],
    ['five', 'The Heroic Yogi Apprenticeship'], ['six', 'The Six Learning Environments'],
    ['seven', 'The Schools of Practice'], ['eight', 'School of Community & Professional Wellness'],
    ['nine', 'School of Ecology'], ['ten', 'School of Specialized Studies'],
    ['eleven', 'School of Nāṭyaśāstra & Creative Arts'], ['twelve', 'The Community Learning Ecosystem'],
    ['thirteen', 'The Life of the Ecosystem'], ['fourteen', 'The Annual Learning Ecosystem'],
    ['fifteen', 'Leadership Formation & Communal Stewardship'], ['sixteen', 'Entering the Educational Community']
  ];
  const indexByName = Object.fromEntries(chapterNames.map(([key], index) => [key, index]));
  const slug = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const headings = new Set([
    'Welcome', 'Mission', 'Vision', 'Educational Philosophy', 'Introduction', 'Practice', 'Study', 'Language',
    'Reflection', 'Identity', 'Service', 'Admissions', 'Leadership as Formation', 'A Community of Practice',
    'Education Through Partnership', 'One Practice. Many Places. One Community.', 'The Meaning of "Heroic"'
  ]);
  function paragraphs(text) {
    return text.trim().split(/\n\s*\n+/).map(block => block.trim()).filter(Boolean).map(block => {
      const clean = block.replace(/\n+/g, ' ').trim();
      if (/^_______________+$/.test(clean)) return '<hr class="catalog-rule">';
      if (headings.has(clean) || (/^[A-Z][A-Za-zĀāĪīŪūṚṛṂṃṄṅÑñṬṭḌḍṆṇŚśṢṣ\-–—&'’ ]{2,78}$/.test(clean) && !/[.!?]$/.test(clean))) return '<h3>' + escape(clean) + '</h3>';
      if (/^(•|–|—|\d+[.)])\s/.test(clean)) return '<p class="catalog-list-item">' + escape(clean) + '</p>';
      return '<p>' + escape(clean) + '</p>';
    }).join('');
  }
  const chapterPattern = /^Chapter (One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen)\s*$/gm;
  const matches = [...source.matchAll(chapterPattern)];
  const conclusionStart = source.search(/^Conclusion\s*$/m);
  const firstChapter = matches[0]?.index ?? 0;
  const preface = source.slice(0, firstChapter).replace(/^Contents[\s\S]*?(?=Chapter One\s*$)/m, '').trim();
  const chapters = matches.map((match, index) => {
    const key = match[1].toLowerCase();
    const end = index + 1 < matches.length ? matches[index + 1].index : (conclusionStart > -1 ? conclusionStart : source.length);
    const blocks = source.slice(match.index, end).trim().split(/\n\s*\n+/);
    const firstLines = blocks.shift().split('\n').map(line => line.trim()).filter(Boolean);
    const title = firstLines[1] || chapterNames[indexByName[key]][1];
    const content = blocks.join('\n\n');
    const guidingMatch = content.match(/^Guiding Principle\s*\n([\s\S]*?)(?=\n\s*\n|$)/);
    const body = guidingMatch ? content.slice(guidingMatch[0].length).trim() : content;
    return { key, title, guiding: guidingMatch?.[1]?.trim(), body };
  });
  const conclusion = conclusionStart > -1 ? source.slice(conclusionStart).replace(/^Conclusion\s*\n?/,'').trim() : '';

  const makeLink = (chapter, index) => '<a href="#chapter-' + chapter.key + '"><span>' + String(index + 1).padStart(2, '0') + '</span>' + escape(chapter.title) + '</a>';
  toc.innerHTML = chapters.map(makeLink).join('') + '<a href="#catalog-conclusion"><span>∞</span>Conclusion</a>';
  mobileToc.innerHTML = chapters.map(makeLink).join('') + '<a href="#catalog-conclusion"><span>∞</span>Conclusion</a>';

  reader.innerHTML = '<section class="catalog-preface"><div class="eyebrow">A developing public record</div><p class="lead">This catalog is shared as the School’s journey unfolds: we grow when we all grow, and our community is our campus. Present offerings, pilots, developing work, and past field tests are named as such in the source text.</p><details><summary>Opening acknowledgments &amp; image index</summary><div class="catalog-source-text">' + paragraphs(preface) + '</div></details></section>' +
    chapters.map((chapter, index) => {
      const previous = chapters[index - 1];
      const next = chapters[index + 1];
      return '<section class="catalog-chapter" id="chapter-' + chapter.key + '">' +
        '<p class="catalog-number">Chapter ' + String(index + 1).padStart(2, '0') + '</p><h2>' + escape(chapter.title) + '</h2>' +
        (chapter.guiding ? '<blockquote class="catalog-guiding"><span>Guiding Principle</span>' + escape(chapter.guiding) + '</blockquote>' : '') +
        '<div class="catalog-source-text">' + paragraphs(chapter.body) + '</div>' +
        '<nav class="catalog-pager" aria-label="Chapter navigation">' +
        (previous ? '<a href="#chapter-' + previous.key + '">← ' + escape(previous.title) + '</a>' : '<span></span>') +
        (next ? '<a href="#chapter-' + next.key + '">' + escape(next.title) + ' →</a>' : '<a href="#catalog-conclusion">Conclusion →</a>') +
        '</nav></section>';
    }).join('') +
    '<section class="catalog-chapter catalog-conclusion" id="catalog-conclusion"><p class="catalog-number">Conclusion</p><h2>A living educational community.</h2><div class="catalog-source-text">' + paragraphs(conclusion) + '</div><a class="catalog-back" href="#catalog-toc">Return to contents ↑</a></section>';

  const links = [...document.querySelectorAll('#catalog-toc a')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => link.removeAttribute('aria-current'));
    const active = document.querySelector('#catalog-toc a[href="#' + visible.target.id + '"]');
    active?.setAttribute('aria-current', 'location');
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .2, .6] });
  document.querySelectorAll('.catalog-chapter').forEach(section => observer.observe(section));
}());
