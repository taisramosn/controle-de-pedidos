// pedido.js
// - Valida e normaliza WhatsApp
// - Salva consentimento no localStorage
// - Opcionalmente bloqueia navegação sem consentimento

(function () {
  const form = document.getElementById('whats-consent');
  const input = document.getElementById('whatsapp');
  const consent = document.getElementById('consent');

  if (!form || !input || !consent) return;

  // Preenchimento inicial com dados salvos (se houver)
  const savedNumber = localStorage.getItem('pedido_whatsapp');
  const savedConsent = localStorage.getItem('pedido_whatsapp_consent') === 'true';

  if (savedNumber) input.value = savedNumber;
  if (savedConsent) consent.checked = true;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validação nativa (required + pattern) e checkbox
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    if (!consent.checked) {
      alert('É necessário concordar para receber mensagens sobre este pedido.');
      return;
    }

    // Normalização para +55DDDNÚMERO
    let digits = input.value.replace(/[^\d]/g, ''); // mantém apenas dígitos

    // Se veio sem país (10 ou 11 dígitos com DDD), adiciona 55
    if (digits.length === 10 || digits.length === 11) {
      digits = '55' + digits;
    }
    // Se ainda não começar com 55, força BR
    if (!digits.startsWith('55')) {
      digits = '55' + digits;
    }

    const normalized = '+' + digits;

    // Persistência local (troque por fetch() para seu backend, se quiser)
    localStorage.setItem('pedido_whatsapp', normalized);
    localStorage.setItem('pedido_whatsapp_consent', 'true');

    // Lock visual
    input.value = normalized;
    input.readOnly = true;
    consent.disabled = true;

    alert('WhatsApp confirmado! Enviaremos mensagens somente sobre este pedido.');
  });
})();

// (Opcional) Bloquear a navegação enquanto não houver consentimento salvo
(function () {
  const menuBtn = document.getElementById('btnMenu');
  const homeBtn = document.getElementById('btnHome');
  const navBtns = [menuBtn, homeBtn].filter(Boolean);

  function hasConsent() {
    return localStorage.getItem('pedido_whatsapp_consent') === 'true';
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (!hasConsent()) {
        e.preventDefault();
        alert('Confirme seu WhatsApp para prosseguir. Usaremos apenas para informações do seu pedido.');
      }
    });
  });
})();
