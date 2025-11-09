// ===== ViaCEP com UX melhorada =====
function maskCEP(v){
  const n = (v||'').replace(/\D/g,'').slice(0,8);
  return n.length > 5 ? `${n.slice(0,5)}-${n.slice(5)}` : n;
}
async function fetchViaCEP(cep){
  const clean = (cep||'').replace(/\D/g,'');
  if(clean.length !== 8) throw new Error('CEP inválido. Digite 8 números.');
  const rsp = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  if(!rsp.ok) throw new Error('Falha ao consultar o ViaCEP.');
  const data = await rsp.json();
  if(data.erro) throw new Error('CEP não encontrado.');
  return data;
}

window.setupCEP = function setupCEP(){
  const $cep = document.getElementById('cep');
  const $btn = document.getElementById('btnCEP');
  const $err = document.getElementById('cepError');
  const $log = document.getElementById('logradouro');
  const $num = document.getElementById('numero');
  const $bai = document.getElementById('bairro');
  const $cid = document.getElementById('cidade');
  const $uf  = document.getElementById('uf');
  if(!$cep || !$btn) return;

  function setLoading(on){
    $cep.classList.toggle('is-loading', on);
    $btn.classList.toggle('is-loading', on);
    $btn.textContent = on ? 'Buscando…' : 'Buscar';
  }
  function setError(msg){ $err.textContent = msg || ''; }

  async function doSearch(){
    setError('');
    setLoading(true);
    try{
      const data = await fetchViaCEP($cep.value);
      $log.value = data.logradouro || '';
      $bai.value = data.bairro || '';
      $cid.value = data.localidade || '';
      $uf.value  = data.uf || '';
      $num.focus();
      document.dispatchEvent(new CustomEvent('endereco:ok')); // libera pagamento
    }catch(e){
      setError(e.message);
      document.dispatchEvent(new CustomEvent('endereco:fail'));
    }finally{
      setLoading(false);
    }
  }

  $cep.addEventListener('input', ()=>{
    $cep.value = maskCEP($cep.value);
    if($cep.value.replace(/\D/g,'').length === 8) doSearch(); // busca automática
  });
  $cep.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') doSearch(); });
  $btn.addEventListener('click', doSearch);
};
