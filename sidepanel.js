document.getElementById('btnComparar').addEventListener('click', async () => {
  const fileInput = document.getElementById('excelFile');
  if (fileInput.files.length === 0) return alert("Selecione o Excel!");

  const file = fileInput.files[0];
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "comparar", excelData: excelData });
});

let ruidoOculto = false;
document.getElementById('btnLimparRuido').addEventListener('click', async () => {
  ruidoOculto = !ruidoOculto;
  const btn = document.getElementById('btnLimparRuido');
  btn.innerText = ruidoOculto ? "👀 MOSTRAR TUDO" : "👁️ OCULTAR LINHAS 'OK'";
  btn.classList.toggle('active', ruidoOculto);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "toggleRuido", ocultar: ruidoOculto });
});