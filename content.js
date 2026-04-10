console.log("Extensão de Conciliação Ativa na Página!");

function copiarTexto(texto, botao) {
  navigator.clipboard.writeText(texto).then(() => {
    const originalText = botao.innerText;
    botao.innerText = "✅"; 
    botao.style.color = "#28a745";
    setTimeout(() => {
      botao.innerText = originalText;
      botao.style.color = "";
    }, 1000);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "comparar") {
    const rows = document.querySelectorAll('table tr');
    const excelData = request.excelData;
    
    let encontrados = [];
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
          btnCopy.title = "Copiar Código GYG";
          btnCopy.className = "btn-copy-gyg";
          btnCopy.style.cssText = "cursor:pointer; border:none; background:none; font-size:14px; margin-left:5px; padding:0;";
          
          btnCopy.addEventListener('click', (e) => {
            e.preventDefault();
            copiarTexto(codigo, btnCopy);
          });
          
          cols[1].appendChild(btnCopy);
        }
        // ------------------------------------------

        const dadoExcel = excelData.find(item => 
          String(item['Booking Ref #'] || "").trim() === codigo
        );

        if (dadoExcel) {
          encontrados.push({ codigo: codigo, status: 'OK' });
          codigosAchadosNaTela.push(codigo);
          row.style.backgroundColor = "#d4edda";
          row.style.border = "2px solid green";
        } else {
          faltamNoExcel.push({ codigo: codigo });
          row.style.backgroundColor = "#fff3cd";
          row.style.border = "2px solid orange";
        }
      }
    });

    const faltamNoSistema = excelData.filter(item => {
      const codExcel = String(item['Booking Ref #'] || "").trim();
      return codExcel.startsWith("GYG") && !codigosAchadosNaTela.includes(codExcel);
    }).map(item => ({
      codigo: item['Booking Ref #'],
      cliente: item['Customer Name'] || 'N/A',
      data: item['Date'] || 'N/A'
    }));

    abrirRelatorio(faltamNoExcel, faltamNoSistema);
    sendResponse({status: "ok"});
  }
});

function abrirRelatorio(noExcel, noSistema) {
  const novaJanela = window.open("", "_blank");
  let html = `
    <html>
    <head>
      <title>Relatório de Conciliação</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; background-color: #f4f7f6; }
        .container { display: flex; gap: 40px; }
        .box { flex: 1; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .erro-sistema { border-top: 10px solid #dc3545; }
        .erro-excel { border-top: 10px solid #ffc107; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
        .badge-yellow { background: #fff3cd; color: #856404; padding: 4px; border-radius: 4px; font-size: 11px; }
      </style>
    </head>
    <body>
      <h1>Resultado da Conciliação</h1>
      <div class="container">
        <div class="box erro-sistema">
          <h2>❌ No Excel, mas falta no Sistema</h2>
          <table>
            <thead><tr><th>Código GYG</th><th>Info</th></tr></thead>
            <tbody>${noSistema.length > 0 ? noSistema.map(i => `<tr><td><b>${i.codigo}</b></td><td>${i.cliente} | ${i.data}</td></tr>`).join('') : '<tr><td>Tudo OK</td></tr>'}</tbody>
          </table>
        </div>
        <div class="box erro-excel">
          <h2>⚠️ No Sistema, mas falta no Excel</h2>
          <table>
            <thead><tr><th>Código GYG</th><th>Status</th></tr></thead>
            <tbody>${noExcel.length > 0 ? noExcel.map(i => `<tr><td><b>${i.codigo}</b></td><td><span class="badge-yellow">Não na Planilha</span></td></tr>`).join('') : '<tr><td>Tudo OK</td></tr>'}</tbody>
          </table>
        </div>
      </div>
      <p>Criado por <a href="https://github.com/bruninho182" target="_blank">Bruno Ferreira</a></p>
    </body>
    </html>
  `;
  novaJanela.document.write(html);
  novaJanela.document.close();
}