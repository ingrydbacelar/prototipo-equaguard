var $=function(id){return document.getElementById(id)};
function tela(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$(id).classList.add("on");window.scrollTo(0,0)}
function embaralha(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var ICS={escudo:'<svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'};

/* ===== Imagens (base64) ===== */
var fundo="assets/img/fundo.jpg";          /* escritório (o mesmo dos módulos 1 e 2) */
var imgCorredor="assets/img/imgCorredor.jpg";     /* corredor */
var imgEstac="assets/img/imgEstac.jpg";        /* estacionamento */
var imgPendrive="assets/img/imgPendrive.png";      /* pendrive com fundo transparente */

/* ===== Envio para o Google Sheets: ver js/eg-dados.js ===== */
var jogador=EG.d.nome,setor=EG.d.setor;

/* ===== TEXTOS E CENAS (edite aqui) =====
   seta: x e y em % da imagem; rot = direção da seta (0 = direita, -90 = frente/cima, 180 = esquerda) */
var M3={
  cenas:{
    escritorio:{img:fundo,
      texto:"Você está no seu escritório, como em qualquer dia de trabalho. Nas estações de trabalho é comum ver objetos esquecidos, como crachás, canetas e pendrives. Eles podem pertencer a outras pessoas, e nem sempre dá para saber de quem são. Clique na seta para seguir pelo corredor.",
      seta:{x:60,y:44,rot:0,rotulo:"Ir para o corredor",vai:"corredor"}},
    corredor:{img:imgCorredor,
      texto:"Você segue pelo corredor. Está na hora de ir até o seu carro, no estacionamento. Clique na seta para continuar.",
      seta:{x:50,y:72,rot:-90,rotulo:"Ir para o estacionamento",vai:"estacionamento"}},
    estacionamento:{img:imgEstac,
      texto:"Você chega ao estacionamento. Perto das vagas, algo brilha no chão. Clique no objeto para examiná-lo.",
      pendrive:{x:40,y:84}}
  },
  pergunta:"Você encontrou um pendrive no chão. Ele não tem nome nem identificação. O que você faz?",
  opcoes:[
    {k:"conectar",t:"Conecto o pendrive no meu computador para descobrir de quem é"},
    {k:"entregar",t:"Não conecto. Entrego à área responsável"},
    {k:"jogar",t:"Jogo o pendrive fora"}
  ],
  erros:{
    conectar:["Pendrive desconhecido é risco","Um pendrive achado por aí pode ter sido deixado de propósito por um golpista. Ao conectá-lo, um programa malicioso pode rodar sozinho e infectar o seu computador e a rede do Grupo Equatorial, mesmo que a sua intenção seja só descobrir o dono."],
    jogar:["Jogar fora não resolve","O pendrive pode ser de um colega, com trabalho importante dentro. E, se foi deixado de propósito, a Segurança perde a chance de analisar o dispositivo e descobrir se a empresa está sendo alvo de um ataque."]
  },
  certo:"Certo! Sem conectar, você evita o risco. A área responsável analisa o dispositivo em ambiente seguro e, se for de um colega, devolve."
};

var m3={erros:0,erradas:{},escolhas:[],enviado:false};
var $st=$("stage3");

function irCena(nome){
  var c=M3.cenas[nome];
  $st.classList.add("fade");
  setTimeout(function(){
    $st.style.backgroundImage="url("+c.img+")";
    $st.classList.remove("fade");
    $("narr3").textContent=c.texto;
    var s=$("seta3"),p=$("pen3");
    s.hidden=!c.seta;p.hidden=true;$("dock3").hidden=true;
    if(c.seta){
      s.style.left=c.seta.x+"%";s.style.top=c.seta.y+"%";
      s.querySelector("svg").style.setProperty("--r",c.seta.rot+"deg");
      $("setaT").textContent=c.seta.rotulo;s.dataset.vai=c.seta.vai;
    }
    if(c.pendrive){
      setTimeout(function(){p.style.left=c.pendrive.x+"%";p.style.top=c.pendrive.y+"%";p.hidden=false},900);
    }
  },260);
}
function iniciar(){
  m3={erros:0,erradas:{},escolhas:[],enviado:false};
  $("fim3").hidden=true;$("fb3").hidden=true;$("pen3").hidden=true;
  $("penImg").src=imgPendrive;
  tela("cena3");irCena("escritorio");
}
$("seta3").addEventListener("click",function(){irCena(this.dataset.vai)});
$("pen3").addEventListener("click",function(){
  $("pen3").hidden=true;
  $("narr3").textContent=M3.pergunta;
  $("op3").innerHTML=embaralha(M3.opcoes).map(function(o){return '<button class="opt" data-k="'+o.k+'">'+o.t+'</button>'}).join("");
  $("dock3").hidden=false;$("dock3").scrollIntoView({behavior:"smooth",block:"end"});
});
$("op3").addEventListener("click",function(ev){
  var b=ev.target.closest(".opt");if(!b)return;var k=b.dataset.k;
  m3.escolhas.push(k);
  if(M3.erros[k]){
    if(!m3.erradas[k]){m3.erradas[k]=1;m3.erros++}
    b.disabled=true;
    $("e3Tit").textContent=M3.erros[k][0];$("e3Txt").textContent=M3.erros[k][1];
    $("erro3").classList.add("on");$("e3Ok").focus();
  }else{
    $("op3").innerHTML="";
    $("fb3").textContent=M3.certo;$("fb3").hidden=false;
    $("narr3").textContent="Pendrive entregue à área responsável.";
    setTimeout(function(){$("fim3").hidden=false;$("fim3").scrollIntoView({behavior:"smooth",block:"center"})},1400);
  }
});
$("e3Ok").addEventListener("click",function(){$("erro3").classList.remove("on")});

function enviarM3(){
  if(m3.enviado)return;m3.enviado=true;
  var er=m3.erros,d={nome:jogador,setor:setor,modulo:"Módulo 3: Dispositivos perdidos",acertos:Math.max(0,1-er),erros:er,pontos:Math.max(0,10-5*er),selo:"Dispositivo Seguro",quedas:er,escolhas:m3.escolhas.join(">"),dataHora:new Date().toISOString()};
  EG.concluir("3");enviarDados(d);
}
$("m3Done").addEventListener("click",function(){
  enviarM3();var er=m3.erros;
  $("selo3").innerHTML=ICS.escudo;
  $("r3Pts").textContent=Math.max(0,10-5*er)+" de 10 pontos";
  $("r3Txt").textContent=er===0?"Você não conectou o pendrive e o entregou a quem deve analisá-lo. É assim que se protege a empresa.":"Cada tentativa mostrou um risco novo. Agora você sabe: dispositivo desconhecido não se conecta e não se descarta, entrega-se à área responsável.";
  tela("res3");
});
$("r3Again").addEventListener("click",iniciar);
iniciar();
