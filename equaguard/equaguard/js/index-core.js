var fotos=["assets/img/foto-1.jpg","assets/img/foto-2.jpg","assets/img/foto-3.jpg","assets/img/foto-4.jpg"];
var pessoas=[
 {nome:"Maria",artigo:"a",cargo:"Analista",foto:fotos[0],tag:"Linha de frente do atendimento",
  resumo:"Maria é o rosto da empresa para quem precisa de ajuda. Cuida do atendimento e das rotinas administrativas, com muitas demandas ao mesmo tempo.",
  lista:["Atende clientes e colegas por telefone, chat e e-mail.","Registra pedidos e consulta dados cadastrais nos sistemas.","Recebe muitos e-mails, links e anexos todos os dias.","Segue procedimentos e escala os casos difíceis para a liderança."],
  ident:["Falo com clientes ou colegas o dia todo.","Uso sistemas para registrar e consultar informações.","Preciso agir rápido, mas seguindo o processo."],
  pronto:"Você vai enfrentar a missão pela visão de quem está na linha de frente: cada e-mail e cada dado de cliente conta."},
 {nome:"Pedro",artigo:"o",cargo:"Liderança",foto:fotos[1],tag:"Quem recebe as demandas e decide",
  resumo:"Pedro é o coordenador da equipe. As demandas chegam até ele, e é ele quem resolve os problemas e decide o que fazer quando algo foge do normal.",
  lista:["Recebe as demandas e os casos escalados pela equipe.","Resolve problemas, remove bloqueios e define prioridades.","Aprova acessos e decisões que envolvem risco.","Conversa com outras áreas e presta contas à gestão."],
  ident:["Os problemas da equipe chegam até mim.","Preciso decidir quando algo foge do normal.","Aprovo acessos e presto contas à gestão."],
  pronto:"Você vai conduzir a missão: priorizar, decidir e agir com segurança."},
 {nome:"Flávio",artigo:"o",cargo:"TI",foto:fotos[2],tag:"Quem mantém tudo funcionando",
  resumo:"Flávio trabalha na TI e já mexe com isso todos os dias. Mantém a estrutura que faz a empresa funcionar e costuma ser o primeiro a perceber algo estranho.",
  lista:["Cuida de servidores, redes e equipamentos.","Atende chamados e resolve falhas de acesso e de dispositivos.","Faz atualizações, backups e controle de permissões.","Monitora alertas e investiga comportamentos suspeitos."],
  ident:["Trabalho com tecnologia, suporte ou infraestrutura.","Já lido com segurança da informação no meu dia a dia.","Sou chamado quando algo para de funcionar."],
  pronto:"Você vai defender a infraestrutura: acessos, dispositivos e sistemas críticos estão nas suas mãos."},
 {nome:"Carlos",artigo:"o",cargo:"Técnico de campo",foto:fotos[3],tag:"Quem cuida da rede operacional",campo:true,
  resumo:"Carlos trabalha em campo, nas subestações e painéis. Faz manutenção em equipamentos da rede operacional e costuma levar o notebook para configurar e testar tudo no local.",
  lista:["Faz manutenção em painéis, equipamentos e subestações.","Usa notebook e pendrive para configurar e atualizar equipamentos.","Acessa a rede operacional, que sustenta o fornecimento de energia.","Segue procedimentos de segurança, física e digital, em cada intervenção."],
  ident:["Trabalho em campo, em subestações, painéis ou equipamentos.","Conecto notebook ou pendrive em equipamentos da operação.","Um erro meu pode afetar a rede e o fornecimento."],
  pronto:"Você vai proteger a rede operacional: cada acesso, cada dispositivo e cada procedimento em campo contam."}
];
var $=function(id){return document.getElementById(id)};
var cards=$("cards"),ultimo=null,atual=0;
pessoas.forEach(function(p,i){
  var b=document.createElement("button");
  b.className="card";
  b.innerHTML='<img class="ph" src="'+p.foto+'" alt="Foto de '+p.nome+'"><div class="ct"><span class="role">'+p.cargo+'</span><h3>'+p.nome+'</h3><span class="tag">'+p.tag+'</span></div>';
  b.addEventListener("click",function(){abrir(i,b)});
  cards.appendChild(b);
});
function tela(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$(id).classList.add("on");window.scrollTo(0,0)}
function abrir(i,el){
  var p=pessoas[i];ultimo=el;atual=i;
  $("mAv").src=p.foto;$("mAv").alt="Foto de "+p.nome;
  $("mNome").textContent=p.nome;$("mRole").textContent=p.cargo;$("mResumo").textContent=p.resumo;
  $("mLista").innerHTML=p.lista.map(function(t){return "<li>"+t+"</li>"}).join("");
  $("mIdent").innerHTML=p.ident.map(function(x){return "<li>"+x+"</li>"}).join("");
  $("seguir").textContent="Seguir com "+(p.artigo==="a"?"a ":"o ")+p.nome;
  $("modal").classList.add("on");$("seguir").focus();
}
function fechar(){$("modal").classList.remove("on");if(ultimo)ultimo.focus()}
$("comecar").addEventListener("click",function(){tela("ident");$("nomeJog").focus()});
$("identVolta").addEventListener("click",function(){tela("inicio")});
$("identOk").addEventListener("click",function(){
  var n=$("nomeJog").value.trim().replace(/\s+/g," "),s=$("setorJog").value.trim().replace(/\s+/g," ");
  if(n.length<2){$("nomeErr").textContent="Digite um nome ou apelido para continuar.";$("nomeJog").focus();return}
  if(s.length<2){$("nomeErr").textContent="Selecione a sua área para continuar.";$("setorJog").focus();return}
  jogador=n;setor=s;EG.novoJogador(n,s);$("nomeErr").textContent="";tela("equipe");
});
["nomeJog","setorJog"].forEach(function(id){$(id).addEventListener("keydown",function(e){if(e.key==="Enter")$("identOk").click()})});
$("voltar").addEventListener("click",function(){tela("inicio")});
$("fechar").addEventListener("click",fechar);
$("seguir").addEventListener("click",function(){
  var p=pessoas[atual];EG.salvarPerfil(p.cargo);
  $("modal").classList.remove("on");
  $("pAv").src=p.foto;$("pAv").alt="Foto de "+p.nome;
  $("pTitulo").textContent="Você é "+p.nome+" ("+p.cargo+")";
  $("pTexto").textContent=p.pronto;
  $("mod3t").hidden=!p.campo;
  tela("pronto");
});
$("trocar").addEventListener("click",function(){tela("equipe")});
$("modal").addEventListener("click",function(e){if(e.target===this)fechar()});
document.addEventListener("keydown",function(e){if(e.key==="Escape")fechar()});
var fundo="assets/img/fundo.jpg";
$("stage").style.backgroundImage="url("+fundo+")";
var DOM="equatorialenergia.com.br";
var emails=[
 {nome:"RH Equatorial",end:"rh@equatoriall-energia.com",assunto:"Atualização cadastral obrigatória: prazo termina hoje",hora:"07:58",para:"Você",fish:true,
  corpo:'Prezado colaborador,<br><br>Identificamos pendências no seu cadastro. Para evitar o <b>bloqueio do seu acesso</b> ao sistema, atualize seus dados <a data-u="http://equatorial-rh.cadastro-seguro.com/login">neste link</a> até as 18h de hoje.<br><br>Será necessário informar seu CPF, matrícula e a senha da rede.<br><br>Atenciosamente,<br>Recursos Humanos',
  pistas:["O endereço do remetente tem um erro (equatoriall-energia) e termina em .com, e não no domínio oficial.","O link leva a um site externo e sem https, diferente do domínio da empresa.","Cria urgência e ameaça bloquear o acesso.","Pede senha por e-mail, algo que o RH nunca faz."]},
 {nome:"Comunicação Interna",end:"comunicacao@"+DOM,assunto:"Manutenção programada da intranet neste sábado",hora:"08:42",para:"Você",fish:false,
  corpo:'Olá,<br><br>A intranet ficará indisponível neste sábado, das 22h às 23h30, para manutenção. Mais detalhes no <a data-u="https://intranet.'+DOM+'/comunicados">comunicado oficial</a>.<br><br>Equipe de Comunicação',
  pistas:["O remetente está no domínio oficial da empresa.","O link usa https e pertence ao mesmo domínio.","Apenas informa: não pede dados nem cria urgência."]},
 {nome:"Equatorial Energia",end:"faturas@equatorial-fatura.top",assunto:"2ª via da sua fatura de março disponível",hora:"09:15",para:"Destinatários ocultos",fish:true,anexo:"fatura_marco.pdf.exe",
  corpo:'Olá,<br><br>Sua fatura já está disponível. Abra o arquivo anexo para conferir o valor e evitar o <b>corte no fornecimento</b>. Se preferir, pague agora por este link: <a data-u="http://bit.ly/3xFaTuRa">pagar fatura</a>.',
  pistas:["O domínio .top não é o da empresa.","O anexo termina em .pdf.exe: é um programa disfarçado de PDF.","O link encurtado esconde o destino real.","Ameaça de corte para pressionar, e o destinatário está oculto."]},
 {nome:"Carlos Menezes",end:"carlos.menezes@"+DOM,assunto:"Alinhamento do time amanhã às 9h",hora:"09:40",para:"Equipe de Operações",fish:false,
  corpo:'Bom dia, pessoal.<br><br>Amanhã às 9h faremos o alinhamento semanal na sala 3 (ou pelo Teams). Pauta: prioridades da semana e dúvidas gerais. Quem tiver algum ponto, me avise até o fim do dia.<br><br>Abraço,<br>Carlos',
  pistas:["Remetente no domínio oficial.","Sem links, anexos ou pedido de dados.","Assunto e pauta fazem sentido com a rotina da equipe."]},
 {nome:"Diretoria Equatorial",end:"diretoria.ceo.equatorial@gmail.com",assunto:"URGENTE E CONFIDENCIAL: preciso da sua ajuda",hora:"10:03",para:"Você",fish:true,
  corpo:'Estou em reunião e não posso atender ligações. Preciso que você compre 5 cartões-presente de R$ 500 e me envie os códigos por aqui ainda hoje. Não comente com ninguém. Depois eu reembolso.<br><br>Enviado do meu celular',
  pistas:["O endereço é gmail, e não corporativo, apesar do nome \"Diretoria Equatorial\".","Pede sigilo e urgência.","Compra de cartões-presente não faz parte de nenhum processo da empresa.","Impede você de confirmar por telefone."]},
 {nome:"Segurança da Informação",end:"seguranca@"+DOM,assunto:"Novo treinamento disponível na plataforma de aprendizagem",hora:"10:15",para:"Você",fish:false,
  corpo:'Olá!<br><br>Já está disponível o curso "Boas práticas de segurança no dia a dia". Acesse pela plataforma de aprendizagem, com o seu login habitual, até o fim do mês: <a data-u="https://aprendizagem.'+DOM+'/cursos">acessar plataforma</a>.<br><br>Dúvidas? Fale com o time pelo canal oficial.',
  pistas:["Remetente no domínio oficial.","O link usa https e é do mesmo domínio da empresa.","Prazo razoável e nenhum pedido de senha ou dados."]}
];
var AVISO_EXT="AVISO: este e-mail foi originado de fora do Grupo Equatorial. Não clique em links nem abra anexos de remetentes desconhecidos.";
emails.forEach(function(e){e.ext=e.end.slice(-DOM.length-1)!=="@"+DOM;if(e.ext&&e.fish)e.pistas.push("O aviso de e-mail externo estava no topo.")});
var resp={},pontos=0,bonus=0,reportado={},aberto=-1,quedas=0,enviado=false,jogador="",setor="";

/* ===== Envio para o Google Sheets: ver js/eg-dados.js ===== */
function enviarResultado(selo){
  if(enviado)return;enviado=true;
  var ac=0,pa=0;emails.forEach(function(e,i){if((resp[i]==="sus")===e.fish)ac++;else if(resp[i]==="sus"&&!e.fish)pa++});
  var d={nome:jogador,setor:setor,modulo:"Módulo 1: Phishing e Engenharia Social",
    acertos:ac,parciais:pa,erros:emails.length-ac-pa,pontos:pontos+bonus,selo:selo,quedas:quedas,reportouQueda:Object.keys(reportado).length,engSocial:(socialFeito?"Confirmou pelo contato salvo":"Não realizado"),engSocialPrimeira:soEsc[0]||"",engSocialEscolhas:soEsc.join(">"),dataHora:new Date().toISOString()};
  enviarDados(d);
}
function meuEmail(){var n=pessoas[atual].nome.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();return n+"@"+DOM}
function renderLista(){
  $("mlist").innerHTML=emails.map(function(e,i){
    var f=resp[i]!==undefined;
    return '<button class="mi'+(f?' feito':'')+(i===aberto?' sel':'')+'" data-i="'+i+'"><div class="l1"><span>'+e.nome+'</span><small>'+e.hora+'</small></div><div class="l2">'+e.assunto+'</div><div class="l3">'+(f?'<span class="ok">✓ Analisado</span>':e.corpo.replace(/<[^>]+>/g," ").slice(0,70))+'</div></button>'}).join("");
  var n=Object.keys(resp).length;
  $("cnt").textContent=n+" de "+emails.length+" analisados";$("mfin").hidden=n<emails.length;
}
function abrirEmail(i){
  aberto=i;var e=emails[i],f=resp[i];
  var h='<button class="mback" id="mback">← Caixa de entrada</button>'+(e.ext?'<div class="extaviso" role="note">'+AVISO_EXT+'</div>':'')+'<h3>'+e.assunto+'</h3>'+
   '<div class="rem"><div class="av">'+e.nome[0]+'</div><div><div class="nm">'+e.nome+'</div><button class="dt" id="dt">Detalhes</button></div></div>'+
   '<div class="det" id="det"><b>De:</b> '+e.nome+' &lt;'+e.end+'&gt;<br><b>Para:</b> '+(e.para==="Você"?meuEmail():e.para)+'<br><b>Hora:</b> hoje, '+e.hora+'</div>'+
   '<div class="corpo">'+e.corpo+'</div>'+(e.anexo?'<button class="anx" data-anx="1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11l-8 8a5 5 0 01-7-7l8-8a3.5 3.5 0 015 5l-8 8a2 2 0 01-3-3l7-7"/></svg> '+e.anexo+'</button>':'');
  if(f===undefined){
    h+='<div class="acoes2"><button class="b2 seg" data-r="seg">Parece seguro</button><button class="b2 sus" data-r="sus">Reportar como suspeito</button></div>';
  }else{
    var ok=(f==="sus")===e.fish,parc=(f==="sus"&&!e.fish),cai=(f==="caiu");
    if(parc){
      h+='<div class="fb parc"><h4>Obrigado pelo cuidado</h4>A Segurança analisou: este e-mail era <b>legítimo</b>. Na dúvida, reportar é sempre melhor do que arriscar.<h4 style="margin-top:12px">Como saber da próxima vez</h4><ul>'+e.pistas.map(function(x){return "<li>"+x+"</li>"}).join("")+'</ul><span class="pt">+5 pontos · acerto parcial</span></div>';
    }else{
      var tit=ok?'Muito bem! Você acertou.':(cai?'Este e-mail era um golpe. Veja as pistas para reconhecer da próxima vez.':'Quase! Vamos ver o que passou.');
      h+='<div class="fb '+(ok?'ok':'no')+'"><h4>'+tit+'</h4>'+(cai?'':(e.fish?'Este e-mail era <b>phishing</b>. ':'Este e-mail era <b>legítimo</b>. ')+'Veja as pistas:')+'<ul>'+e.pistas.map(function(x){return "<li>"+x+"</li>"}).join("")+'</ul>'+(ok?'<span class="pt">+10 pontos</span>':'')+'</div>';
    }
  }
  $("mread").innerHTML=h;$("mread").scrollTop=0;$("mw").classList.add("lendo");renderLista();
}
$("mfin").addEventListener("click",function(){iniciarSocial()});
$("mlist").addEventListener("click",function(ev){var b=ev.target.closest(".mi");if(b)abrirEmail(+b.dataset.i)});
$("mread").addEventListener("click",function(ev){
  var el=ev.target;
  if(el.id==="mback"){$("mw").classList.remove("lendo");return}
  if(el.id==="dt"){$("det").classList.toggle("on");return}
  if(el.id==="verRes"){iniciarSocial();return}
  var a=el.closest("a[data-u]");
  if(el.closest(".anx")){caiu("anexo");return}
  if(a){ev.preventDefault();if(emails[aberto].fish){caiu("link");return}$("mstat").innerHTML="Endereço do link: <b>"+a.dataset.u+"</b> (link bloqueado nesta simulação)";return}
  var r=el.dataset&&el.dataset.r;
  if(r){resp[aberto]=r;if((r==="sus")===emails[aberto].fish)pontos+=10;else if(r==="sus")pontos+=5;abrirEmail(aberto)}
});
$("mread").addEventListener("mouseover",function(ev){var a=ev.target.closest("a[data-u]");if(a)$("mstat").innerHTML="Endereço do link: <b>"+a.dataset.u+"</b>"});
$("mread").addEventListener("mouseout",function(ev){if(ev.target.closest("a[data-u]"))$("mstat").textContent="Passe o mouse ou toque em um link para ver o endereço."});
var SV='<svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
var ICS={escudo:SV+'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',lupa:SV+'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/></svg>',bussola:SV+'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>'};
function mostrarRes(){mod1Done=true;EG.concluir("1");atualizaModulos();
  var max=emails.length*10,s,ic,tx;
  if(pontos>=50){s="Caçador de Phishing";ic=ICS.escudo;tx="Você enxerga os sinais com clareza. Os golpes do Hacker Apagão não passam por você."}
  else if(pontos>=30){s="Olhar Atento";ic=ICS.lupa;tx="Você já percebe boa parte das armadilhas. Revise os e-mails para fechar as pistas que faltaram."}
  else{s="Em Treinamento";ic=ICS.bussola;tx="Cada erro mostrou um sinal novo. Revise os e-mails e use as pistas para olhar de novo."}
  $("seloIc").innerHTML=ic;$("seloNm").textContent=s;$("rPts").textContent=bonus>0?(pontos+bonus)+" pontos · "+bonus+" de bônus por reportar o próprio erro":pontos+" de "+max+" pontos";$("rRapido").hidden=!bonus;$("rTxt").textContent=tx;enviarResultado(s);tela("resultado");
}
var quedaTipo="";
function caiu(tipo){quedas++;quedaTipo=tipo;
  if(resp[aberto]===undefined)resp[aberto]="caiu";
  $("cTit").textContent=tipo==="link"?"Você clicou em um link falso":"Você abriu um arquivo malicioso";
  $("cTxt").textContent=tipo==="link"?"Numa situação real, uma página idêntica à da empresa poderia ter roubado sua senha e seus dados.":"Numa situação real, um programa poderia ter sido instalado e dado ao Hacker Apagão acesso ao seu computador.";
  $("oFechar").textContent=tipo==="link"?"Fecho a página e sigo trabalhando":"Fecho o arquivo e sigo trabalhando";
  $("cEscolha").hidden=false;$("cAcon").hidden=false;$("cOk").hidden=true;$("cFb").textContent="";
  Array.prototype.forEach.call(document.querySelectorAll("#caiu .opcb"),function(b){b.disabled=false});
  $("caiu").classList.add("on");$("oFechar").focus();
}
$("caiu").addEventListener("click",function(ev){
  var b=ev.target.closest(".opcb");if(!b||b.disabled)return;
  var o=b.dataset.o;
  if(o==="fechar"||o==="apagar"){
    b.disabled=true;
    $("cFb").textContent=o==="fechar"
      ?"Fechar não desfaz o que já foi aberto. Para isolar o risco, a Segurança precisa saber agora. Qual das outras opções ajuda mais?"
      :"Apagar o e-mail não remove o problema e esconde o alerta de quem poderia ajudar. Se ninguém souber, o golpe pode chegar aos seus colegas. Qual das outras opções ajuda mais?";
    return;
  }
  var novo=!reportado[aberto];
  if(novo){reportado[aberto]=true;bonus+=15}
  $("cTit").textContent="Boa decisão. Obrigado por avisar";
  $("cTxt").textContent="A Segurança foi acionada e pode isolar o risco antes que ele se espalhe. Quanto mais rápido o aviso, menor o estrago.";
  $("cRec").textContent=novo?"+15 pontos · selo “Reportou rápido”":"Você já ganhou os pontos por reportar este e-mail.";
  $("cEscolha").hidden=true;$("cAcon").hidden=true;$("cOk").hidden=false;$("cSeguir").focus();
});
$("cSeguir").addEventListener("click",function(){
  $("caiu").classList.remove("on");abrirEmail(aberto);
});
function irEscritorio(){tela("escritorio");var v=$("vista");v.scrollLeft=v.scrollWidth}
$("iniciar").addEventListener("click",function(){tela("proposta")});
$("entrar").addEventListener("click",function(){tela("modulos")});
$("mod1").addEventListener("click",irEscritorio);
$("tela").addEventListener("click",function(){tela("licao")});
$("abrirCaixa").addEventListener("click",function(){
  $("meuAv").src=pessoas[atual].foto;$("meuAv").alt=pessoas[atual].nome;
  renderLista();$("mw").classList.remove("lendo");tela("correio");
});
$("rev").addEventListener("click",function(){tela("correio")});
$("rIni").addEventListener("click",function(){socialFeito=false;soEsc=[];enviado=false;quedas=0;resp={};pontos=0;bonus=0;reportado={};aberto=-1;$("mread").innerHTML='<p class="vazio">Selecione um e-mail para ler.</p>';tela("inicio")});


