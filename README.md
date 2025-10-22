# 💼 Carteira de Investimentos — 10 Anos

Uma aplicação web leve e responsiva para visualizar, filtrar e analisar sua carteira de investimentos a partir de uma planilha Excel (.xlsx). Foca em usabilidade: cards detalhados, filtros rápidos, persistência local e uma página dedicada a gráficos.

---

## 🚀 Funcionalidades

- 📂 Upload de planilha Excel (.xlsx) e leitura com SheetJS  
- 🔁 Persistência dos dados entre páginas usando `localStorage`  
- 🃏 Cards detalhados por ativo com ticker, tipo, alocação, yield, cotas, dividendos, custódia e observações  
- 🔎 Filtros interativos por tipo de ativo, yield mínimo e valor de dividendos  
- 📊 Página separada para gráficos (`grafico.html`) que utiliza os mesmos dados persistidos  
- 🧹 Botão para limpar a planilha carregada (remove dados do `localStorage`)  
- 🎨 Botões estilizados com ícones para melhor experiência do usuário  
- 📈 Gráfico de pizza com distribuição por alocação usando Chart.js

---

## 🗂 Estrutura do repositório

📦 projeto/ 
├── 10anos.html # Página principal com upload, filtros e cards 
├── grafico.html # Página dedicada ao(s) gráfico(s) 
├── carteira-script.js # Lógica de leitura da planilha, renderização, filtros e persistência
├── style.css # Estilos visuais e classes de botões 
└── README.md # Este arquivo
