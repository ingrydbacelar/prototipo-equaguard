/* ===== Engenharia social: mensagem no WhatsApp ===== */
var socialFeito=false,soEsc=[];
$("social").style.backgroundImage="linear-gradient(rgba(10,18,28,.84),rgba(10,18,28,.93)),url("+fundo+")";
var CONTATOS=[{n:"Gestor",c:"Contato salvo",t:"98 9999-1111",v:true},{n:"Recursos Humanos",c:"Setor",t:"98 9999-2222"},{n:"Suporte de TI",c:"Atendimento interno",t:"98 9999-3333"}];
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}
function psTela(id,dica){document.querySelectorAll(".ps").forEach(function(x){x.classList.remove("on")});$(id).classList.add("on");$("soDica").textContent=dica}
function iniciarSocial(){
  if(socialFeito){mostrarRes();return}
  $("soIntro").hidden=false;$("soFone").hidden=true;$("soFim").hidden=true;tela("social");
}
$("soGo").addEventListener("click",function(){
  var foto=atual===1?fotos[2]:fotos[1];
  document.querySelectorAll(".gf").forEach(function(i){i.src=foto});
  soEsc=[];$("waFb").textContent="";Array.prototype.forEach.call(document.querySelectorAll("#waOpts button"),function(x){x.disabled=false});$("msgs").innerHTML="";$("notifs").innerHTML="";$("buscaNome").value="";$("buscaRes").innerHTML='<p class="vz">Digite <b>gestor</b> para buscar o contato.</p>';
  $("msgTxt").value="Oi! Foi você que me pediu um código por WhatsApp agora há pouco?";$("msgTxt").disabled=false;
  $("soIntro").hidden=true;$("soFone").hidden=false;$("soFim").hidden=true;
  psTela("psLock","Seu celular recebeu notificações. Toque na mensagem do WhatsApp para abrir.");
  setTimeout(function(){$("notifs").insertAdjacentHTML("beforeend",'<button class="nt" id="ntWa"><b>WhatsApp</b><small>agora</small><div>98 9999-7777: Oi! Preciso de um favor urgente</div></button>')},1000);
  setTimeout(function(){$("notifs").insertAdjacentHTML("beforeend",'<div class="nt"><b>Mensagens</b><small>agora</small><div>Seu código de verificação do WhatsApp é 482-915. Não compartilhe este código com ninguém.</div></div>')},2200);
});
$("notifs").addEventListener("click",function(ev){if(ev.target.closest("#ntWa"))psTela("psC1","Um número que não está nos seus contatos acabou de escrever. Decida o que fazer.")});
var WA_FB={
  mandar:"Esse código dá acesso à sua conta de WhatsApp. Com ele, o golpista assume suas conversas e aplica o golpe nos seus contatos.",
  bloquear:"Você se protegeu, mas ninguém foi avisado: o golpista segue tentando com seus colegas. E se fosse mesmo o seu gestor? Há uma opção que resolve os dois casos.",
  perguntar:"Parece esperto, mas o golpista pode achar a resposta na internet ou improvisar. Você continua num canal que não é confiável, e o código já está no seu celular."
};
$("waOpts").addEventListener("click",function(ev){
  var b=ev.target.closest("button");if(!b||b.disabled)return;
  var o=b.dataset.o;soEsc.push(o);
  if(o==="confirmar"){
    $("waFb").textContent="";
    psTela("psBusca","Você decidiu confirmar por um canal conhecido. Digite GESTOR na busca para achar o contato que já está salvo.");$("buscaNome").focus();return;
  }
  b.disabled=true;$("waFb").textContent=WA_FB[o];$("waFb").scrollTop=0;
});
$("buscaNome").addEventListener("input",function(){
  var q=norm(this.value),h;
  if(q.length<2)h='<p class="vz">Digite <b>gestor</b> para buscar o contato.</p>';
  else{
    var r=CONTATOS.map(function(c,i){return{c:c,i:i}}).filter(function(x){return norm(x.c.n).indexOf(q)>-1||norm(x.c.c).indexOf(q)>-1});
    h=r.length?r.map(function(x){return '<button class="ct" data-i="'+x.i+'"><b>'+x.c.n+'</b><small>'+x.c.c+' &middot; '+x.c.t+'</small>'+(x.c.v?'<span class="ok"><svg class="vf" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 1.8 3-.2 1 2.8 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8-2.5-1.7.9-2.9-.9-2.9 2.5-1.7 1-2.8 3 .2z"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8" fill="none" stroke="#0b141a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Contato verificado e já salvo</span>':'')+'</button>'}).join(""):'<p class="vz">Nenhum contato encontrado.</p>';
  }
  $("buscaRes").innerHTML=h;
});
$("buscaRes").addEventListener("click",function(ev){
  var b=ev.target.closest(".ct");if(!b)return;
  if(CONTATOS[+b.dataset.i].v)psTela("psC2","Você achou o contato salvo. Envie uma mensagem perguntando se foi ele quem pediu o código.");
  else $("soDica").textContent="Esse não é o seu gestor. Digite GESTOR na busca para achar o contato certo.";
});
function bolha(txt,out,extra){var d=document.createElement("div");d.className="bb"+(out?" out":"");d.innerHTML=txt+(extra||"");$("msgs").appendChild(d);$("msgs").scrollTop=$("msgs").scrollHeight;return d}
var TK='<svg class="tk" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13l4 4 9-10"/><path d="M10 15l1.5 1.5L21 7"/></svg>';
function enviarMsg(){
  var v=$("msgTxt").value.trim();if(v.length<3||$("msgTxt").disabled)return;
  $("msgTxt").disabled=true;
  var esc=v.replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c]});
  var b=bolha(esc,true,'<small>10:28 '+TK+'</small>');
  setTimeout(function(){b.querySelector(".tk").classList.add("az");$("soDica").textContent="Mensagem visualizada. Aguarde a resposta."},1100);
  var dg;
  setTimeout(function(){dg=document.createElement("div");dg.className="dg";dg.setAttribute("aria-label","digitando");dg.innerHTML="<i></i><i></i><i></i>";$("msgs").appendChild(dg);$("msgs").scrollTop=$("msgs").scrollHeight},2000);
  setTimeout(function(){if(dg)dg.remove();bolha("Não fui eu!! Parabéns pelo reporte, colega",false,"<small>10:29</small>");socialFeito=true;$("soDica").textContent="Você confirmou por um canal conhecido e evitou o golpe."},4400);
  setTimeout(function(){$("soFim").hidden=false;$("soFim").scrollIntoView({behavior:"smooth",block:"center"})},5600);
}
$("msgEnv").addEventListener("click",enviarMsg);
$("msgTxt").addEventListener("keydown",function(e){if(e.key==="Enter")enviarMsg()});
$("soRes").addEventListener("click",function(){mostrarRes()});

