/* script.js --> */

document.addEventListener('DOMContentLoaded', (event) => {
    const meuBotao = document.getElementById('meuBotao');

    meuBotao.addEventListener('click', () => {
        alert('Você clicou no botão! O JavaScript está funcionando.');
    });
});

/* Estilo do resumo */
async function carregarCotacoesResumo() {
  const tickers = ['USD/BRL', 'PETR4', 'VALE3', 'ITSA4', 'BBAS3', 'ITUB4', 'USIM5', 'JBSS3', 'CMIG4'];
  const tabela = document.getElementById('corpo-cotacoes');
  tabela.innerHTML = '';

  for (const ticker of tickers) {
    try {
      const res = await fetch(`https://brapi.dev/api/quote/${ticker}`);
      const dados = await res.json();
      const ativo = dados.results[0];
      const preco = ativo.regularMarketPrice.toFixed(2);
      const variacao = ativo.regularMarketChangePercent.toFixed(2);
      const cor = variacao >= 0 ? 'green' : 'red';
      const emoji = variacao >= 0 ? '📈' : '📉';

      tabela.innerHTML += `
        <tr>
          <td>${ticker}</td>
          <td>R$ ${preco}</td>
          <td style="color:${cor};">${variacao}% ${emoji}</td>
        </tr>
      `;
    } catch (erro) {
      tabela.innerHTML += `
        <tr>
          <td>${ticker}</td>
          <td colspan="2">❌ Erro ao carregar</td>
        </tr>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarCotacoesResumo();
});


/* cabeçalho fixo */
fetch('resumo.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('resumo-mercado').innerHTML = html;
  })
  .catch(error => {
    console.error('Erro ao carregar resumo.html:', error);
  });
