const WA = 'https://wa.me/5527997644680';
const cards = [...document.querySelectorAll('.product-card')];
const filters = [...document.querySelectorAll('.filter')];
const search = document.querySelector('#search');
const results = document.querySelector('#results-line');
const empty = document.querySelector('#empty-state');
const selection = new Set();
const selectionBar = document.querySelector('#selection-bar');
const selectionCount = document.querySelector('#selection-count');
const dialog = document.querySelector('#selection-dialog');
const list = document.querySelector('#selection-list');
let activeFilter = 'all';

function refreshCatalog(){
  const q = search.value.trim().toLocaleLowerCase('pt-BR');
  let count = 0;
  cards.forEach(card => {
    const matches = (activeFilter === 'all' || card.dataset.category === activeFilter) && (!q || card.dataset.search.toLocaleLowerCase('pt-BR').includes(q));
    card.hidden = !matches;
    if(matches) count++;
  });
  results.textContent = `${count} ${count === 1 ? 'referência' : 'referências'}`;
  empty.hidden = count !== 0;
}

function updateSelection(){
  selectionCount.textContent = selection.size;
  selectionBar.hidden = selection.size === 0;
  cards.forEach(card => {
    const name = card.querySelector('.ask-item').dataset.name;
    const button = card.querySelector('.select-item');
    const active = selection.has(name);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? '✓' : '＋';
  });
}

filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filters.forEach(filter => { const active = filter === button; filter.classList.toggle('is-active', active); filter.setAttribute('aria-pressed', String(active)); });
  refreshCatalog();
}));
search.addEventListener('input', refreshCatalog);
document.querySelector('#clear-search').addEventListener('click', () => { search.value = ''; refreshCatalog(); search.focus(); });

cards.forEach(card => {
  const name = card.querySelector('.ask-item').dataset.name;
  card.querySelector('.select-item').addEventListener('click', () => { selection.has(name) ? selection.delete(name) : selection.add(name); updateSelection(); });
  card.querySelector('.ask-item').addEventListener('click', () => { window.open(`${WA}?text=${encodeURIComponent(`Oi! Vi a peça “${name}” na vitrine da Senhora NB e queria consultar os detalhes.`)}`, '_blank', 'noopener'); });
});

document.querySelector('#review-selection').addEventListener('click', () => {
  list.replaceChildren();
  [...selection].forEach(name => {
    const item = document.createElement('li');
    const label = document.createElement('span'); label.textContent = name;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'remover'; remove.setAttribute('aria-label', `Remover ${name}`);
    remove.addEventListener('click', () => { selection.delete(name); updateSelection(); item.remove(); if(!selection.size) dialog.close(); });
    item.append(label, remove); list.append(item);
  });
  const message = `Oi! Encontrei estas referências na vitrine da Senhora NB e queria consultar tamanhos, cores, valores e disponibilidade atual:\n${[...selection].map(name => `• ${name}`).join('\n')}`;
  document.querySelector('#send-selection').href = `${WA}?text=${encodeURIComponent(message)}`;
  dialog.showModal();
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) dialog.close(); });
