// Abas que rolam até a seção
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    const sel = e.currentTarget.getAttribute('data-target');
    const el = document.querySelector(sel);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Adicionar bebidas
document.querySelectorAll('[data-add]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const item = JSON.parse(btn.getAttribute('data-add'));
    window.cart.add(item);
  });
});
