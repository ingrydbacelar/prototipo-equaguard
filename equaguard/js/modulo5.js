var $=function(id){return document.getElementById(id)};
function tela(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$(id).classList.add("on");window.scrollTo(0,0)}
function embaralha(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var ICS={escudo:'<svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'};

/* imagem do escritório (do index) */
var fundo="assets/img/fundo.jpg";

/* ===== Envio para o Google Sheets (vazio nos testes; use a URL do arquivo principal ao juntar) ===== */
var SHEETS_URL="",jogador="",setor="";
function sheetsAtivo(){return SHEETS_URL.indexOf("https://")===0}
function postar(d){return fetch(SHEETS_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)})}

/* ===== TEXTOS (edite aqui) ===== */
var EMPRESA="Uniformax"; /* nome fictício do fornecedor: troque aqui */
var S1={
  t1:"Um dia comum de trabalho. Há um post-it na sua mesa. Clique nele para ler a tarefa.",
  t2:"Você precisa achar o telefone do fornecedor e mandar para o chefe até as 15h. Clique na tela do computador.",
  t3:"Clique no ícone do navegador para pesquisar.",
  t4:"O nome do fornecedor ("+EMPRESA+") já está na busca. Clique em Pesquisar.",
  t4b:"Pesquisando…",
  t5:"O computador travou e voltou para a tela inicial. Clique no navegador para tentar de novo.",
  t6:"O computador continua lento, e o prazo está chegando. Você resolve pesquisar o problema. Clique em Pesquisar.",
  t7:"O primeiro resultado é um anúncio que promete resolver tudo. Clique no anúncio para abrir o site.",
  t8:"O site promete deixar o computador rápido em poucos minutos. Você não conhece quem fez o programa, e ele não veio pelos canais oficiais da empresa. Faltam poucos minutos para as 15h. O que você faz?",
  opcoes:[
    {k:"download",t:"Clico em “Download grátis” e instalo."},
    {k:"antivirus",t:"Baixo o programa, mas passo o antivírus antes de instalar."},
    {k:"colega",t:"Peço a um colega que entende de computador para instalar para mim."},
    {k:"telefone",t:"Não baixo nada e abro um chamado para a TI."}
  ],
  chamado:{num:"CH-48213",tipo:"Solicitação de suporte",cat:"Computador lento ou travando",pri:"Média"},
  msg:"Meu computador está travando e preciso concluir uma tarefa até as 15h. Encontrei um anúncio do programa PC Turbo Fix, mas não conheço quem fez o programa e não instalei. Podem verificar?",
  resp:"Obrigado por abrir o chamado e por não instalar o programa! Vamos acessar seu computador remotamente para resolver a lentidão. Se você precisar de algum programa, a TI libera pelos canais oficiais.",
  erros:{
    antivirus:["Antivírus não é autorização","O antivírus não reconhece todas as ameaças, principalmente as novas. Além disso, o problema não é só o vírus: instalar qualquer programa em um equipamento da empresa exige autorização da TI, que sabe o que é seguro e o que pode causar conflitos."],
    colega:["Quem instala não muda o risco","Se o programa for malicioso, o estrago é o mesmo, não importa quem clicou em instalar. E o colega passa a correr o risco junto com você. Programa novo, só pelos canais oficiais da TI."],
    instalar:["Gratuito não significa seguro","Programas desconhecidos, fora dos canais oficiais, são um caminho comum para vírus, espionagem e roubo de dados. Na simulação, o programa instalou um software malicioso que deixou o computador ainda mais lento e deu acesso a arquivos da empresa. Instalar qualquer ferramenta em um equipamento corporativo exige autorização."]
  },
  revisao:"Ao parar para verificar, você percebe os sinais de alerta no anúncio:",
  certo:"Certo! Você não instalou o programa desconhecido e abriu um chamado para a TI. Assim a equipe resolve a lentidão com segurança, sem arriscar o equipamento nem os dados da empresa."
};
var EMAIL_LOGIN="jogador@luminar.example",SENHA_LOGIN="simulacao123";
var S2={
  t0a:"Nesta situação, o golpe vai acontecer: seu desafio é decidir o que fazer depois. Uma notificação de e-mail aparece na tela. Clique na tela.",
  t0b:"Abra a mensagem na caixa de entrada.",
  t0c:"Abra a mensagem novamente na caixa de entrada e clique no link.",
  t1:"A mensagem diz que sua conta será bloqueada em 30 minutos se você não confirmar seus dados. Na correria, você clica no link.",
  t2:"A página parece a da empresa e pede e-mail e senha. Os dados de simulação já estão preenchidos. Clique em “Entrar”.",
  t2b:"Digite o e-mail e a senha que estavam no post-it e clique em “Entrar”.",
  t5:"Você precisa conferir o login. Clique no post-it na sua mesa.",
  t5b:"Você anotou o login. Agora clique na tela do computador para voltar à caixa de entrada.",
  t3:"Aparece só uma mensagem de erro, e nada mais acontece. Olhando melhor, você percebe que o endereço do site é diferente do endereço oficial da empresa.",
  t4:"Você digitou sua senha em uma página falsa e, aparentemente, nada aconteceu. O que você faz?",
  opcoes:[
    {k:"esperar",t:"Não aconteceu nada, então não preciso avisar ninguém.",d:"Se a conta ainda funciona, provavelmente está tudo bem."},
    {k:"avisar",t:"Abro na hora um chamado de incidente de segurança para a TI.",d:"Conto que digitei minha senha em uma página falsa, mesmo sem ter notado nenhum problema."},
    {k:"apagar",t:"Fecho a página e apago o histórico do navegador para remover os rastros do acesso."},
    {k:"trocar",t:"Troco minha senha sozinho e não aviso ninguém.",d:"Com a senha nova, o problema está resolvido."},
    {k:"ligar",t:"Ligo na hora para a Central de Serviços da TI.",d:"Explico que digitei minha senha em uma página falsa."}
  ],
  chamado:{num:"CH-48227",tipo:"Incidente",cat:"Segurança: senha digitada em página falsa",pri:"Alta"},
  msg:"Cliquei no link de um e-mail que dizia que minha conta seria bloqueada e digitei meu login e senha em uma página que não era a oficial (acesso-empresa.verificacao-conta.example). Parece que nada aconteceu, mas prefiro avisar.",
  resp:"Obrigado por avisar tão rápido! Já redefinimos sua senha e vamos verificar os acessos à sua conta. Também vamos alertar os colegas que receberam o mesmo e-mail. Acidentes acontecem: o mais importante é reportar.",
  erros:{
    esperar:["Nada acontecer não significa que a conta está segura","A senha já está nas mãos de quem criou a página, e criminosos costumam usar o acesso em silêncio. Na simulação, a conta foi acessada de outro lugar e mensagens foram enviadas em seu nome. Acidentes acontecem com qualquer pessoa; o que protege a empresa é reportar na hora."],
    trocar:["Trocar a senha é bom, mas não basta","Trocar a senha ajuda, mas a TI precisa saber: o criminoso pode já ter entrado na sua conta, criado regras escondidas ou enviado e-mails em seu nome. E o mesmo e-mail falso pode ter chegado a outros colegas. Só avisando a equipe consegue verificar tudo e alertar os outros."],
    apagar:["Esconder o ocorrido atrapalha a defesa","Apagar o histórico não desfaz a entrega da senha e ainda retira da equipe de segurança pistas importantes, como o endereço da página falsa. Errar é humano, mas esconder aumenta os danos, porque a conta segue exposta e ninguém sabe que precisa agir."]
  },
  revisao:"Ao analisar a página, você percebe os sinais de alerta:",
  ligacao:{fala:"Oi, preciso reportar um possível incidente de segurança. Cliquei no link de um e-mail que dizia que minha conta seria bloqueada e digitei meu login e senha em uma página que não era a oficial. Parece que nada aconteceu, mas preferi ligar.",resp:"Fez muito bem em ligar na hora! Já bloqueei sua senha e vou registrar um chamado de incidente de segurança para verificar os acessos à sua conta. Vamos alertar também os colegas que receberam o mesmo e-mail."},
  certo:"Certo! Acidentes acontecem, e o importante é reportar. Ao avisar a TI na hora, por chamado ou ligando para a Central de Serviços, mesmo sem ter notado nenhum problema, você permite que a equipe troque sua senha, encerre acessos suspeitos e alerte colegas que receberam o mesmo e-mail."
};

var T=[],enviado=false,a1,a2;
function agenda(f,ms){T.push(setTimeout(f,ms))}
function marca(id,t){var e=$(id);e.classList.add("alvo");e.dataset.t=t}
function limpaMarcas(){document.querySelectorAll(".alvo").forEach(function(e){e.classList.remove("alvo");e.removeAttribute("data-t")})}
function opcoesHTML(ops){return embaralha(ops).map(function(o){return '<button type="button" class="opt" data-k="'+o.k+'"><b>'+o.t+'</b>'+(o.d?'<small>'+o.d+'</small>':'')+'</button>'}).join("")}
function mostraErro(e){$("eTit").textContent=e[0];$("eTxt").textContent=e[1];$("erroM").classList.add("on");$("eOk").focus()}
$("eOk").addEventListener("click",function(){$("erroM").classList.remove("on")});

/* Situação 1 */
function cena1(n){
  a1.n=n;a1.busy=false;
  $("narr1").textContent=["",S1.t1,S1.t2,S1.t3,S1.t4,S1.t5,S1.t6,S1.t7,S1.t8][n];
  var antes=n<=2;
  $("vista1").hidden=!antes;$("pc1").hidden=antes;$("nota1").hidden=n!==2;
  $("tela1").hidden=n!==2;$("postit").classList.toggle("lido",n>=2);
  var w=$("win1");w.classList.remove("on","preto");if(n===4||n===6||n===7||n===8)w.classList.add("on");
  var ic=$("icChrome"),ativo=n===3||n===5;ic.disabled=!ativo;
  $("ch_busca").hidden=n>=7;$("ch_res").hidden=n!==7;$("ch_site").hidden=n!==8;$("ch_load").hidden=true;
  $("q1").value=n===4?EMPRESA:n===6?"computador travando":"";$("q1").readOnly=(n===4||n===6);$("q1").placeholder="Nome do fornecedor";$("hint1").textContent="";
  $("url1").textContent=n===7?"https://www.buscador.example/busca?q=computador+travando":n===8?"http://pcturbofix-gratis.example/baixar":"https://www.buscador.example";
  $("dock1").hidden=n!==8;$("fb1").hidden=true;
  $("op1").innerHTML=n===8?opcoesHTML(S1.opcoes):"";
  window.scrollTo(0,0);
}
function iniciar1(){
  T.forEach(clearTimeout);T=[];limpaMarcas();enviado=false;
  a1={erros:0,erradas:{},escolhas:[],n:1,busy:false,fim:false};
  ["fim1","fb1"].forEach(function(i){$(i).hidden=true});
  ["confM","fone1","erroM"].forEach(function(i){$(i).classList.remove("on")});
  $("stage1").style.backgroundImage="url("+fundo+")";
  tela("cenaA");cena1(1);
}
$("postit").addEventListener("click",function(){if(a1.n===1)cena1(2)});
$("tela1").addEventListener("click",function(){cena1(3)});
$("icChrome").addEventListener("click",function(){if(a1.n===3)cena1(4);else if(a1.n===5)cena1(6)});
function pesquisar(){
  if(a1.busy||(a1.n!==4&&a1.n!==6))return;
  if(a1.n===4&&!$("q1").value.trim()){$("hint1").textContent="Digite o nome do fornecedor para pesquisar.";$("q1").focus();return}
  if(a1.n===6){
    var v=$("q1").value.trim().toLowerCase().replace(/\s+/g," ");
    if(!v){$("hint1").textContent="Digite “computador travando” para pesquisar.";$("q1").focus();return}
    if(v!=="computador travando"){$("hint1").textContent="Digite exatamente: computador travando";$("q1").focus();return}
  }
  a1.busy=true;var n=a1.n;
  $("ch_busca").hidden=true;$("ch_load").hidden=false;
  if(n===4){
    $("narr1").textContent=S1.t4b;
    agenda(function(){$("win1").classList.add("preto")},1800);
    agenda(function(){cena1(5)},3200);
  }else agenda(function(){cena1(7)},1000);
}
$("pesq1").addEventListener("click",pesquisar);
$("q1").addEventListener("keydown",function(ev){if(ev.key==="Enter")pesquisar()});
$("adT").addEventListener("click",function(ev){ev.preventDefault();if(a1.n===7)cena1(8)});
function pedirDownload(){if(a1.n===8&&!a1.fim){a1.escolhas.push("download");$("confM").classList.add("on");$("confNao").focus()}}
$("dl1").addEventListener("click",pedirDownload);
$("confNao").addEventListener("click",function(){a1.escolhas.push("cancelar");$("confM").classList.remove("on")});
$("confSim").addEventListener("click",function(){
  $("confM").classList.remove("on");a1.escolhas.push("instalar");
  if(!a1.erradas.instalar){a1.erradas.instalar=1;a1.erros++}
  mostraErro(S1.erros.instalar);
});
function bolha(txt,out){
  var d=document.createElement("div");d.className="bb"+(out?" out":"");
  d.innerHTML=txt+"<small>14:2"+(out?'1<svg class="tk az" viewBox="0 0 18 11" width="17" height="11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-label="Lida"><path d="M1 5.8l3.2 3.2L10.5 1.5"/><path d="M7.2 8.2l.8.8L14.5 1.5"/></svg>':"2")+"</small>";$("msgs1").appendChild(d);d.scrollIntoView({block:"end"});
}
var FN=null;
function abrirFone(c){
  FN=c;$("x1f").hidden=false;var ch=c.chamado;$("tkT").textContent="Portal de Chamados da TI";$("tkS").textContent="Canal oficial para falar com a TI · simulação";
  $("msgs1").innerHTML='<div class="tkform"><label>Tipo</label><div class="tkv">'+ch.tipo+'</div><label>Categoria</label><div class="tkv">'+ch.cat+'</div><label>Prioridade</label><div class="tkv" style="font-weight:700;color:'+(ch.pri==="Alta"?"#a4332a":"#8a5a00")+'">'+ch.pri+'</div><label>Descrição do problema</label><div class="tkv desc">'+c.msg+'</div></div>';
  $("wa1").innerHTML='<button type="button" id="send1" class="tkbtn">Abrir chamado</button>';
  $("fone1").classList.add("on");$("send1").focus();
}
function abrirFone1(){if(a1.fim)return;a1.escolhas.push("telefone");abrirFone({msg:S1.msg,resp:S1.resp,chamado:S1.chamado,fim:fim1})}
function abrirLigacao(c){
  FN=c;$("x1f").hidden=false;$("tkT").textContent="Central de Serviços da TI";$("tkS").textContent="Atendimento por telefone · simulação";
  $("msgs1").innerHTML='<div class="tkform"><label>Ligar para</label><div class="tkv"><b>Central de Serviços da TI</b><br><span style="color:#5d6b7a;font-size:.88rem">Número oficial divulgado pela empresa</span></div><label>O que você vai dizer</label><div class="tkv desc">'+c.fala+'</div></div>';
  $("wa1").innerHTML='<button type="button" id="ligar1" class="tkbtn" style="background:#1e7f4f">📞 Ligar</button>';
  $("fone1").classList.add("on");$("ligar1").focus();
}
function fazerLigacao(){
  $("wa1").innerHTML="";$("x1f").hidden=true;
  $("msgs1").innerHTML='<div class="tkst" style="background:#eef3fa;border-color:#9fb6e8;color:#143a7a"><b>📞 Chamando a Central de Serviços…</b>Ligação em andamento</div>';
  agenda(function(){var d=document.createElement("div");d.className="tkup";d.innerHTML='<small>Atendente da Central de Serviços</small>'+FN.resp;$("msgs1").appendChild(d);$("wa1").innerHTML='<button type="button" id="fecha1" class="tkbtn">Encerrar ligação e voltar ao trabalho</button>'},2000);
}
function enviarMsg(){
  $("wa1").innerHTML="";$("x1f").hidden=true;var ch=FN.chamado;
  $("msgs1").innerHTML='<div class="tkst"><b>✔ Chamado '+ch.num+' aberto</b>Status: Novo · Prioridade '+ch.pri+'</div><p class="tkwait" id="tkw">Aguardando atendimento da TI…</p>';
  agenda(function(){var w=$("tkw");if(w)w.remove();var d=document.createElement("div");d.className="tkup";d.innerHTML='<small>Atualização do chamado '+ch.num+' · Analista de TI · Status: Em atendimento</small>'+FN.resp;$("msgs1").appendChild(d);$("wa1").innerHTML='<button type="button" id="fecha1" class="tkbtn">Voltar ao trabalho</button>'},2200);
}
function fechaFone(){$("fone1").classList.remove("on");FN.fim()}
function fim1(){
  a1.fim=true;
  $("op1").innerHTML="";$("narr1").textContent=S1.revisao;
  agenda(function(){marca("adP","Promessa exagerada")},500);
  agenda(function(){marca("url1","Origem desconhecida, fora dos canais oficiais")},1200);
  agenda(function(){marca("dl1","Download de fonte não oficial")},1900);
  agenda(function(){$("fb1").textContent=S1.certo;$("fb1").hidden=false},2600);
  agenda(function(){$("fim1").hidden=false;$("fim1").scrollIntoView({behavior:"smooth",block:"center"})},3400);
}
$("wa1").addEventListener("click",function(ev){
  if(ev.target.closest("#send1"))enviarMsg();else if(ev.target.closest("#ligar1"))fazerLigacao();else if(ev.target.closest("#fecha1"))fechaFone();
});
$("x1f").addEventListener("click",function(){$("fone1").classList.remove("on")});
$("op1").addEventListener("click",function(ev){
  var b=ev.target.closest(".opt");if(!b)return;
  var k=b.dataset.k;
  if(k==="download")pedirDownload();
  else if(S1.erros[k]){a1.escolhas.push(k);if(!a1.erradas[k]){a1.erradas[k]=1;a1.erros++}b.disabled=true;mostraErro(S1.erros[k])}
  else abrirFone1();
});
$("s1Done").addEventListener("click",iniciar2);

/* Situação 2 */
function cena2(n){
  a2.n=n;
  var tx={"-1":S2.t0a,"0":a2.volta?S2.t0c:S2.t0b,"1":S2.t1,"2":a2.lido?S2.t2b:S2.t2,"3":S2.t3,"4":S2.t4,"5":a2.lido?S2.t5b:S2.t5};
  $("narr2").textContent=tx[n];
  var of=n===-1||n===5,fim=n===3||n===4;
  $("vista2b").hidden=!of;$("toast2").hidden=n!==-1;
  $("tela2").hidden=!(n===-1||(n===5&&a2.lido));
  var pi=$("postit2");pi.disabled=!(n===5&&!a2.lido);pi.classList.toggle("ativo",n===5&&!a2.lido);
  $("nota2").hidden=!(a2.lido&&(n===5||n===0||n===1||n===2));
  $("inbox2").hidden=n!==0;$("mail2").hidden=n!==1;
  $("br2").hidden=!(n===2||fim);
  $("form2").hidden=n!==2;$("err2").hidden=!fim;$("ofic2").hidden=!fim;
  $("dock2").hidden=!fim;$("cont2").hidden=n!==3;$("fb2").hidden=true;
  $("op2").innerHTML=n===4?opcoesHTML(S2.opcoes):"";
  if(n===2){$("em2").value=EMAIL_LOGIN;$("pw2").value=SENHA_LOGIN;$("em2").readOnly=true;$("pw2").readOnly=true;$("hint2").textContent=""}
  if(n===3)marca("url2","Endereço diferente do oficial");
  window.scrollTo(0,0);
}
function iniciar2(){
  T.forEach(clearTimeout);T=[];limpaMarcas();
  a2={erros:0,erradas:{},escolhas:[],n:-1,lido:false,volta:false};
  $("fim2").hidden=true;$("stage2b").style.backgroundImage="url("+fundo+")";tela("cenaB");cena2(-1);
}
$("tela2").addEventListener("click",function(){if(a2.n===5)a2.volta=true;cena2(0)});
$("postit2").addEventListener("click",function(){if(a2.n===5&&!a2.lido){a2.lido=true;cena2(5)}});
$("row2").addEventListener("click",function(){cena2(1)});
function abrirLink(){cena2(2)}
$("lnk2").addEventListener("click",abrirLink);
$("lnk2").addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();abrirLink()}});
$("volta2").addEventListener("click",function(){cena2(5)});
function entrar2(){
  var e=$("em2").value.trim().toLowerCase(),p=$("pw2").value,h=$("hint2");
  if(!e||!p){h.textContent="Digite o e-mail e a senha. Não lembra? Volte à mesa e confira o post-it.";return}
  if(e!==EMAIL_LOGIN||p!==SENHA_LOGIN){h.textContent="E-mail ou senha diferentes do post-it. Confira e tente de novo.";return}
  cena2(3);
}
$("go2").addEventListener("click",entrar2);
["em2","pw2"].forEach(function(id){$(id).addEventListener("keydown",function(ev){if(ev.key==="Enter")entrar2()})});
$("cont2").addEventListener("click",function(){cena2(4)});
function fim2(){
  $("op2").innerHTML="";$("narr2").textContent=S2.revisao;
  agenda(function(){marca("logo2","Visual copiado da empresa")},500);
  agenda(function(){$("fb2").textContent=S2.certo;$("fb2").hidden=false},1400);
  agenda(function(){$("fim2").hidden=false;$("fim2").scrollIntoView({behavior:"smooth",block:"center"})},2400);
}
$("op2").addEventListener("click",function(ev){
  var b=ev.target.closest(".opt");if(!b)return;var k=b.dataset.k;a2.escolhas.push(k);
  if(S2.erros[k]){
    if(!a2.erradas[k]){a2.erradas[k]=1;a2.erros++}
    b.disabled=true;mostraErro(S2.erros[k]);
  }else if(k==="ligar")abrirLigacao({fala:S2.ligacao.fala,resp:S2.ligacao.resp,fim:fim2});
  else abrirFone({msg:S2.msg,resp:S2.resp,chamado:S2.chamado,fim:fim2});
});

/* Resultado final do jogo */
function enviar(){
  if(enviado)return;enviado=true;
  var e1=a1.erros,e2=a2.erros,er=e1+e2,
  d={nome:jogador,setor:setor,modulo:"Módulo 5: Armadilhas digitais",acertos:Math.max(0,1-e1)+Math.max(0,1-e2),erros:er,pontos:Math.max(0,10-5*e1)+Math.max(0,10-5*e2),selo:"Alerta Digital",quedas:er,escolhas:a1.escolhas.join(">")+"|"+a2.escolhas.join(">"),dataHora:new Date().toISOString()};
  if(!sheetsAtivo()){console.warn("Google Sheets não configurado. Resultado:",d);return}
  postar(d).catch(function(){});
}
$("s2Done").addEventListener("click",function(){
  enviar();var er=a1.erros+a2.erros;$("selo5").innerHTML=ICS.escudo;
  $("r5Pts").textContent=(Math.max(0,10-5*a1.erros)+Math.max(0,10-5*a2.erros))+" de 20 pontos";
  $("r5Txt").textContent=er===0?"Você parou para verificar antes de agir nos dois desafios: não instalou o programa desconhecido e comunicou o incidente na hora. Essa atitude protege você e toda a empresa.":"Cada tentativa mostrou uma armadilha nova. Agora você sabe: desconfie de programas e links inesperados, confirme a origem antes de agir e comunique qualquer incidente imediatamente.";
  tela("resP");
});
$("r5Again").addEventListener("click",iniciar1);
iniciar1();
