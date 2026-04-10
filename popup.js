document.getElementById('btnComparar').addEventListener('click', async () => {
  const fileInput = document.getElementById('excelFile');
  
  if (fileInput.files.length === 0) {
    alert("Selecione o arquivo Excel primeiro!");
    return;
  }

  if (typeof XLSX === 'undefined') {
    alert("Erro: A biblioteca Excel (xlsx.full.min.js) não foi encontrada na pasta!");
    return;
  }

  const file = fileInput.files[0];
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const excelData = XLSX.utils.sheet_to_json(worksheet);

  console.log("Dados lidos:", excelData);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: "comparar", excelData: excelData }, (response) => {
    if (chrome.runtime.lastError) {
      alert("Erro de comunicação. Recarregue a página do sistema (F5) e tente de novo.");
    } else {
      console.log("Comando enviado com sucesso!");
    }
  });
});