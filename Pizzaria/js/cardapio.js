const SABORES = [
  'Calabresa','Mussarela','Frango c/ Catupiry','Portuguesa','Marguerita',
  'Quatro Queijos','Pepperoni','Bacon','Napolitana','Brigadeiro'
];

/* ----------------- CART (conserto principal) ----------------- */
const CART_KEY = 'pizzaria_cart_v1';

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(e){ return []; } }
function setCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); return items; }
function cartTotal(items){ return (items||[]).reduce((s,i)=> s+(i.price*(i.qty||1)),0); }
function renderCartBadge(){
  const items = getCart();
  const count = items.reduce((s,i)=> s + (i.qty||1), 0);
  const total = cartTotal(items);
  const elCount = document.getElementById('cartCount');
  const elItems = document.getElementById('cartItems');
  const elTotal = document.getElementById('cartTotal');
  if(elCount) elCount.textContent = count;
  if(elItems) elItems.textContent = count;
  if(elTotal) elTotal.textContent = total.toFixed(2).replace('.', ',');
}

// >>> Define o objeto cart usado pelo botão de pizzas
window.cart = {
  add(item){
    const cart = getCart();
    // normaliza estrutura
    const newItem = {
      sku: item.sku,
      name: item.name,
      price: Number(item.price),
      qty: item.qty ? Number(item.qty) : 1,
      image: item.image || null
    };
    const i = cart.findIndex(x=> x.sku === newItem.sku && x.name === newItem.name);
    if(i >= 0){
      cart[i].qty = (cart[i].qty||1) + newItem.qty;
    }else{
      cart.push(newItem);
    }
    setCart(cart);
    renderCartBadge();
  },
  items: getCart,
  set: setCart,
  total: ()=> cartTotal(getCart())
};
/* ------------------------------------------------------------- */

/* ----------- Painel de sabores das pizzas ----------- */
function buildFlavorPanel(panel){
  const max = Number(panel.dataset.max);
  const size = panel.dataset.size;
  const price = Number(panel.dataset.price);

  const grid = document.createElement('div');
  grid.className = 'flavors-grid';
  SABORES.forEach(s=>{
    const lb = document.createElement('label');
    lb.innerHTML = `<input type="checkbox" value="${s}"> <span>${s}</span>`;
    grid.appendChild(lb);
  });

  const msg = document.createElement('p');
  msg.className = 'meta';
  msg.textContent = `Escolha até ${max} sabor(es).`;

  const actions = document.createElement('div');
  actions.className = 'flavors-actions';

  const btnClear = document.createElement('button');
  btnClear.type = 'button';
  btnClear.className = 'btn';
  btnClear.textContent = 'Limpar';
  btnClear.addEventListener('click', ()=>{
    grid.querySelectorAll('input[type="checkbox"]').forEach(c=> c.checked=false)
  });

  const btnAdd = document.createElement('button');
  btnAdd.type = 'button';
  btnAdd.className = 'btn primary';
  btnAdd.textContent = 'Adicionar ao carrinho';
  btnAdd.addEventListener('click', ()=>{
    const selected = Array.from(grid.querySelectorAll('input:checked')).map(i=>i.value);
    if(selected.length === 0) return alert('Escolha pelo menos 1 sabor.');
    if(selected.length > max)  return alert(`Você pode escolher no máximo ${max} sabor(es).`);
    window.cart.add({
      sku: `pizza_${size.toLowerCase()}`,
      name: `Pizza ${size} (${selected.join(' / ')})`,
      price
    });
    // fecha o painel
    panel.style.display = 'none';
    // feedback
    alert('Pizza adicionada ao carrinho!');
  });

  actions.append(btnClear, btnAdd);
  panel.replaceChildren(msg, grid, actions);
  panel.dataset.ready = '1';
}

document.querySelectorAll('[data-open-flavors]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-panel');
    const panel = document.getElementById(`panel-${id}`);
    if(!panel.dataset.ready) buildFlavorPanel(panel);
    // alterna visibilidade tipo “acordeão”
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ----------- Adicionar itens simples (bebidas) ----------- */
document.querySelectorAll('[data-add]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const item = JSON.parse(btn.getAttribute('data-add'));
    window.cart.add(item);

    // feedback rápido
    const original = btn.textContent;
    btn.textContent = 'Adicionado!';
    setTimeout(()=> btn.textContent = original, 900);
  });
});

/* ----------- Ver carrinho e badge ----------- */
const btnVerCarrinho = document.querySelector('footer.cartbar a.btn.primary[href="carrinho.html"]');
if(btnVerCarrinho){
  btnVerCarrinho.addEventListener('click', (e)=>{
    const items = getCart();
    if(!items.length){
      e.preventDefault();
      alert('Seu carrinho está vazio.');
    }
  });
}

localStorage.getItem('pizzaria_cart_v1')

// contador inicial
renderCartBadge();

