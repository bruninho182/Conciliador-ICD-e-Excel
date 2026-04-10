📊 Conciliador ICD - Chrome Extension
O Conciliador ICD é uma ferramenta de produtividade desenvolvida para automatizar a conferência manual de reservas entre planilhas de venda (Excel) e o sistema de relatórios da Ingresso com Desconto (ICD).

Originalmente criado para facilitar o fluxo de trabalho no setor de turismo, a extensão elimina a necessidade de busca manual (Ctrl+F) código por código, oferecendo um feedback visual imediato e relatórios detalhados de divergências.

🚀 Funcionalidades Principais
Interface em Side Panel: A extensão utiliza a API de Painel Lateral do Chrome (Manifest V3), permitindo que você navegue entre as abas do sistema sem perder a interface de upload.

Comparação Inteligente: Cruza dados de arquivos .xlsx e .xls com a tabela do sistema usando o Booking Ref # (padrão GYG) como chave primária.

Feedback Visual na Página:

🟩 Verde: Reserva encontrada e validada.

🟨 Amarelo: Reserva presente no sistema, mas ausente na planilha Excel.

🟥 Vermelho: Divergência de valores ou quantidades encontrada.

Filtro "Limpar Ruído": Botão para ocultar instantaneamente todas as linhas validadas (verdes), permitindo foco total nos erros.

Relatório de Mão Dupla: Abre uma nova aba com tabelas lado a lado mostrando o que falta no sistema e o que falta no Excel.

Exportação: Gera relatórios profissionais em PDF ou CSV para auditoria.

Botão Quick-Copy: Adiciona um ícone de cópia rápida ao lado de cada código GYG no sistema.

🛠️ Tecnologias Utilizadas
JavaScript (ES6+): Lógica principal e manipulação de DOM.

Chrome Extension API (Manifest V3): Service Workers, Side Panel e Content Scripts.

SheetJS (XLSX): Biblioteca para processamento de arquivos Excel no navegador.

CSS3: Layout responsivo para o painel lateral e relatórios.

📂 Estrutura do Projeto
Plaintext
├── manifest.json         # Configurações da extensão (V3)
├── background.js         # Service Worker para gerenciar o Side Panel
├── sidepanel.html        # Interface do painel lateral
├── sidepanel.js          # Lógica de upload e comunicação
├── content.js            # O "coração" da extensão (leitura e pintura da página)
├── xlsx.full.min.js      # Biblioteca SheetJS (local)
└── README.md             # Documentação do projeto

⚙️ Como Instalar (Modo Desenvolvedor)
Faça o download ou clone este repositório.

Abra o Google Chrome e acesse chrome://extensions/.

No canto superior direito, ative o "Modo do desenvolvedor".

Clique em "Carregar sem compactação".

Selecione a pasta onde os arquivos do projeto estão salvos.

O ícone da extensão aparecerá na sua barra (recomenda-se fixá-lo).

📖 Como Usar
Acesse o seu relatório na plataforma Ingresso com Desconto.

Clique no ícone da extensão para abrir o Painel Lateral.

Selecione o arquivo Excel exportado (ex: GetYourGuide).

Clique em "🚀 INICIAR CONCILIAÇÃO".

Analise as cores na página ou utilize o relatório gerado na nova aba.

Use o botão "OCULTAR LINHAS OK" para limpar a visualização.

Bruno Ferreira - Desenvolvedor & Technical Operator 