var $=function(id){return document.getElementById(id)};
function tela(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$(id).classList.add("on");window.scrollTo(0,0)}
function embaralha(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var ICS={escudo:'<svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'};

/* ===== Imagem (base64) ===== */
var imgPost="assets/img/imgPost.jpg"; /* tela de novo post: foto e legenda */
var imgFoto="assets/img/imgFoto.jpg"; /* foto do primeiro dia: crachá e sala de controle ao fundo */

/* imagem do escritório (do index) */
var fundo="assets/img/fundo.jpg";

/* ===== Envio para o Google Sheets: ver js/eg-dados.js ===== */
var jogador=EG.d.nome,setor=EG.d.setor;

/* ===== TEXTOS (edite aqui) ===== */
var M4={
  t0:"Parabéns, colaborador!",
  t1:"Hoje é seu primeiro dia no escritório.",
  t2:"Animado com a nova oportunidade, você decide tirar uma foto para compartilhar nas redes sociais e registrar esse momento especial.",
  t3:"Você abre a rede social e prepara o novo post",
  pergunta:"A foto parece inofensiva, o que você decide fazer?",
  opcoes:[
    {k:"publicar",t:"Publicar a foto normalmente"},
    {k:"revisar",t:"Revisar a foto antes de publicar"},
    {k:"crachá",t:"Editar a foto e esconder apenas o crachá"}
  ],
  erros:{
    publicar:["Uma legenda inocente não torna a foto segura","A imagem mostra seu crachá e telas com sistemas corporativos. Com isso, qualquer pessoa pode descobrir quem você é, onde trabalha e que sistemas a empresa usa, e golpistas podem usar essas informações em ataques. Mesmo que você apague a publicação depois, alguém pode ter feito uma captura de tela ou compartilhado a imagem."],
    "crachá":["Esconder só o crachá não basta","O crachá não é o único risco. As telas ao fundo continuam mostrando sistemas corporativos que podem exibir dados pessoais, informações operacionais ou conteúdo confidencial. É preciso avaliar a imagem inteira antes de publicar."]
  },
  revisao:"Ao revisar a foto, você percebe o que ela revela:",
  certo:"Certo! A resposta segura é usar apenas o canal autorizado pela empresa e enviar o mínimo de dados necessário. Antes de compartilhar, confirme a autorização do parceiro e pergunte quais campos ele realmente precisa: CPF e telefone, por exemplo, só devem ir se forem indispensáveis.",
  /* marcas: posição em % da tela do post (x, y, largura, altura) */
  marcas:[
    {x:43,y:47,w:13,h:17,t:"Crachá"},
    {x:25.7,y:24,w:54.5,h:17,t:"Telas com sistemas corporativos"},
    {x:21.5,y:41.3,w:16,h:16.5,t:"Colegas e ambiente"}
  ]
};

var m4={erros:0,erradas:{},escolhas:[],enviado:false},T=[];
function agenda(f,ms){T.push(setTimeout(f,ms))}
function fade(id){var e=$(id);e.classList.remove("fadein");void e.offsetWidth;e.classList.add("fadein")}
function cena(n){
  var nr=$("narr3");$("cont3").dataset.passo=n;
  if(n===1){
    $("vista3").hidden=true;$("postv").hidden=true;nr.hidden=true;
    $("festa").hidden=false;$("festaEmo").hidden=false;$("festaTxt").textContent=M4.t0;fade("festa");
  }else if(n===2){
    $("festaEmo").hidden=true;$("festaTxt").textContent=M4.t1;fade("festa");
  }else if(n===3){
    $("festa").hidden=true;nr.hidden=false;nr.textContent=M4.t2;
    $("vista3").hidden=false;fade("vista3");
  }else if(n===4){
    $("vista3").hidden=true;nr.textContent=M4.t3;
    $("postv").hidden=false;fade("postv");
  }else{
    $("cont3").hidden=true;nr.textContent=M4.pergunta;
    $("op3").innerHTML=embaralha(M4.opcoes).map(function(o){return '<button class="opt" data-k="'+o.k+'">'+o.t+'</button>'}).join("");
    $("dock3").scrollIntoView({behavior:"smooth",block:"end"});
  }
  window.scrollTo(0,0);
}
function iniciar(){
  T.forEach(clearTimeout);T=[];
  m4={erros:0,erradas:{},escolhas:[],enviado:false};
  ["dock3","fb3","cont3","fim3","postv","vista3"].forEach(function(i){$(i).hidden=true});$("op3").innerHTML="";$("marcas").innerHTML="";
  $("stage3").style.backgroundImage="url("+imgFoto+")";$("postImg").src=imgPost;
  $("dock3").hidden=false;$("cont3").hidden=false;tela("cenaP");cena(1);
}
$("cont3").addEventListener("click",function(){cena(+this.dataset.passo+1)});
$("op3").addEventListener("click",function(ev){
  var b=ev.target.closest(".opt");if(!b)return;var k=b.dataset.k;m4.escolhas.push(k);
  if(M4.erros[k]){
    if(!m4.erradas[k]){m4.erradas[k]=1;m4.erros++}
    b.disabled=true;$("e3Tit").textContent=M4.erros[k][0];$("e3Txt").textContent=M4.erros[k][1];
    $("erro3").classList.add("on");$("e3Ok").focus();
  }else{
    $("op3").innerHTML="";$("narr3").textContent=M4.revisao;
    M4.marcas.forEach(function(m,i){agenda(function(){
      var d=document.createElement("div");d.className="mk";d.style.cssText="left:"+m.x+"%;top:"+m.y+"%;width:"+m.w+"%;height:"+m.h+"%";
      d.innerHTML="<b>"+m.t+"</b>";$("marcas").appendChild(d)},500+i*700)});
    agenda(function(){$("fb3").textContent=M4.certo;$("fb3").hidden=false},500+M4.marcas.length*700);
    agenda(function(){$("fim3").hidden=false;$("fim3").scrollIntoView({behavior:"smooth",block:"center"})},2600+M4.marcas.length*700);
  }
});
$("e3Ok").addEventListener("click",function(){$("erro3").classList.remove("on")});
var M5={
  t1:"Você está trabalhando em um dia comum. Você recebe uma mensagem por e-mail. Clique na tela do computador para abrir.",
  t2:"Na área de trabalho, clique no ícone do e-mail para abri-lo.",
  t3:"Agora feche o e-mail e clique no ícone clientes.xlsx para abrir a planilha.",
  t4:"Agora clique no ícone do e-mail para abri-lo de novo e decidir como responder.",
  msgs:["Preciso da planilha com os clientes hoje com estas informações:","• Nome\n• Sobrenome\n• CPF\n• Telefone","É urgente, estou aguardando. Pode me enviar por e-mail?"],
  opcoes:[
    {k:"enviar",t:"Enviar imediatamente por e-mail",d:"O parceiro solicitou os dados e o prazo é curto. Enviar logo evita atrasos.",r:"Claro, já te envio a planilha por e-mail agora mesmo."},
    {k:"canal",t:"Usar só o canal seguro autorizado e o mínimo de dados necessário",d:"Confirmar a autorização, compartilhar apenas pelo canal aprovado pela empresa e enviar somente os dados realmente necessários."},
    {k:"whats",t:"Enviar pelo WhatsApp pessoal",d:"Mandar a planilha pelo aplicativo para agilizar o processo, já que o parceiro é conhecido.",r:"Me chama no meu WhatsApp pessoal que eu te mando agora."}
  ],
  erros:{
    enviar:["A planilha seguiu sem nenhuma verificação","Você enviou a planilha completa, com nome, sobrenome, CPF e telefone dos clientes, por e-mail comum, sem confirmar se o canal era autorizado nem se todos aqueles dados eram necessários. Na simulação, o e-mail foi encaminhado a um endereço incorreto e a planilha ficou acessível a pessoas sem autorização. Urgência não elimina responsabilidade."],
    whats:["Aplicativo pessoal não é canal seguro","A planilha foi parar em um aparelho pessoal, fora do controle da empresa, e ficou salva em conversas e backups que outras pessoas podem acessar. Conhecer o parceiro não torna o canal aprovado. Dados de clientes só devem circular por canais autorizados pela organização."]
  },
  ok:"Combinado, aguardo seu retorno. Obrigado!",
  certo:"Certo! Você confirmou a necessidade dos dados, a autorização do parceiro e qual canal seguro usar antes de enviar. Se o compartilhamento for autorizado, ele segue por um canal aprovado, apenas com os dados necessários."
};
var CLI5=[["Mariana","Ferreira","123.456.789-09","(11) 91234-5678"],["Carlos","Lima","234.567.890-12","(21) 98765-4321"],["Fernanda","Rocha","345.678.901-23","(31) 99876-5432"],["Ricardo","Barros","456.789.012-34","(41) 97654-3210"],["Patrícia","Duarte","567.890.123-45","(51) 98123-4567"]];
var m5={erros:0,erradas:{},escolhas:[],aberto:false};
function resetMail(){
  m5.aberto=false;$("mw5").classList.remove("lendo");$("vazio5").hidden=false;$("msg5").hidden=true;
  $("mi5").classList.remove("sel");$("ops5").innerHTML="";$("fbm5").innerHTML="";$("fecha5w").hidden=true;$("passo5").hidden=false;$("resp5").hidden=true;
}
function renderResp(){
  $("passo5").hidden=m5.planilha;$("resp5").hidden=!m5.planilha;
  if(m5.planilha&&!$("ops5").children.length)$("ops5").innerHTML=embaralha(M5.opcoes).map(function(o){return '<button type="button" data-k="'+o.k+'"><b>'+o.t+'</b><small>'+o.d+'</small></button>'}).join("");
}
function abrirMail(){$("mail5").classList.add("on");if(m5.aberto)renderResp();$("mi5").focus()}
function fechaMail(){$("mail5").classList.remove("on")}
function cena5(n){
  m5.n=n;var nr=$("narr5"),c=$("cont5");c.dataset.passo=n;window.scrollTo(0,0);
  $("vista5").hidden=!(n===1||n===5);$("pc5").hidden=!(n>=2&&n<=4);
  $("tela5").hidden=n!==1;$("toast5").hidden=n!==1;
  $("icPlan").disabled=n<3;$("bd5").hidden=n>=3;$("cnt5").textContent=n>=3?"0 não lidas":"1 não lida";
  c.hidden=true;
  nr.textContent=["",M5.t1,M5.t2,M5.t3,M5.t4,"Boa decisão."][n];
  $("fb5").hidden=n!==5;$("fim5").hidden=n!==5;
  if(n===5){$("fb5").textContent=M5.certo;$("fim5").scrollIntoView({behavior:"smooth",block:"center"})}
}
function iniciar5(){
  m5={erros:0,erradas:{},escolhas:[],aberto:false,planilha:false,n:1};
  $("plan5").classList.remove("on");
  $("stage5").style.backgroundImage="url("+fundo+")";
  $("mail5").classList.remove("on");resetMail();
  tela("cenaM2");cena5(1);
}
$("tela5").addEventListener("click",function(){cena5(2)});
$("icMail").addEventListener("click",abrirMail);
$("icPlan").addEventListener("click",function(){if(!this.disabled)$("plan5").classList.add("on")});
$("x5mail").addEventListener("click",fechaMail);
$("mi5").addEventListener("click",function(){
  this.classList.add("sel");$("vazio5").hidden=true;$("msg5").hidden=false;$("mw5").classList.add("lendo");
  m5.aberto=true;if(m5.n===2)cena5(3);renderResp();
});
$("voltar5").addEventListener("click",fechaMail);
$("fecharPlan5").addEventListener("click",function(){$("plan5").classList.remove("on");if(!m5.planilha){m5.planilha=true;cena5(4)}});
$("mback5").addEventListener("click",function(){$("mw5").classList.remove("lendo")});
$("ops5").addEventListener("click",function(ev){
  var b=ev.target.closest("button");if(!b)return;var k=b.dataset.k;m5.escolhas.push(k);
  var fb=$("fbm5");fb.innerHTML="";var d=document.createElement("div");var h=document.createElement("h4"),p=document.createElement("p");p.style.margin="0";
  if(M5.erros[k]){
    if(!m5.erradas[k]){m5.erradas[k]=1;m5.erros++}
    b.disabled=true;d.className="fb no";h.textContent=M5.erros[k][0];p.textContent=M5.erros[k][1];
  }else{
    $("ops5").querySelectorAll("button").forEach(function(x){x.disabled=true});
    d.className="fb ok";h.textContent="Certo!";p.textContent=M5.certo;$("fecha5w").hidden=false;
  }
  d.appendChild(h);d.appendChild(p);fb.appendChild(d);d.scrollIntoView({behavior:"smooth",block:"nearest"});
});
$("fecha5").addEventListener("click",function(){fechaMail();cena5(5)});
(function(){
  var C=["A","B","C","D","E","F","G","H"],D=[["Nome","Sobrenome","CPF","Telefone"]].concat(CLI5),h='<colgroup><col style="width:40px">';
  C.forEach(function(){h+='<col style="width:120px">'});h+='</colgroup><thead><tr><th></th>'+C.map(function(c){return "<th>"+c+"</th>"}).join("")+"</tr></thead><tbody>";
  for(var r=1;r<=22;r++){h+="<tr><th>"+r+"</th>"+C.map(function(c,i){var v=(D[r-1]&&D[r-1][i])||"";return '<td data-c="'+c+r+'"'+(r===1?' class="h"':'')+'>'+v+"</td>"}).join("")+"</tr>"}
  $("xg5").innerHTML=h+"</tbody>";
  $("xg5").addEventListener("click",function(ev){var t=ev.target.closest("td");if(!t)return;
    var p=$("xg5").querySelector("td.sel");if(p)p.classList.remove("sel");t.classList.add("sel");$("xnb").textContent=t.dataset.c;$("xfv").textContent=t.textContent});
  $("xg5").querySelector("td").classList.add("sel");
})();
function enviar(){
  if(m4.enviado)return;m4.enviado=true;
  var e1=m4.erros,e2=m5.erros,er=e1+e2,
  d={nome:jogador,setor:setor,modulo:"Módulo 4: O perigo de compartilhar informações",acertos:Math.max(0,1-e1)+Math.max(0,1-e2),erros:er,pontos:Math.max(0,10-5*e1)+Math.max(0,10-5*e2),selo:"Post Seguro",quedas:er,escolhas:m4.escolhas.join(">")+"|"+m5.escolhas.join(">"),dataHora:new Date().toISOString()};
  EG.concluir("4");enviarDados(d);
}
$("m3Done").addEventListener("click",iniciar5);
$("m5Done").addEventListener("click",function(){
  enviar();var er=m4.erros+m5.erros;$("selo3").innerHTML=ICS.escudo;
  $("r3Pts").textContent=(Math.max(0,10-5*m4.erros)+Math.max(0,10-5*m5.erros))+" de 20 pontos";
  $("r3Txt").textContent=er===0?"Você avaliou a foto inteira antes de publicar e confirmou autorização e canal seguro antes de enviar a planilha. Pensar antes de compartilhar protege você, os clientes e a empresa.":"Cada tentativa mostrou um risco novo. Agora você sabe: avalie a imagem inteira antes de publicar e, antes de compartilhar dados pessoais, confirme a necessidade, a autorização e o canal seguro.";
  tela("resP");
});
$("r3Again").addEventListener("click",iniciar);
iniciar();
