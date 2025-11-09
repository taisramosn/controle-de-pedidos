// main.js — scripts globais (pode expandir depois)
document.addEventListener('click', (e)=>{
  // Tabs simples
  const t = e.target.closest('.tab');
  if(!t) return;
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  const target = t.getAttribute('data-target');
  document.querySelectorAll('main .section').forEach(sec=>{
    sec.style.display = (sec.id && '#'+sec.id === target) ? 'block' : 'none';
  });
});
// estado inicial das seções
window.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('main .section').forEach((sec,i)=>{
    sec.style.display = i===0 ? 'block' : 'none';
  });
});
