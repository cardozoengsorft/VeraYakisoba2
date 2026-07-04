 /* ── LOADER ── */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2000);
  });

  /* ── MOBILE MENU ── */
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => observer.observe(r));

  /* ── MENU FILTER ── */
  function filterMenu(cat, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.menu-card').forEach(card => {
      if (cat === 'todos' || card.dataset.cat === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ── LIGHTBOX ── */
  /*function openLightbox(imagen, name) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-content').innerHTML =
      `<div style="font-size:8rem;">${imagen}</div><p style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:2px;color:#F5C518;margin-top:1rem;">${name}</p>`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  } */
 function openLightbox(urlImagem, name) {
  const lb = document.getElementById('lightbox');
  
  // Aqui trocamos a div de texto por uma tag <img> real
  document.getElementById('lightbox-content').innerHTML = `
    <img src="${urlImagem}" alt="${name}" class="lightbox-img">
    <p style="font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:2px;color:#F5C518;margin-top:1rem; text-align: center;">${name}</p>
  `;
  
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  /* ── CLOSE NAV ON LINK CLICK (mobile) ── */
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  }));

  /* ── NAV SCROLL STYLE ── */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) nav.style.background = 'rgba(13,13,13,.97)';
    else nav.style.background = 'rgba(13,13,13,.85)';
  });

  /* ── REDUCED MOTION ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
    });
  }

/* ============================================================
   CARRINHO FLUTUANTE — VERA YAKISSOBA
   (bloco adicionado — não modifica nenhuma função acima)
   ============================================================ */
(function(){
  "use strict";

  const CART_WHATSAPP_NUMBER = "5581984088017";
  // ⚠️ Preencha o endereço real de retirada da Vera Yakissoba
  const CART_ENDERECO_RETIRADA = "Rua Prof. José Amarino dos Reis, 37.";

  let cart = [];
  let uidSeq = 1;

  function cartMoney(v){
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  function cartTotal(){ return cart.reduce((s, it) => s + it.price * it.qty, 0); }
  function cartCount(){ return cart.reduce((s, it) => s + it.qty, 0); }

  // API pública — usada pelos botões "Adicionar ao carrinho"
  window.addToCart = function(name, price, unit){
    unit = unit || "";
    const existing = cart.find(it => it.name === name && it.price === price);
    if (existing) existing.qty += 1;
    else cart.push({ id: uidSeq++, name, price, unit, qty: 1 });
    cartRenderBadge();
    cartRenderBody();
    cartOpen(); // abre o carrinho ao adicionar, pra dar feedback imediato
  };

  function cartChangeQty(id, delta){
    const it = cart.find(i => i.id === id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(i => i.id !== id);
    cartRenderBadge();
    cartRenderBody();
  }
  function cartRemoveItem(id){
    cart = cart.filter(i => i.id !== id);
    cartRenderBadge();
    cartRenderBody();
  }

  const cartForm = {
    nome: "", entrega: "retirada", endereco: "", pagamento: "dinheiro", observacoes: ""
  };

  const cartFabBtn = document.getElementById('cartFabBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlayEl = document.getElementById('cartOverlay');
  const cartPanelEl = document.getElementById('cartPanel');
  const cartBadgeEl = document.getElementById('cartBadge');
  const cartPanelBodyEl = document.getElementById('cartPanelBody');
  const cartTotalValEl = document.getElementById('cartTotalVal');
  const cartFinishBtn = document.getElementById('cartFinishBtn');
  const cartErrorMsgEl = document.getElementById('cartErrorMsg');

  function cartOpen(){
    cartOverlayEl.classList.add('cart-open');
    cartPanelEl.classList.add('cart-open');
  }
  function cartClose(){
    cartOverlayEl.classList.remove('cart-open');
    cartPanelEl.classList.remove('cart-open');
  }
  cartFabBtn.addEventListener('click', () => {
    cartPanelEl.classList.contains('cart-open') ? cartClose() : cartOpen();
  });
  cartCloseBtn.addEventListener('click', cartClose);
  cartOverlayEl.addEventListener('click', cartClose);

  function cartRenderBadge(){
    const n = cartCount();
    cartBadgeEl.textContent = n;
    cartBadgeEl.classList.toggle('cart-show', n > 0);
  }

  function cartEscapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function cartRenderBody(){
    cartTotalValEl.textContent = cartMoney(cartTotal());
    cartErrorMsgEl.classList.remove('cart-show');

    if (cart.length === 0){
      cartPanelBodyEl.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div>Sua comanda está vazia.<br>Adicione um prato pra começar!</div>
        </div>`;
      return;
    }

    let itemsHtml = cart.map(it => `
      <div class="cart-item-row" data-id="${it.id}">
        <div>
          <div class="cart-item-name">${cartEscapeHtml(it.name)}</div>
          ${it.unit ? `<div class="cart-item-unit">${cartEscapeHtml(it.unit)}</div>` : ""}
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn" data-action="dec" data-id="${it.id}">−</button>
            <span class="cart-qty-val">${it.qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${it.id}">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-subtotal">${cartMoney(it.price * it.qty)}</span>
          <button class="cart-remove-btn" data-action="remove" data-id="${it.id}">remover</button>
        </div>
      </div>
    `).join("");

    const enderecoRetiradaHtml = cartForm.entrega === 'retirada'
      ? `<div class="cart-field"><label>Endereço para retirada</label>
           <input type="text" value="${cartEscapeHtml(CART_ENDERECO_RETIRADA)}" disabled></div>`
      : "";

    cartPanelBodyEl.innerHTML = `
      ${itemsHtml}
      <div class="cart-section">
        <div class="cart-section-title">Seus dados</div>
        <div class="cart-field">
          <label for="cartNome">Nome</label>
          <input type="text" id="cartNome" placeholder="Como podemos te chamar?" value="${cartEscapeHtml(cartForm.nome)}">
        </div>
        <div class="cart-field">
          <label>Tipo de entrega</label>
          <div class="cart-radio-group">
            <div class="cart-radio-opt ${cartForm.entrega==='retirada'?'cart-active':''}" data-entrega="retirada">Retirada</div>
            <div class="cart-radio-opt ${cartForm.entrega==='entrega'?'cart-active':''}" data-entrega="entrega">Entrega</div>
          </div>
        </div>
        ${enderecoRetiradaHtml}
        <div class="cart-addr-wrap ${cartForm.entrega==='entrega' ? 'cart-show':''}">
          <div class="cart-field">
            <label for="cartEndereco">Endereço de entrega</label>
            <input type="text" id="cartEndereco" placeholder="Rua, número, bairro, ponto de referência" value="${cartEscapeHtml(cartForm.endereco)}">
          </div>
        </div>
        <div class="cart-field">
          <label for="cartPagamento">Forma de pagamento</label>
          <select id="cartPagamento">
            <option value="dinheiro" ${cartForm.pagamento==='dinheiro'?'selected':''}>Dinheiro</option>
            <option value="cartao" ${cartForm.pagamento==='cartao'?'selected':''}>Cartão (na entrega/retirada)</option>
            <option value="pix" ${cartForm.pagamento==='pix'?'selected':''}>Pix</option>
          </select>
        </div>
        <div class="cart-field">
          <label for="cartObs">Observações</label>
          <textarea id="cartObs" placeholder="Ex: sem cebola, ponto do molho, troco para R$ 50...">${cartEscapeHtml(cartForm.observacoes)}</textarea>
        </div>
      </div>
    `;

    cartPanelBodyEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        if (action === 'inc') cartChangeQty(id, 1);
        if (action === 'dec') cartChangeQty(id, -1);
        if (action === 'remove') cartRemoveItem(id);
      });
    });

    document.getElementById('cartNome').addEventListener('input', e => cartForm.nome = e.target.value);
    cartPanelBodyEl.querySelectorAll('[data-entrega]').forEach(opt => {
      opt.addEventListener('click', () => {
        cartForm.entrega = opt.dataset.entrega;
        cartRenderBody();
      });
    });
    const cartEnderecoInput = document.getElementById('cartEndereco');
    if (cartEnderecoInput) cartEnderecoInput.addEventListener('input', e => cartForm.endereco = e.target.value);
    document.getElementById('cartPagamento').addEventListener('change', e => cartForm.pagamento = e.target.value);
    document.getElementById('cartObs').addEventListener('input', e => cartForm.observacoes = e.target.value);
  }

  function cartShowError(msg){
    cartErrorMsgEl.textContent = msg;
    cartErrorMsgEl.classList.add('cart-show');
  }

  cartFinishBtn.addEventListener('click', () => {
    if (cart.length === 0){
      cartShowError("Adicione ao menos um item antes de finalizar o pedido.");
      return;
    }
    if (!cartForm.nome.trim()){
      cartShowError("Por favor, informe seu nome.");
      document.getElementById('cartNome')?.focus();
      return;
    }
    if (cartForm.entrega === 'entrega' && !cartForm.endereco.trim()){
      cartShowError("Por favor, informe o endereço de entrega.");
      document.getElementById('cartEndereco')?.focus();
      return;
    }
    const message = cartBuildWhatsAppMessage();
    const url = `https://wa.me/${CART_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });

  function cartBuildWhatsAppMessage(){
    const pagamentoLabel = { dinheiro: "Dinheiro", cartao: "Cartão (na entrega/retirada)", pix: "Pix" }[cartForm.pagamento];
    const entregaLabel = cartForm.entrega === 'retirada' ? "Retirada no local" : "Entrega";

    let linhas = [];
    linhas.push("🍜 *NOVO PEDIDO — VERA YAKISSOBA*");
    linhas.push("");
    linhas.push(`*Cliente:* ${cartForm.nome}`);
    linhas.push("");
    linhas.push("*Itens:*");
    cart.forEach(it => linhas.push(`• ${it.qty}x ${it.name} — ${cartMoney(it.price * it.qty)}`));
    linhas.push("");
    linhas.push(`*Total: ${cartMoney(cartTotal())}*`);
    linhas.push("");
    linhas.push(`*Entrega:* ${entregaLabel}`);
    if (cartForm.entrega === 'retirada') linhas.push(`*Endereço para retirada:* ${CART_ENDERECO_RETIRADA}`);
    else linhas.push(`*Endereço:* ${cartForm.endereco}`);
    linhas.push(`*Pagamento:* ${pagamentoLabel}`);
    if (cartForm.observacoes.trim()){
      linhas.push("");
      linhas.push(`*Observações:* ${cartForm.observacoes}`);
    }
    linhas.push("");
    linhas.push("_Pedido gerado pelo site da Vera Yakissoba_");
    return linhas.join("\n");
  }

  // conecta os botões "Adicionar ao carrinho" já existentes no HTML
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      window.addToCart(btn.dataset.name, Number(btn.dataset.price), btn.dataset.unit || "");
    });
  });

  cartRenderBadge();
  cartRenderBody();
})();
