// js/carrinho.js
console.log('[carrinho.js] carregado. origin =', location.origin);

const CART_KEY = 'pizzaria_cart_v1';

function getCart(){
  try {
    const raw = localStorage.getItem(CART_KEY);
    console.log('[carrinho.js] lido do localStorage:', raw);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('[carrinho.js] erro ao parsear carrinho:', e);
    return [];
  }
}
function setCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return items;
}
function cartTotal(items){
  return (items||[]).reduce((s,i)=> s + (Number(i.price) * (i.qty||1)), 0);
}
function money(v){
  return Number(v).toFixed(2).replace('.', ',');
}

const elEmpty  = document.getElementById('cartEmpty');
const elFilled = document.getElementById('cartFilled');
const elList   = document.getElementById('cartList');
const elSum    = document.getElementById('sumTotal');

function render(){
  const cart = getCart();
  console.log('[carrinho.js] render() com itens:', cart);

  if (!cart.length){
    elEmpty.hidden  = false;
    elFilled.hidden = true;
    return;
  }
  elEmpty.hidden  = true;
  elFilled.hidden = false;

  elList.innerHTML = '';
  cart.forEach((it, idx) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      ${it.image ? `<img class="thumb" src="${it.image}" alt="${it.name}">` : `<div class="thumb" style="background:#f1f5f9"></div>`}
      <div class="info">
        <div class="name">${it.name}</div>
        <div class="meta">Qtd:
          <button class="qbtn" data-idx="${idx}" data-act="-">–</button>
          <span class="qtd">${it.qty||1}</span>
          <button class="qbtn" data-idx="${idx}" data-act="+">+</button>
        </div>
      </div>
      <div class="price">R$ ${money(Number(it.price) * (it.qty||1))}</div>
      <button class="remove" data-remove="${idx}">remover</button>
    `;
    elList.appendChild(row);
  });

  elSum.textContent = money(cartTotal(cart));
}

// eventos
elList?.addEventListener('click', (e)=>{
  const t = e.target;
  const cart = getCart();

  if (t.matches('[data-remove]')){
    const i = Number(t.getAttribute('data-remove'));
    cart.splice(i,1);
    setCart(cart); render();
  }
  if (t.matches('.qbtn')){
    const i = Number(t.getAttribute('data-idx'));
    const act = t.getAttribute('data-act');
    const curr = cart[i];
    curr.qty = Math.max(1, (curr.qty||1) + (act==='+'?1:-1));
    setCart(cart); render();
  }
});

document.getElementById('clearCart')?.addEventListener('click', ()=>{
  if (confirm('Deseja limpar o carrinho?')){ setCart([]); render(); }
});

document.getElementById('goCheckout')?.addEventListener('click', (e)=>{
  if (!getCart().length){ e.preventDefault(); alert('Seu carrinho está vazio.'); }
});

// telefone do WhatsApp da pizzaria (com DDI e DDD, só dígitos)
const WHATSAPP_TO = '55429988892838'; // <— troque pelo seu número

function fmtMoneyBR(v){ return Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

function buildWhatsappText(cart){
  const total = cartTotal(cart);
  const linhas = [];

  linhas.push('🧾 *Resumo do Pedido*');
  linhas.push('');

  cart.forEach((it, i)=>{
    const qty = it.qty || 1;
    const subtotal = Number(it.price) * qty;
    linhas.push(`${i+1}. ${it.name}  x${qty}  — ${fmtMoneyBR(subtotal)}`);
  });

  linhas.push('');
  linhas.push(`*Total:* ${fmtMoneyBR(total)}`);

  // campos opcionais do checkout
  const nameEl = document.getElementById('custName');
  const addrEl = document.getElementById('custAddr');
  const obsEl  = document.getElementById('custObs');

  const nome = nameEl?.value?.trim();
  const addr = addrEl?.value?.trim();
  const obs  = obsEl?.value?.trim();

  if (nome) { linhas.push(''); linhas.push(`👤 *Nome:* ${nome}`); }
  if (addr) { linhas.push(`📍 *Endereço:* ${addr}`); }
  if (obs)  { linhas.push(`📝 *Obs.:* ${obs}`); }

  linhas.push('');
  linhas.push('Por favor, confirme o pedido. 🙌');

  return linhas.join('\n');
}

document.getElementById('goCheckout')?.addEventListener('click', (e)=>{
  e.preventDefault();

  const cart = getCart();
  if (!cart.length){
    alert('Seu carrinho está vazio.');
    return;
  }

  const msg = buildWhatsappText(cart);
  const url = `https://wa.me/${WHATSAPP_TO}?text=${encodeURIComponent(msg)}`;

  // Abre o WhatsApp (Web ou app)
  window.open(url, '_blank');

  // Se quiser limpar o carrinho após abrir o WhatsApp, descomente:
  // setCart([]); render();
});
