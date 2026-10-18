var $=function(id){return document.getElementById(id)};
function tela(id){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$(id).classList.add("on");window.scrollTo(0,0)}
function embaralha(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var ICS={escudo:'<svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'};

/* ===== Imagens (base64) ===== */
var imgRack="assets/img/imgRack.jpg";     /* equipamento no ambiente operacional */
var imgEquipe="assets/img/imgEquipe.jpg"; /* colega com o notebook, na subestação */
var imgSub="assets/img/imgSub.jpg";       /* colaborador com notebook na subestação */
var imgPainel="assets/img/imgPainel.jpg"; /* painel elétrico com adesivo de QR Code */

/* ===== Envio para o Google Sheets: ver js/eg-dados.js ===== */
var jogador=EG.d.nome,setor=EG.d.setor;

/* ===== SITUAÇÕES (edite aqui) =====
   pergunta, opcoes (k = chave), erros (só as erradas), certo, fim (lição), modulo/selo (planilha) */
var SIT=[
 {
  "modulo": "Módulo 3 – Parte 2: Notebook e rede operacional",
  "selo": "Rede Protegida",
  "pergunta": "O colega insiste que é rapidinho. O que você faz?",
  "opcoes": [
   {
    "k": "conectar",
    "t": "Aceito. Só vou abrir um documento, não tem risco."
   },
   {
    "k": "minutos",
    "t": "Conecto só por alguns minutos e desconecto em seguida."
   },
   {
    "k": "antivirus",
    "t": "Aceito, desde que o colega garanta que o notebook tem antivírus."
   },
   {
    "k": "autorizado",
    "t": "Recuso e peço o documento ao responsável pelo serviço, pelo canal oficial."
   }
  ],
  "erros": {
   "conectar": [
    "Abrir um documento não torna a conexão segura",
    "O notebook pessoal está fora do controle da empresa e pode ter vírus sem que ninguém saiba. Ao ser ligado na rede ou numa porta do equipamento, ele pode abrir caminho até os sistemas que comandam a subestação, mesmo que a intenção seja só ler um arquivo."
   ],
   "minutos": [
    "Pouco tempo não diminui o risco",
    "Um programa malicioso age em segundos. Não importa quanto tempo o notebook fica conectado: equipamento não autorizado não entra na rede operacional."
   ],
   "antivirus": [
    "Antivírus não é autorização",
    "Mesmo com antivírus, ninguém sabe o que está instalado no notebook pessoal nem se ele está atualizado. Na rede operacional, só entra equipamento autorizado pela empresa, sem exceção."
   ]
  },
  "certo": "Certo! Você resolveu o problema sem colocar a rede em risco: o documento chega pelo caminho oficial e nenhum equipamento desconhecido encosta na rede operacional.",
  "fim": {
   "t": "Rede operacional protegida",
   "p": "Um equipamento não autorizado na rede operacional pode colocar em risco os sistemas que mantêm a energia funcionando. Por isso:",
   "u": [
    "Na rede operacional, só entra equipamento autorizado pela empresa.",
    "Notebook ou celular pessoal não se conecta à rede nem às portas dos equipamentos, nem por um minuto.",
    "Precisa de um documento ou de um acesso? Peça ao responsável pelo serviço, pelo canal oficial."
   ]
  }
 },
 {
  "modulo": "Módulo 3 – Parte 3: Alerta de segurança",
  "selo": "Incidente Reportado",
  "pergunta": "O que você faz?",
  "opcoes": [
   {
    "k": "ignorar",
    "t": "Fecho o alerta e termino o serviço. Depois eu vejo isso."
   },
   {
    "k": "baixar",
    "t": "Baixo um antivírus da internet para resolver na hora."
   },
   {
    "k": "desligar",
    "t": "Desligo o notebook e não comento com ninguém, para não atrasar mais a equipe."
   },
   {
    "k": "incidente",
    "t": "Paro de usar o notebook e aviso na hora o responsável pelo serviço e a TI."
   }
  ],
  "erros": {
   "ignorar": [
    "Ignorar o alerta deixa o problema crescer",
    "Alerta na tela e equipamento se comportando de forma estranha podem ser sinais de vírus. Continuar usando pode espalhar o problema para outros sistemas da subestação. Um serviço atrasado é muito menos grave que um incidente fora de controle."
   ],
   "baixar": [
    "Um programa da internet pode piorar tudo",
    "Programa sem autorização pode ser, ele mesmo, um vírus. E mesmo que não seja, mexer por conta própria pode apagar pistas e atrapalhar quem vai investigar."
   ],
   "desligar": [
    "Esconder o problema não resolve",
    "Desligar e ficar em silêncio pode apagar pistas importantes e deixa a Segurança sem saber o que aconteceu. Se o vírus já se espalhou, outros equipamentos continuam em risco. Avisar rápido é o que limita o estrago."
   ]
  },
  "certo": "Certo! Parar de usar e avisar rápido é o que limita o estrago: quem tem preparo para isso consegue analisar e conter o problema antes que ele se espalhe.",
  "fim": {
   "t": "Alerta de segurança: pare e avise",
   "p": "Alerta inesperado e comportamento estranho podem ser sinais de infecção. Mesmo com prazo apertado:",
   "u": [
    "Pare de usar o equipamento.",
    "Avise na hora o responsável pelo serviço e a TI ou a Segurança.",
    "Não instale programas nem tente consertar sozinho.",
    "Anote o que apareceu na tela: isso ajuda quem vai investigar."
   ]
  }
 },
 {
  "modulo": "Módulo 3 – Parte 4: QR Code suspeito",
  "selo": "QR Verificado",
  "pergunta": "O que você faz?",
  "opcoes": [
   {
    "k": "escanear",
    "t": "Escaneio com o meu celular, só para ver do que se trata."
   },
   {
    "k": "colega",
    "t": "Peço para um colega escanear primeiro."
   },
   {
    "k": "arrancar",
    "t": "Arranco o adesivo e sigo o trabalho, sem avisar ninguém."
   },
   {
    "k": "oficial",
    "t": "Não escaneio, confirmo com o responsável e aviso a Segurança sobre o adesivo."
   }
  ],
  "erros": {
   "escanear": [
    "QR Code desconhecido é um link escondido",
    "Você não sabe para onde ele leva nem quem o colou ali. Ele pode abrir um site falso que rouba sua senha ou instalar um programa malicioso no seu celular, que tem acesso a e-mails e aplicativos da empresa."
   ],
   "colega": [
    "Você só passa o risco para o colega",
    "O problema continua sendo escanear o código: o colega fica exposto ao mesmo golpe e ninguém verificou de onde veio o adesivo."
   ],
   "arrancar": [
    "Tirar o adesivo não basta",
    "Você eliminou um risco, mas ninguém ficou sabendo da tentativa. Se o golpista colou outros adesivos em mais locais, os colegas continuam expostos. Avise a Segurança para que ela trate o caso."
   ]
  },
  "certo": "Certo! Você não caiu na isca e ainda avisou quem pode verificar se há outros adesivos espalhados.",
  "fim": {
   "t": "QR Code desconhecido: confirme antes",
   "p": "Golpistas colam QR Codes em locais físicos para levar a sites falsos ou instalar programas maliciosos. Esse golpe tem nome: quishing. O certo é:",
   "u": [
    "Não escanear QR Code de origem desconhecida, nem por curiosidade.",
    "Confirmar qualquer novo procedimento com o responsável.",
    "Acessar procedimentos só pelo canal oficial da empresa.",
    "Avisar a Segurança sobre o adesivo."
   ]
  }
 }
];

/* ===== TEXTOS DAS CENAS (edite aqui) ===== */
var TX={
 "rack": "Você está na subestação, fazendo manutenção em um equipamento. Para continuar, precisa consultar um documento técnico que não está com você. Clique na seta para voltar até a equipe.",
 "equipe": "Do lado de fora, um colega se aproxima com o notebook pessoal dele.",
 "fala": "Usa o meu notebook! É só ligar no cabo de rede ou numa porta do equipamento ali dentro. Rapidinho você acha o documento.",
 "sub1": "Mais tarde, você está com o notebook corporativo da equipe, liberado pela empresa, consultando informações técnicas perto de um painel.",
 "sub2": "Uma mensagem aparece na tela. Clique nela para ler.",
 "alerta": "Alerta de segurança: atividade suspeita detectada neste dispositivo.",
 "sub3": "Logo depois, o notebook fica lento e começa a abrir janelas sozinho. O serviço está atrasado e a equipe está esperando por você.",
 "qr1": "Durante uma inspeção na subestação, você encontra um adesivo com QR Code colado perto de um painel elétrico. Clique no adesivo para ver de perto.",
 "qrMsg": "Ao lado do código, um aviso: “Novo procedimento de manutenção: acesse aqui.” Você não recebeu nenhum comunicado oficial sobre isso."
};

var cur=0,res=[],m3,T=[],$st=$("stage3");
function agenda(f,ms){T.push(setTimeout(f,ms))}
function limpa(){T.forEach(clearTimeout);T=[];["seta3","bal3","hot3","dock3","al3","fb3","fim3"].forEach(function(i){$(i).hidden=true});$("op3").innerHTML=""}
function fundo(img,cb){$st.classList.add("fade");agenda(function(){$st.style.backgroundImage="url("+img+")";$st.classList.remove("fade");if(cb)cb()},260)}
function opcoes(){
  var s=SIT[cur];$("narr3").textContent=s.pergunta;
  $("op3").innerHTML=embaralha(s.opcoes).map(function(o){return '<button class="opt" data-k="'+o.k+'">'+o.t+'</button>'}).join("");
  $("dock3").hidden=false;$("dock3").scrollIntoView({behavior:"smooth",block:"end"});
}
function hot(cls,x,y,w,h,html){var b=$("hot3");b.className=cls;b.style.left=x+"%";b.style.top=y+"%";b.style.width=w+"%";b.style.height=h+"%";b.innerHTML=html;b.hidden=false}
var ALERTA_SVG='<span>'+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5"/><path d="M12 18.2v.1"/></svg>'+'Alerta</span>';
function situacao(n){
  cur=n;limpa();m3={erros:0,erradas:{},escolhas:[],enviado:false};
  $("modL").textContent="Módulo 3: Rede operacional · Situação "+(n+1)+" de "+SIT.length;
  tela("cenaP");
  if(n===0){
    $st.style.backgroundImage="url("+imgRack+")";$("narr3").textContent=TX.rack;
    var s=$("seta3");s.style.left="16%";s.style.top="84%";s.querySelector("svg").style.setProperty("--r","180deg");$("setaT").textContent="Voltar para a equipe";s.hidden=false;
  }else if(n===1){
    $st.style.backgroundImage="url("+imgSub+")";$("narr3").textContent=TX.sub1;
    agenda(function(){hot("tl",33,52,19,25,ALERTA_SVG);$("narr3").textContent=TX.sub2},1800);
  }else{
    $st.style.backgroundImage="url("+imgPainel+")";$("narr3").textContent=TX.qr1;
    agenda(function(){hot("qr",47.5,37,12.5,24,"")},1200);
  }
}
$("seta3").addEventListener("click",function(){
  $("seta3").hidden=true;
  fundo(imgEquipe,function(){
    $("narr3").textContent=TX.equipe;
    agenda(function(){$("balT").textContent=TX.fala;$("bal3").hidden=false},800);
    agenda(opcoes,2600);
  });
});
$("hot3").addEventListener("click",function(){
  $("hot3").hidden=true;var al=$("al3");
  if(cur===1){
    al.className="alerta";al.textContent=TX.alerta;al.hidden=false;$("dock3").hidden=false;
    agenda(function(){$("narr3").textContent=TX.sub3},1500);agenda(opcoes,3500);
  }else{
    al.className="alerta msg";al.textContent=TX.qrMsg;al.hidden=false;opcoes();
  }
});
$("op3").addEventListener("click",function(ev){
  var b=ev.target.closest(".opt");if(!b)return;var k=b.dataset.k,s=SIT[cur];m3.escolhas.push(k);
  if(s.erros[k]){
    if(!m3.erradas[k]){m3.erradas[k]=1;m3.erros++}
    b.disabled=true;$("e3Tit").textContent=s.erros[k][0];$("e3Txt").textContent=s.erros[k][1];
    $("erro3").classList.add("on");$("e3Ok").focus();
  }else{
    $("op3").innerHTML="";$("al3").hidden=true;$("fb3").textContent=s.certo;$("fb3").hidden=false;
    $("narr3").textContent="Decisão correta.";
    $("fimT").textContent=s.fim.t;$("fimP").textContent=s.fim.p;
    $("fimU").innerHTML=s.fim.u.map(function(x){return "<li>"+x+"</li>"}).join("");
    $("m3Done").textContent=cur<SIT.length-1?"Próxima situação":"Concluir módulo";
    agenda(function(){$("fim3").hidden=false;$("fim3").scrollIntoView({behavior:"smooth",block:"center"})},1400);
  }
});
$("e3Ok").addEventListener("click",function(){$("erro3").classList.remove("on")});
function enviar(){
  if(m3.enviado)return;m3.enviado=true;var s=SIT[cur],er=m3.erros;
  var d={nome:jogador,setor:setor,modulo:s.modulo,acertos:Math.max(0,1-er),erros:er,pontos:Math.max(0,10-5*er),selo:s.selo,quedas:er,escolhas:m3.escolhas.join(">"),dataHora:new Date().toISOString()};
  res[cur]=er;
  if(cur===SIT.length-1)EG.concluir("3t");
  enviarDados(d);
}
$("m3Done").addEventListener("click",function(){
  enviar();
  if(cur<SIT.length-1){situacao(cur+1);return}
  var tot=0;res.forEach(function(e){tot+=Math.max(0,10-5*e)});var erT=res.reduce(function(a,b){return a+b},0);
  $("selo3").innerHTML=ICS.escudo;$("r3Pts").textContent=tot+" de "+(10*SIT.length)+" pontos";
  $("r3Txt").textContent=erT===0?"Você protegeu a subestação em todas as situações: não conectou equipamento desconhecido, reportou o alerta e não caiu no QR Code falso.":"Cada erro mostrou um risco real do campo. Lembre-se: na rede operacional só entra o que é autorizado, alerta se reporta na hora e QR Code desconhecido não se escaneia.";
  tela("resP");
});
$("goP").addEventListener("click",function(){res=[];situacao(0)});
$("r3Again").addEventListener("click",function(){tela("licaoP")});
