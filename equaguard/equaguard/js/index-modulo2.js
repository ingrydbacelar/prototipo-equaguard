/* ===== Módulo 2: senhas e posto de trabalho ===== */
var colegaImg="assets/img/colegaImg.webp";
var mod1Done=false,mod2Done=false,m2={erros:0,errL:false,errA:false,escolhas:[],enviado:false};
function embaralha(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function atualizaModulos(){
  var f=function(n){return EG.feito(n)};
  mod1Done=mod1Done||f("1");mod2Done=mod2Done||f("2");
  var livre={mod1:true,mod2:mod1Done,mod3:mod2Done,mod3t:mod2Done,mod4:f("3")||f("3t"),mod5:f("4")};
  var feito={mod1:mod1Done,mod2:mod2Done,mod3:f("3"),mod3t:f("3t"),mod4:f("4"),mod5:f("5")};
  Object.keys(livre).forEach(function(id){
    if(!livre[id])return;
    var c=$(id);c.disabled=false;c.classList.remove("lock");c.classList.add("on");c.removeAttribute("aria-disabled");
    c.querySelector(".ms").textContent=feito[id]?"Concluído":"Disponível";
  });
}
[["mod3","modulo3.html"],["mod3t","modulo3-tecnico.html"],["mod4","modulo4.html"],["mod5","modulo5.html"]].forEach(function(p){
  $(p[0]).addEventListener("click",function(){if(!this.disabled)location.href=p[1]});
});
$("rProx").addEventListener("click",function(){tela("modulos")});
$("mod2").addEventListener("click",function(){if(!$("mod2").disabled)tela("licao2")});
$("stage2").style.backgroundImage="url("+fundo+")";
document.querySelectorAll("#stage2 .ocl").forEach(function(o){o.style.backgroundImage="url("+fundo+")"});
$("colega").src=colegaImg;
var NOME_COL="Rafael";
function fala(q,txt){
  var c=(q===NOME_COL),v=(q==="Você");$("balC").hidden=true;$("balV").hidden=true;
  if(c||v){var el=c?$("balC"):$("balV");$(c?"balCt":"balVt").textContent=txt;el.hidden=false;el.classList.remove("pop");void el.offsetWidth;el.classList.add("pop")}
}
function opcoes(l){$("dOpts").innerHTML=l.map(function(o){return '<button class="opt" data-k="'+o.k+'">'+o.t+'</button>'}).join("")}
function aviso2(tit,txt){$("e2Tit").textContent=tit;$("e2Txt").textContent=txt;$("erro2").classList.add("on");$("e2Ok").focus()}
$("e2Ok").addEventListener("click",function(){$("erro2").classList.remove("on")});
function verEsquerda(){var v=$("vista2"),w=$("stage2").offsetWidth;v.scrollLeft=Math.max(0,w*0.47-v.clientWidth/2)}
function irParaMonitor(){var v=$("vista2");v.scrollTo({left:v.scrollWidth,behavior:"smooth"})}
$("m2Go").addEventListener("click",function(){
  m2={erros:0,errL:false,errA:false,escolhas:[],enviado:false};
  $("toff").classList.remove("on");$("hot2").hidden=true;$("m2Fim").hidden=true;$("dFb").hidden=true;
  $("colega").hidden=true;opcoes([]);fala("","");
  $("dica2").textContent="Um colega se aproxima da sua mesa.";
  tela("escritorio2");verEsquerda();
  setTimeout(function(){
    $("colega").hidden=false;
    fala(NOME_COL,"Meu acesso não foi liberado e a demanda vence hoje. Pode me emprestar seu login?");
    $("dica2").textContent="Como você responde?";
    opcoes(embaralha([{k:"emprestar",t:"Empresto e troco a senha depois"},{k:"lado",t:"Faço login e fico do lado dele"},{k:"demanda",t:"Faço a demanda por ele no meu usuário"},{k:"chamado",t:"Abro chamado urgente e aviso o gestor"}]));
  },900);
});
var M2_FB={
  emprestar:["Trocar a senha depois não desfaz o que foi feito","Enquanto o Rafael estiver com o seu login, tudo o que ele fizer ficará registrado em seu nome. E a senha pode ter sido vista, anotada ou copiada. Login é pessoal e intransferível."],
  lado:["Você continua cedendo a sua identidade","Mesmo ao lado dele, as ações saem como se fossem suas e ficam registradas no seu nome. O acesso do Rafael precisa ser do Rafael, liberado pelo caminho oficial."],
  demanda:["Você contorna o controle de acesso","Se o Rafael não tem permissão, o trabalho dele passa a correr pelo seu usuário, sem aprovação e sem registro de quem pediu. O problema de acesso continua sem solução."]
};
$("dOpts").addEventListener("click",function(ev){
  var b=ev.target.closest(".opt");if(!b)return;var k=b.dataset.k;
  if(M2_FB[k]){
    m2.escolhas.push(k);
    if(!m2.errL){m2.errL=true;m2.erros++}
    b.disabled=true;
    aviso2(M2_FB[k][0],M2_FB[k][1]);
  }else if(k==="chamado"){
    m2.escolhas.push(k);
    var txt=b.textContent;opcoes([]);fala("Você",txt);
    setTimeout(function(){fala(NOME_COL,"Ah, claro. Tem razão");$("dFb").hidden=false;$("dFb").textContent="Certo! Seu login é só seu. O chamado urgente libera o acesso pelo caminho oficial, e avisar o gestor ajuda a resolver o prazo."},1500);
    setTimeout(function(){$("dFb").hidden=true;fala(NOME_COL,"Já está livre pro almoço?");opcoes([{k:"sim",t:"Sim"}])},3600);
  }else if(k==="sim"){
    opcoes([]);fala("Você","Sim");
    setTimeout(function(){
      fala(NOME_COL,"Hm... acho que você esqueceu alguma coisa");
      $("dica2").textContent="Algo ficou para trás. A tela do seu computador está piscando: clique nela.";
      $("hot2").hidden=false;irParaMonitor();
      opcoes([{k:"almoco",t:"Ir almoçar"}]);
    },1300);
  }else if(k==="almoco"){
    m2.escolhas.push(k);
    if(!m2.errA){m2.errA=true;m2.erros++}
    aviso2("Computador ligado!","Você saiu e deixou a tela ligada e desbloqueada. Qualquer pessoa que passasse poderia usar o seu login e ver os seus dados. Volte e proteja o seu posto antes de sair.");
  }
});
$("hot2").addEventListener("click",function(){
  $("hot2").hidden=true;$("toff").classList.add("on");opcoes([]);
  $("dica2").textContent="Tela desligada.";
  fala(NOME_COL,"Agora sim! Vamos almoçar?");
  setTimeout(function(){$("m2Fim").hidden=false;$("m2Fim").scrollIntoView({behavior:"smooth",block:"center"})},1400);
});
function enviarM2(){
  if(m2.enviado)return;m2.enviado=true;
  var er=m2.erros,d={nome:jogador,setor:setor,modulo:"Módulo 2: Senhas e posto de trabalho",acertos:Math.max(0,2-er),erros:er,pontos:Math.max(0,20-10*er),selo:"Posto Seguro",quedas:er,escolhas:m2.escolhas.join(">"),dataHora:new Date().toISOString()};
  enviarDados(d);
}
$("m2Done").addEventListener("click",function(){
  mod2Done=true;EG.concluir("2");atualizaModulos();enviarM2();
  var er=m2.erros;
  $("selo2").innerHTML=ICS.escudo;
  $("r2Pts").textContent=Math.max(0,20-10*er)+" de 20 pontos";
  $("r2Txt").textContent=er===0?"Você protegeu o seu login e o seu posto de trabalho de primeira.":"Cada tentativa mostrou um cuidado novo. Agora você sabe: login é pessoal e o computador deve ficar bloqueado quando você sai.";
  tela("resultado2");
});
$("r2Mod").addEventListener("click",function(){tela("modulos")});
$("r2Ini").addEventListener("click",function(){tela("inicio")});

/* volta dos módulos 3 a 5: reabre a tela de escolha de módulo */
if(/[?&]modulos=1/.test(location.search)&&EG.d.id){jogador=EG.d.nome;setor=EG.d.setor;$("mod3t").hidden=EG.d.perfil!=="Técnico de campo";atualizaModulos();tela("modulos")}
