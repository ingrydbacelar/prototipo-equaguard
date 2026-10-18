/**
 * EquaGuard – Google Apps Script (cole TUDO no editor do Apps Script)
 *
 * O jogo envia o resultado de cada módulo; o script mantém UMA LINHA POR JOGADOR
 * na aba "Desempenho":
 *   Nome | Setor | Módulo 1 | Módulo 2 | Módulo 3 | ... | Módulo 5 | Atualizado em
 * Cada célula de módulo mostra o desempenho, ex.: "4 de 6 (67%)" = 4 acertos em 6.
 * Se a pessoa jogar o módulo de novo, a célula é atualizada. A aba "Painel" (1ª aba) é atualizada automaticamente.
 *
 * PASSOS: cole > salve > Implantar > Gerenciar implantações > lápis > Nova versão > Implantar.
 * O painel se atualiza sozinho a cada resultado recebido (também pelo menu EquaGuard).
 */
var ABA_DADOS = 'Desempenho';
var ABA_PAINEL = 'Painel';
var DIAS = 30;             // período analisado no painel (pela data da última atualização)
var LIM_VERMELHO = 0.30;   // erro >= 30% -> vermelho
var LIM_AMARELO = 0.15;    // erro >= 15% -> amarelo
var MIN_AMOSTRA = 3;       // células com menos jogadores aparecem como "–"
var AREAS_ORDEM = ['Atendimento','Comercial','Financeiro','Jurídico','Operações','Recursos Humanos','TI','Outra'];
var MODULOS = ['Módulo 1','Módulo 2','Módulo 3','Módulo 3 Técnico – Parte 2','Módulo 3 Técnico – Parte 3','Módulo 3 Técnico – Parte 4','Módulo 4','Módulo 5'];
var TITULOS = {
  'Módulo 1': 'Módulo 1 · Phishing e Engenharia Social', 'Módulo 2': 'Módulo 2 · Senhas e posto de trabalho',
  'Módulo 3': 'Módulo 3 · Dispositivos perdidos', 'Módulo 3 Técnico – Parte 2': 'Módulo 3 Técnico · Notebook e rede operacional',
  'Módulo 3 Técnico – Parte 3': 'Módulo 3 Técnico · Alerta de segurança', 'Módulo 3 Técnico – Parte 4': 'Módulo 3 Técnico · QR Code suspeito',
  'Módulo 4': 'Módulo 4 · Postar nas redes', 'Módulo 5': 'Módulo 5 · Armadilhas digitais'
};
var CAB = ['Nome', 'Setor'].concat(MODULOS).concat(['Atualizado em']);

/* ---------- recebe os resultados do jogo ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var chave = chaveModulo_(d.modulo);
    if (!chave || !d.nome) return ContentService.createTextOutput('ignorado');
    var ss = SpreadsheetApp.getActive();
    var aba = ss.getSheetByName(ABA_DADOS) || ss.insertSheet(ABA_DADOS);
    if (aba.getLastRow() === 0) {
      aba.getRange(1, 1, 1, CAB.length).setValues([CAB]).setFontWeight('bold').setBackground('#f3f5f8');
      aba.setFrozenRows(1); aba.setFrozenColumns(1);
      aba.getRange(2, 3, 1000, MODULOS.length).setNumberFormat('@');
    }
    var nome = String(d.nome).replace(/\s+/g, ' ').trim(), setor = String(d.setor || '').trim();
    var norm = function (t) { return String(t).toLowerCase().replace(/\s+/g, ' ').trim(); };
    var n = aba.getLastRow(), linha = 0;
    if (n > 1) {
      var ids = aba.getRange(2, 1, n - 1, 2).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (norm(ids[i][0]) === norm(nome) && norm(ids[i][1]) === norm(setor)) { linha = i + 2; break; }
      }
    }
    if (!linha) { linha = n + 1; aba.getRange(linha, 1, 1, 2).setValues([[nome, setor]]); }
    var a = Number(d.acertos) || 0, er = Number(d.erros) || 0, tot = a + er;
    var cel = aba.getRange(linha, 3 + MODULOS.indexOf(chave));
    cel.setNumberFormat('@').setValue(a + ' de ' + tot + ' (' + (tot ? Math.round(100 * a / tot) : 0) + '%)')
       .setHorizontalAlignment('center');
    var x = tot ? er / tot : 0;
    if (x >= LIM_VERMELHO) cel.setBackground('#fde8e8').setFontColor('#9b2c2c');
    else if (x >= LIM_AMARELO) cel.setBackground('#fdebd3').setFontColor('#8a5a00');
    else cel.setBackground('#e3f1d6').setFontColor('#2f6b12');
    aba.getRange(linha, CAB.length).setValue(new Date()).setNumberFormat('dd/MM/yyyy HH:mm');
    try { atualizarPainel(); } catch (err) { /* o painel nunca impede de gravar o resultado */ }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return ContentService.createTextOutput('EquaGuard ok'); }

// "Módulo 3 – Parte 2: Notebook..." -> "Módulo 3 Técnico – Parte 2"; "Módulo 4: ..." -> "Módulo 4"
function chaveModulo_(texto) {
  var m = /Módulo (\d)(?:\s*[–-]\s*(Parte \d))?/.exec(String(texto));
  if (!m) return null;
  var k = 'Módulo ' + m[1] + (m[2] ? ' Técnico – ' + m[2] : '');
  return MODULOS.indexOf(k) >= 0 ? k : null;
}

/* ---------- painel automático ---------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('EquaGuard')
    .addItem('Atualizar painel', 'atualizarPainel')
    .addItem('Exportar painel em PDF', 'exportarPDF').addToUi();
}

function calcular_() {
  var aba = SpreadsheetApp.getActive().getSheetByName(ABA_DADOS);
  var r = { jogadores: 0, acerto: null, erro: null, completos: null, areas: [], mods: [] };
  if (!aba || aba.getLastRow() < 2) return r;
  var v = aba.getRange(2, 1, aba.getLastRow() - 1, CAB.length).getValues();
  var corte = new Date(Date.now() - DIAS * 86400000);
  var mods = {}, porArea = {}, ac = 0, er = 0, n = 0, comp = 0;
  v.forEach(function (l) {
    var dt = l[CAB.length - 1];
    if (dt instanceof Date && dt < corte) return;
    var area = String(l[1] || 'Outra'), nome = String(l[0]) + '|' + area;
    n++; porArea[area] = 1;
    var tem = {};
    MODULOS.forEach(function (k, mi) {
      var m = /(\d+) de (\d+)/.exec(String(l[2 + mi]));
      if (!m) return;
      tem[k] = 1;
      var a = +m[1], t = +m[2];
      var o = mods[k] || (mods[k] = { modulo: k, pa: {} });
      var c = o.pa[area] || (o.pa[area] = { acertos: 0, erros: 0, nomes: {} });
      c.acertos += a; c.erros += t - a; c.nomes[nome] = 1;
      ac += a; er += t - a;
    });
    if (tem['Módulo 1'] && tem['Módulo 2'] && (tem['Módulo 3'] || tem['Módulo 3 Técnico – Parte 4']) && tem['Módulo 4'] && tem['Módulo 5']) comp++;
  });
  r.jogadores = n;
  r.acerto = ac + er ? ac / (ac + er) : null;
  r.erro = ac + er ? er / (ac + er) : null;
  r.completos = n ? comp / n : null;
  r.areas = AREAS_ORDEM.filter(function (a) { return porArea[a]; })
    .concat(Object.keys(porArea).filter(function (a) { return AREAS_ORDEM.indexOf(a) < 0; }));
  r.mods = MODULOS.filter(function (k) { return mods[k]; }).map(function (k) { return mods[k]; });
  return r;
}

function atualizarPainel() {
  var ss = SpreadsheetApp.getActive(), d = calcular_();
  var sh = ss.getSheetByName(ABA_PAINEL) || ss.insertSheet(ABA_PAINEL);
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart();
  sh.clear();
  ss.setActiveSheet(sh); ss.moveActiveSheet(1);
  sh.setHiddenGridlines(true);
  var pct = function (x) { return x == null ? '–' : Math.round(x * 100) + '%'; };
  var NC = 9;
  sh.setColumnWidth(1, 300);
  for (var c = 2; c <= NC; c++) sh.setColumnWidth(c, 110);
  sh.getRange(1, 1, 60, NC).setFontFamily('Arial').setVerticalAlignment('middle').setBackground('#ffffff');

  sh.getRange('A1').setValue('Painel EquaGuard · Segurança da Informação').setFontSize(14).setFontWeight('bold').setFontColor('#1c2733');
  sh.getRange('F1:I1').merge().setHorizontalAlignment('right').setFontColor('#5d6b7a').setFontSize(9)
    .setValue('Últimos ' + DIAS + ' dias · atualizado ' + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'dd/MM HH:mm'));
  sh.setRowHeight(1, 34);

  var kp = [
    ['A3', 'A4', 'Jogadores', String(d.jogadores), '#1c2733'],
    ['B3:C3', 'B4:C4', 'Acerto geral', pct(d.acerto), '#2f6b12'],
    ['D3:E3', 'D4:E4', 'Erro geral', pct(d.erro), '#9b2c2c'],
    ['F3:G3', 'F4:G4', 'Concluíram os 5 módulos', pct(d.completos), '#1c2733']
  ];
  kp.forEach(function (k) {
    var a = sh.getRange(k[0]), b = sh.getRange(k[1]);
    if (k[0].indexOf(':') > 0) { a.merge(); b.merge(); }
    a.setValue(k[2]).setFontSize(9).setFontColor('#5d6b7a');
    b.setValue(k[3]).setFontSize(22).setFontWeight('bold').setFontColor(k[4]);
    sh.getRange(k[0].split(':')[0] + ':' + k[1].split(':').pop()).setBackground('#f3f5f8').setHorizontalAlignment('left');
  });
  sh.setRowHeight(3, 24); sh.setRowHeight(4, 40);

  sh.getRange('A6').setValue('Taxa de erro por módulo e área').setFontWeight('bold').setFontSize(11);
  var lin = 7;
  if (!d.mods.length) { sh.getRange(lin, 1).setValue('Ainda não há resultados neste período.').setFontColor('#5d6b7a'); return; }
  var areas = d.areas.slice(0, NC - 1);
  sh.getRange(lin, 1, 1, areas.length + 1).setValues([['Módulo'].concat(areas)])
    .setFontColor('#5d6b7a').setFontSize(10).setBorder(null, null, true, null, null, null, '#d5dde5', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  var alertas = {};
  d.mods.forEach(function (t, i) {
    var row = lin + 1 + i;
    sh.getRange(row, 1).setValue(TITULOS[t.modulo] || t.modulo).setFontSize(10).setFontColor('#1c2733');
    areas.forEach(function (a, k) {
      var cel = sh.getRange(row, 2 + k), c = t.pa[a];
      cel.setHorizontalAlignment('center').setFontSize(10);
      var tot = c ? c.acertos + c.erros : 0;
      if (!c || !tot || Object.keys(c.nomes).length < MIN_AMOSTRA) { cel.setValue('–').setFontColor('#8995a3'); return; }
      var x = c.erros / tot;
      cel.setValue(Math.round(x * 100) + '%');
      if (x >= LIM_VERMELHO) { cel.setBackground('#fde8e8').setFontColor('#9b2c2c'); (alertas[TITULOS[t.modulo] || t.modulo] = alertas[TITULOS[t.modulo] || t.modulo] || []).push(a); }
      else if (x >= LIM_AMARELO) cel.setBackground('#fdebd3').setFontColor('#8a5a00');
      else cel.setBackground('#e3f1d6').setFontColor('#2f6b12');
    });
    sh.getRange(row, 1, 1, areas.length + 1).setBorder(null, null, true, null, null, null, '#e1e7ed', SpreadsheetApp.BorderStyle.SOLID);
    sh.setRowHeight(row, 26);
  });
  var fim = lin + d.mods.length;
  sh.getRange(fim + 1, 1, 1, NC).merge().setFontSize(8).setFontColor('#5d6b7a').setWrap(true)
    .setValue('Taxa de erro = erros ÷ (acertos + erros). Vermelho ≥ ' + LIM_VERMELHO * 100 + '%, amarelo ≥ ' + LIM_AMARELO * 100 + '%. Células com menos de ' + MIN_AMOSTRA + ' jogadores não são exibidas.');
  var tem = Object.keys(alertas), txt = tem.length
    ? 'Sugestão: ' + tem.map(function (t) {
        var l = alertas[t];
        return 'reforço de “' + t + '” para ' + (l.length > 1 ? l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1] : l[0]);
      }).join('; ') + '.'
    : 'Nenhuma área acima de ' + LIM_VERMELHO * 100 + '% de erro neste período.';
  sh.getRange(fim + 3, 1, 1, NC).merge().setValue(txt).setWrap(true).setBackground('#e3effa').setFontColor('#1f5a9a').setFontSize(10);
  sh.setRowHeight(fim + 3, 48);
  PropertiesService.getScriptProperties().setProperty('ultimaLinhaPainel', String(fim + 3));
}

function exportarPDF() {
  atualizarPainel();
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(ABA_PAINEL);
  var fim = PropertiesService.getScriptProperties().getProperty('ultimaLinhaPainel') || '30';
  var url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=pdf&gid=' + sh.getSheetId() +
    '&range=' + encodeURIComponent('A1:I' + fim) +
    '&portrait=false&fitw=true&gridlines=false&printtitle=false&sheetnames=false&pagenumbers=false&top_margin=0.4&bottom_margin=0.4&left_margin=0.4&right_margin=0.4';
  var nome = 'Painel EquaGuard ' + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd') + '.pdf';
  var blob = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob().setName(nome);
  DriveApp.createFile(blob);
  ss.toast('PDF salvo no Drive: ' + nome, 'EquaGuard', 8);
}
