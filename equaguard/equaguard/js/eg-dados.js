/* ===== EquaGuard: dados compartilhados entre os módulos =====
   - guarda quem está jogando (apelido, área, perfil) para todas as páginas
   - envia os resultados para a planilha (Google Apps Script), com fila de reenvio
   Para trocar a planilha, altere somente EG_SHEETS_URL (deve terminar em /exec). */
var EG_SHEETS_URL="https://script.google.com/macros/s/AKfycbwwiiMbyPsUnF0-bMOi3iaglTiJXlX5LY-q4PcwLt3RkLhSTWhQyDtH7Att-3rk3JEFSA/exec";

var EG=(function(){
  var KEY="equaguard_jogador",VALIDADE=12*3600*1000;
  function ler(k,pad){try{var v=JSON.parse(localStorage.getItem(k));return v==null?pad:v}catch(e){return pad}}
  function gravar(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
  var d=ler(KEY,null);
  if(!d||!d.ts||Date.now()-d.ts>VALIDADE)d={id:"",nome:"",setor:"",perfil:"",prog:{},ts:0};
  if(!d.prog)d.prog={};
  function salvar(p){for(var k in p)d[k]=p[k];d.ts=Date.now();gravar(KEY,d)}
  return{
    d:d,uid:uid,
    /* novo jogador (tela de identificação do index): gera um novo id */
    novoJogador:function(nome,setor){d={id:uid(),nome:nome,setor:setor,perfil:"",prog:{},ts:0};EG.d=d;salvar({})},
    concluir:function(n){d.prog[n]=1;salvar({})},
    feito:function(n){return !!d.prog[n]},
    salvarPerfil:function(perfil){salvar({perfil:perfil})}
  };
})();

var FILA="equaguard_fila";
function lerFila(){try{return JSON.parse(localStorage.getItem(FILA)||"[]")}catch(e){return[]}}
function gravarFila(f){try{localStorage.setItem(FILA,JSON.stringify(f))}catch(e){}}
function sheetsAtivo(){return EG_SHEETS_URL.indexOf("https://")===0}
function postar(d){
  return fetch(EG_SHEETS_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});
}
function reenviarFila(){
  if(!sheetsAtivo())return;
  var f=lerFila();if(!f.length)return;
  gravarFila([]);
  f.forEach(function(d){postar(d).catch(function(){gravarFila(lerFila().concat([d]))})});
}
function enviarDados(r){
  /* só o essencial: quando, quem, área, módulo e acertos/erros */
  var d={dataHora:r.dataHora||new Date().toISOString(),nome:r.nome||EG.d.nome,setor:r.setor||EG.d.setor,modulo:r.modulo,acertos:r.acertos,erros:r.erros};
  if(!sheetsAtivo()){console.warn("Google Sheets não configurado. Resultado:",d);return}
  postar(d).then(reenviarFila).catch(function(){gravarFila(lerFila().concat([d]))});
}
window.addEventListener("load",reenviarFila);
/* botão "Voltar aos módulos" nas telas de resultado */
window.addEventListener("load",function(){
  var b=document.getElementById("voltaMod");
  if(b)b.addEventListener("click",function(){location.href="index.html?modulos=1"});
});
