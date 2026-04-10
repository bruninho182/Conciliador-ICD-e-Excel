console.log("Extensão de Conciliação Ativa na Página!");

function copiarTexto(texto, botao) {
  navigator.clipboard.writeText(texto).then(() => {
    const originalText = botao.innerText;
    botao.innerText = "✅";
    setTimeout(() => { botao.innerText = originalText; }, 1000);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "toggleRuido") {
    const rows = document.querySelectorAll('table tr');
    rows.forEach(row => {
      if (row.style.backgroundColor === "rgb(212, 237, 218)") { // Cor verde
        row.style.display = request.ocultar ? "none" : "";
      }
    });
    return;
  }

  if (request.action === "comparar") {
    const rows = document.querySelectorAll('table tr');
    const excelData = request.excelData;
    let faltamNoExcel = [];
    let codigosAchadosNaTela = [];

    rows.forEach(row => {
      const cols = row.querySelectorAll('td');
      if (cols.length < 5) return;

      const texto = cols[1]?.innerText || "";
      const matchGYG = texto.match(/GYG[A-Z0-9]+/);

      if (matchGYG) {
        const codigo = matchGYG[0];
        
        if (!cols[1].querySelector('.btn-copy-gyg')) {
          const btnCopy = document.createElement('button');
          btnCopy.innerText = " 📋";
          btnCopy.title = "Copiar GYG";
          btnCopy.style.cssText = "cursor:pointer; border:none; background:none; font-size:14px; margin-left:5px;";
          btnCopy.onclick = (e) => { e.preventDefault(); copiarTexto(codigo, btnCopy); };
          cols[1].appendChild(btnCopy);
        }

        const dadoExcel = excelData.find(item => String(item['Booking Ref #'] || "").trim() === codigo);

        if (dadoExcel) {
          codigosAchadosNaTela.push(codigo);
          row.style.backgroundColor = "#d4edda"; // Verde
          row.style.border = "2px solid green";
        } else {
          faltamNoExcel.push({ codigo: codigo });
          row.style.backgroundColor = "#fff3cd"; // Amarelo
          row.style.border = "2px solid orange";
        }
      }
    });

    const faltamNoSistema = excelData.filter(item => {
      const codExcel = String(item['Booking Ref #'] || "").trim();
      return codExcel.startsWith("GYG") && !codigosAchadosNaTela.includes(codExcel);
    }).map(item => ({ 
      codigo: item['Booking Ref #'], 
      info: (item['Customer Name'] || 'N/A') + " | " + (item['Date'] || '') 
    }));

    abrirRelatorio(faltamNoExcel, faltamNoSistema);
    sendResponse({status: "ok"});
  }
});

function abrirRelatorio(noExcel, noSistema) {
  const novaJanela = window.open("", "_blank");
  const dataHora = new Date().toLocaleString();

  let html = `
    <html>
    <head>
      <title>Relatório de Conciliação</title>
      <style>
        body { font-family: 'Work Sans', sans-serif; padding: 30px; background-color: #f0f2f5; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .btn-group { margin-bottom: 20px; }
        button { padding: 12px 20px; margin-right: 10px; cursor: pointer; border-radius: 6px; border: none; font-weight: bold; transition: 0.2s; }
        .btn-pdf { background: #e74c3c; color: white; }
        .btn-excel { background: #27ae60; color: white; }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        
        /* LÓGICA LADO A LADO */
        .container { display: flex; gap: 20px; align-items: flex-start; }
        .box { flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-height: 400px; }
        
        .box-red { border-top: 8px solid #dc3545; }
        .box-yellow { border-top: 8px solid #ffc107; }
        
        h2 { font-size: 18px; margin-top: 0; display: flex; justify-content: space-between; }
        .count { background: #eee; padding: 2px 10px; border-radius: 20px; font-size: 14px; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
        th { background: #fafafa; color: #666; text-transform: uppercase; font-size: 11px; }
        tr:hover { background: #fdfdfd; }
        b { color: #000; }

        @media print { .btn-group { display: none; } body { background: white; padding: 0; } .box { box-shadow: none; border: 1px solid #ddd; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display:flex; align-items:center; gap:15px;">
           <span style="font-size: 40px;">📊</span>
           <div>
             <h1 style="margin:0; font-size:22px;">Relatório de Conciliação</h1>
             <small>Gerado em: ${dataHora}</small>
           </div>
        </div>
        <div class="btn-group">
          <button class="btn-pdf" onclick="window.print()">📄 SALVAR EM PDF</button>
          <button class="btn-excel" onclick="exportarCSV()">📊 EXPORTAR EXCEL</button>
        </div>
      </div>

      <div class="container">
        <div class="box box-red">
          <h2>❌ No Excel, mas falta no Sistema <span class="count">${noSistema.length}</span></h2>
          <p style="font-size:12px; color:#666;">Estas reservas estão na planilha, mas não apareceram no relatório da página.</p>
          <table>
            <thead><tr><th>Código GYG</th><th>Informações Adicionais</th></tr></thead>
            <tbody>
              ${noSistema.length > 0 ? noSistema.map(i => `<tr><td><b>${i.codigo}</b></td><td>${i.info}</td></tr>`).join('') : '<tr><td colspan="2">Nenhuma divergência.</td></tr>'}
            </tbody>
          </table>
        </div>

        <div class="box box-yellow">
          <h2>⚠️ No Sistema, mas falta no Excel <span class="count">${noExcel.length}</span></h2>
          <p style="font-size:12px; color:#666;">Estas reservas estão na tela, mas não constam na planilha que você carregou.</p>
          <table>
            <thead><tr><th>Código GYG</th><th>Status</th></tr></thead>
            <tbody>
              ${noExcel.length > 0 ? noExcel.map(i => `<tr><td><b>${i.codigo}</b></td><td><span style="color:#856404; background:#fff3cd; padding:2px 6px; border-radius:4px;">Não na Planilha</span></td></tr>`).join('') : '<tr><td colspan="2">Nenhuma divergência.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <script>
        function exportarCSV() {
          let csv = "Tipo;Codigo;Info\\n";
          ${noSistema.map(i => `csv += "No Excel mas nao no Sistema;${i.codigo};${i.info}\\n";`).join('')}
          ${noExcel.map(i => `csv += "No Sistema mas nao no Excel;${i.codigo};N/A\\n";`).join('')}
          const blob = new Blob(["\\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "divergencias_gyg.csv");
          link.click();
        }
      </script>
       <p>Criado por <a href="https://github.com/bruninho182" target="_blank">Bruno Ferreira</a></p>
    </body>
    </html>
  `;
  novaJanela.document.write(html);
  novaJanela.document.close();
}

