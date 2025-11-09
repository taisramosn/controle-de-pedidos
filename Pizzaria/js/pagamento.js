(function(){
  // Voltar
  const back = document.getElementById('btnBack');
  if(back) back.addEventListener('click', ()=> history.back());

  // CEP
  if(window.setupCEP) window.setupCEP();

  // Blocos/controles
  const blkEndereco  = document.getElementById('blkEndereco');
  const blkPagamento = document.querySelector('section.blk[data-pagamento]') || document.querySelectorAll('section.blk')[2];
  const radiosEntrega = document.querySelectorAll('input[name="tipoEntrega"]');
  const radiosPgto    = document.querySelectorAll('input[name="pgto"]');
  const blkTroco      = document.getElementById('blkTroco');
  const btnFinalizar  = document.getElementById('btnFinalizar');

  const reqIds = ['cep','logradouro','numero','bairro','cidade','uf'];

  function enderecoValido(){
    const modo = document.querySelector('input[name="tipoEntrega"]:checked').value;
    if(modo === 'retirada') return true;
    return reqIds.every(id => (document.getElementById(id).value||'').trim().length>0);
  }
  function togglePagamento(){
    const ok = enderecoValido();
    blkPagamento?.setAttribute('data-ready', ok ? '1' : '0');
    btnFinalizar.disabled = !ok || !document.querySelector('input[name="pgto"]:checked');
  }
  function syncEntrega(){
    const val = document.querySelector('input[name="tipoEntrega"]:checked').value;
    blkEndereco.style.display = (val === 'delivery') ? 'block' : 'none';
    togglePagamento();
  }
  function syncPgto(){
    const val = document.querySelector('input[name="pgto"]:checked')?.value;
    blkTroco.classList.toggle('hidden', val !== 'dinheiro');
    togglePagamento();
  }

  // Eventos
  radiosEntrega.forEach(r=> r.addEventListener('change', syncEntrega));
  radiosPgto.forEach(r=> r.addEventListener('change', syncPgto));
  reqIds.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', togglePagamento);
  });
  document.addEventListener('endereco:ok',  togglePagamento);
  document.addEventListener('endereco:fail', togglePagamento);

  // Inicial
  syncEntrega(); syncPgto(); togglePagamento();

  // Finalizar
  btnFinalizar.addEventListener('click', ()=>{
    if(!enderecoValido()) return alert('Preencha o endereço (ou selecione Retirar no Local).');
    const entrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
    const pgto    = document.querySelector('input[name="pgto"]:checked').value;

    // Aqui você pode montar o payload para o backend
    // const pedido = { itens: cart.items, total: cart.total(), entrega, endereco: {...}, pgto }

    window.location.href = 'pedido.html';
  });
})();
