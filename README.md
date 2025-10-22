# 💼 Carteira de Investimentos — 10 Anos (atualizando)

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

## 🖼️ Interface

- Design responsivo e intuitivo
- Ícones para cada tipo de ativo (ações, FIIs, renda fixa, ETFs, criptoativos)
- Botões estilizados com cores e emojis para facilitar a navegação

---

## 🗂 Estrutura do repositório
📦 projeto/

---

## 📌 Requisitos da planilha

A planilha deve ter a primeira linha com os seguintes cabeçalhos:

- Ativo  
- Ticker  
- Tipo  
- Alocação (R$)  
- Yield Anual (%)  
- Dividendos 04/09/2025  
- Cotas aproximado  
- Cotação atual  
- Custodiado  
- Observação

> Formato recomendado: `.xlsx` (Excel). Valores numéricos podem usar vírgula como separador decimal; o script normaliza para leitura.

---

## 🛠️ Tecnologias

- HTML5  
- CSS3  
- JavaScript (ES6)  
- [Chart.js](https://www.chartjs.org/) para gráficos  
- [SheetJS](https://sheetjs.com/) para leitura de arquivos Excel

---

## 📥 Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/glauciomp/seu-repositorio.git

---

## ✨ Autor
Gláucio M. Pereira — github.com/glauciomp

