// pizzas.js — cardápio funcional (abre sabores e adiciona itens)
window.addEventListener("DOMContentLoaded", () => {
  const SABORES = [
    "Calabresa",
    "Mussarela",
    "Frango c/ Catupiry",
    "Portuguesa",
    "Marguerita",
    "Quatro Queijos",
    "Pepperoni",
    "Bacon",
    "Napolitana",
    "Brigadeiro"
  ];

  /* ---------- CARRINHO ---------- */
  const CART_KEY = "pizzaria_cart_v1";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    return items;
  }

  function renderCartBadge() {
    const items = getCart();
    const count = items.reduce((s, i) => s + (i.qty || 1), 0);
    const total = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
    document.getElementById("cartCount")?.textContent = count;
    document.getElementById("cartItems")?.textContent = count;
    document.getElementById("cartTotal")?.textContent = total
      .toFixed(2)
      .replace(".", ",");
  }

  const cart = {
    add(item) {
      const items = getCart();
      const i = items.findIndex(
        (x) => x.sku === item.sku && x.name === item.name
      );
      if (i >= 0) items[i].qty += item.qty || 1;
      else items.push({ ...item, qty: 1 });
      setCart(items);
      renderCartBadge();
    }
  };
  window.cart = cart;

  renderCartBadge();

  /* ---------- FUNÇÃO DE FEEDBACK ---------- */
  function showFeedback(el, msg = "✅ Adicionado ao carrinho!") {
    const note = document.createElement("div");
    note.textContent = msg;
    note.style.cssText =
      "margin-top:4px;font-size:.85rem;color:#16a34a;font-weight:600;";
    el.insertAdjacentElement("afterend", note);
    setTimeout(() => note.remove(), 1500);
  }

  /* ---------- BEBIDAS ---------- */
  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = JSON.parse(btn.dataset.add);
      cart.add(item);
      showFeedback(btn);
    });
  });

  /* ---------- PAINEL DE SABORES ---------- */
  function montarPainel(panel) {
    const max = Number(panel.dataset.max);
    const size = panel.dataset.size;
    const price = Number(panel.dataset.price);

    const msg = document.createElement("p");
    msg.className = "meta";
    msg.textContent = `Escolha até ${max} sabor(es).`;

    const grid = document.createElement("div");
    grid.className = "flavors-grid";
    SABORES.forEach((s) => {
      const lb = document.createElement("label");
      lb.innerHTML = `<input type="checkbox" value="${s}"> <span>${s}</span>`;
      grid.appendChild(lb);
    });

    const actions = document.createElement("div");
    actions.className = "flavors-actions";

    const btnAdd = document.createElement("button");
    btnAdd.className = "btn primary";
    btnAdd.textContent = "Adicionar ao carrinho";

    btnAdd.addEventListener("click", () => {
      const selecionados = Array.from(
        grid.querySelectorAll("input:checked")
      ).map((i) => i.value);

      if (selecionados.length === 0)
        return alert("Escolha pelo menos 1 sabor.");
      if (selecionados.length > max)
        return alert(`Você pode escolher no máximo ${max} sabor(es).`);

      cart.add({
        sku: `pizza_${size.toLowerCase()}`,
        name: `Pizza ${size} (${selecionados.join(" / ")})`,
        price
      });

      showFeedback(btnAdd);
      panel.style.display = "none";
    });

    const btnFechar = document.createElement("button");
    btnFechar.className = "btn";
    btnFechar.textContent = "Fechar";
    btnFechar.addEventListener("click", () => (panel.style.display = "none"));

    actions.append(btnFechar, btnAdd);
    panel.replaceChildren(msg, grid, actions);
    panel.dataset.montado = "1";
  }

  document.querySelectorAll("[data-open-flavors]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const id = botao.dataset.panel;
      const painel = document.getElementById(`panel-${id}`);
      if (!painel.dataset.montado) montarPainel(painel);
      painel.style.display = painel.style.display === "block" ? "none" : "block";
      painel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
