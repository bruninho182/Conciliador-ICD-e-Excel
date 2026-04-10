# 📊 Conciliador ICD PRO - Extensão para Google Chrome

O **Conciliador ICD PRO** é uma ferramenta de produtividade robusta desenvolvida para automatizar a conferência de reservas entre planilhas de venda (Excel) e o sistema de relatórios da **Ingresso com Desconto (ICD)**.

Esta extensão foi projetada para eliminar o trabalho manual de conferência, reduzindo erros humanos e otimizando o tempo de operadores técnicos no setor de turismo.

---

## 🚀 Principais Funcionalidades

### 🖥️ Interface em Painel Lateral (Side Panel)
Aproveitando as tecnologias mais recentes do **Manifest V3**, a extensão funciona em um painel lateral fixo. Isso permite que você mude de aba ou navegue no sistema sem que a interface de upload desapareça.

### 🔍 Comparação Inteligente e Automática
O robô identifica automaticamente os códigos de reserva (padrão **GYG**) tanto na página web quanto no Excel, realizando o cruzamento de dados instantaneamente.

### 🎨 Feedback Visual Instantâneo
As linhas da tabela no sistema são coloridas automaticamente para facilitar a leitura:
- **Verde (OK):** Reserva encontrada na planilha e validada.
- **Amarelo (Atenção):** Reserva presente no sistema, mas não encontrada no Excel.
- **Vermelho (Erro):** Divergência detectada em valores ou quantidades.

### 🧹 Filtro "Limpar Ruído"
Com um único clique, você pode ocultar todas as reservas que já estão conferidas (verdes), deixando na tela apenas os itens que precisam de atenção manual.

### 📋 Relatório Lado a Lado
Geração automática de uma nova aba com um relatório detalhado e organizado em duas colunas:
1. O que consta no Excel mas falta no sistema.
2. O que consta no sistema mas falta no Excel.

---

## 🛠️ Tecnologias Utilizadas

- **JavaScript (ES6+):** Lógica de comparação e manipulação dinâmica de DOM.
- **Chrome Extension API (Manifest V3):** Uso de Service Workers e Side Panel.
- **SheetJS (XLSX.js):** Processamento de arquivos Excel diretamente no cliente.
- **HTML5 & CSS3:** Interface responsiva e relatórios formatados.

---

## 📂 Estrutura do Projeto

```text
├── manifest.json         # Manifesto de configuração da extensão
├── background.js         # Gerencia o comportamento do Painel Lateral
├── sidepanel.html        # Interface visual do painel
├── sidepanel.js          # Lógica de processamento do Excel
├── content.js            # Script que interage com a página do sistema
├── xlsx.full.min.js      # Biblioteca para leitura de Excel
└── README.md             # Documentação do projeto
```
---

⚙️ Instruções de Instalação
-Faça o download ou clone este repositório para o seu computador.

-Abra o Google Chrome e vá para chrome://extensions/.

-No canto superior direito, ative o "Modo do desenvolvedor".

-Clique no botão "Carregar sem compactação".

-Selecione a pasta onde os arquivos estão localizados.

-Fixe o ícone da extensão na sua barra de ferramentas para facilitar o acesso.


📖 Como Utilizar
-Acesse o relatório desejado no portal Ingresso com Desconto.

-Clique no ícone da extensão para abrir o painel lateral.

-Selecione o arquivo Excel (ex: extraído do GetYourGuide ou Headout).

-Clique em "🚀 INICIAR CONCILIAÇÃO".

-Utilize o botão "OCULTAR LINHAS OK" para focar apenas nas divergências.

-Se necessário, exporte o relatório final em PDF ou CSV através da aba de resultados que será aberta.


Desenvolvido por Bruno – Especialista em automação.



