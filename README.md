💼 Carteira de Investimentos — 10 Anos
Uma aplicação web leve e responsiva para visualizar, filtrar e analisar sua carteira de investimentos a partir de uma planilha Excel (.xlsx). Foca em usabilidade: cards detalhados, filtros rápidos, persistência local e uma página dedicada a gráficos.

🚀 Funcionalidades
📂 Upload de planilha Excel (.xlsx) e leitura com SheetJS

🔁 Persistência dos dados entre páginas usando localStorage

🃏 Cards detalhados por ativo com ticker, tipo, alocação, yield, cotas, dividendos, custódia e observações

🔎 Filtros interativos por tipo de ativo, yield mínimo e valor de dividendos

📊 Página separada para gráficos (grafico.html) que utiliza os mesmos dados persistidos

🧹 Botão para limpar a planilha carregada (remove dados do localStorage)

🎨 Botões estilizados com ícones para melhor UX

📈 Gráfico de pizza com distribuição por alocação usando Chart.js

🗂 Estrutura do repositório
📦 projeto/
├── 10anos.html           # Página principal com upload, filtros e cards
├── grafico.html          # Página dedicada ao(s) gráfico(s)
├── carteira-script.js    # Lógica de leitura da planilha, renderização, filtros e persistência
├── style.css             # Estilos visuais e classes de botões
└── README.md             # Este arquivo

📌 Requisitos da planilha
A planilha deve ter a primeira linha com cabeçalhos exatamente como abaixo para que o parser localize os campos automaticamente:

Ativo

Ticker

Tipo

Alocação (R$)

Yield Anual (%)

Dividendos 04/09/2025

Cotas aproximado

Cotação atual

Custodiado

Observação

Formato recomendado: .xlsx (Excel). Valores numéricos podem usar vírgula como separador decimal; o script normaliza para leitura.

🛠️ Tecnologias
HTML5

CSS3

JavaScript (ES6)

Chart.js para gráficos

SheetJS (XLSX) para leitura de arquivos Excel

📥 Como usar
Clone o repositório:
Clone o repositório:

Entre na pasta do projeto e abra o arquivo 10anos.html no navegador:

Windows: duplo clique em 10anos.html ou arraste para uma janela do navegador

Ou use um servidor local (recomendado para evitar restrições de arquivos): npx http-server ou similar

Na página principal:

Clique em "Selecionar arquivo" e carregue sua planilha .xlsx

Os dados serão exibidos em cards; você pode aplicar filtros e navegar para a página de gráficos

Os dados ficam salvos no localStorage para manter a sessão ao navegar entre páginas

Para atualizar a planilha:

Use o botão 🧹 Limpar Planilha Carregada para remover os dados salvos e carregar um novo arquivo

💡 Sugestões de uso e extensões
Adicionar exportação CSV/Excel dos dados filtrados

Incluir gráficos adicionais: por tipo, por yield, evolução temporal

Validar colunas da planilha e exibir aviso se algum cabeçalho estiver faltando

Publicar via GitHub Pages para demonstrar visualmente o projeto

✅ Exemplo rápido de botões e classes (para referência)
Use essas classes para manter a aparência consistente dos botões no projeto:

.btn-voltar {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-limpar {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

📃 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usar, adaptar e redistribuir.

✨ Autor
Gláucio M. Pereira — https://github.com/glauciomp