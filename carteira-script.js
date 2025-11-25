/* carteira-script.js --> */

let dadosAtivos = [];
let graficoPizza = null;

document.addEventListener('DOMContentLoaded', () => {
  const inputArquivo = document.getElementById('arquivoCsv');
  const tabelaContainer = document.getElementById('tabela-container');
  const statusArquivo = document.getElementById('status-arquivo');
  const tituloDados = document.getElementById('titulo-dados');

  const filtroTipo = document.getElementById('filtro-tipo');
  const filtroYield = document.getElementById('filtro-yield');
  const filtroDividendos = document.getElementById('filtro-dividendos');
  const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
  const btnLimparFiltros = document.getElementById('btn-limpar-filtros');

  // Carrega dados do localStorage, se existirem
  const dadosSalvos = localStorage.getItem('dadosCarteira');
  if (dadosSalvos) {
    dadosAtivos = JSON.parse(dadosSalvos);
    tituloDados.textContent = 'Visão Geral Carteira de Investimentos - Tipo: 10 anos';
    tabelaContainer.innerHTML = gerarCards(dadosAtivos);
    statusArquivo.textContent = 'Dados carregados automaticamente do armazenamento local.';
    statusArquivo.style.color = 'green';
  } else {
    statusArquivo.textContent = 'AVISO: Nenhum arquivo de dados carregado. Por favor, selecione seu arquivo Excel (.xlsx).';
  }

  // Leitura da planilha
  inputArquivo.addEventListener('change', (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo || !arquivo.name.endsWith('.xlsx')) {
      statusArquivo.textContent = 'ERRO: Selecione um arquivo .xlsx válido.';
      statusArquivo.style.color = 'red';
      return;
    }

    statusArquivo.textContent = `Arquivo "${arquivo.name}" selecionado. Carregando...`;
    statusArquivo.style.color = 'blue';

    const leitor = new FileReader();
    leitor.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const aba = workbook.SheetNames[0];
      const dados = XLSX.utils.sheet_to_json(workbook.Sheets[aba], { defval: '' });

      // Verificação de campos obrigatórios
      const camposEsperados = ['Ativo', 'Ticker', 'Tipo', 'Alocação (R$)', 'Yield Anual (%)', 'Dividendos 04/09/2025'];
      const camposPresentes = Object.keys(dados[0] || {});
      const camposFaltando = camposEsperados.filter(campo => !camposPresentes.includes(campo));

      if (camposFaltando.length > 0) {
        statusArquivo.textContent = `A planilha está incompleta. Faltam os campos: ${camposFaltando.join(', ')}`;
        statusArquivo.style.color = 'red';
        return;
      }

      dadosAtivos = dados;
      localStorage.setItem('dadosCarteira', JSON.stringify(dados));
      tituloDados.textContent = 'Visão Geral Carteira de Investimentos - Tipo: 10 anos';
      tabelaContainer.innerHTML = gerarCards(dadosAtivos);
      statusArquivo.textContent = `Arquivo "${arquivo.name}" carregado com sucesso.`;
      statusArquivo.style.color = 'green';
    };

    leitor.onerror = function () {
      statusArquivo.textContent = 'ERRO: Falha ao ler o arquivo.';
      statusArquivo.style.color = 'red';
    };

    leitor.readAsArrayBuffer(arquivo);
  });

  // Aplicar filtros
  btnAplicarFiltros.addEventListener('click', () => {
    const tipo = filtroTipo.value;
    const yieldMin = parseFloat(filtroYield.value) || 0;
    const divMin = parseFloat(filtroDividendos.value) || 0;

    const filtrados = dadosAtivos.filter(linha => {
      const tipoOriginal = linha['Tipo']?.trim() || '';
      let tipoBase = tipoOriginal;
      if (tipoOriginal.startsWith('Ação')) tipoBase = 'Ação';
      if (tipoOriginal.startsWith('FII')) tipoBase = 'FII';

      const tipoKey = tipoBase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '');

      if (tipo && tipo !== tipoKey) return false;

      const yieldVal = parseFloat((linha['Yield Anual (%)'] || '0').toString().replace(',', '.'));
      if (yieldVal < yieldMin) return false;

      const divVal = parseFloat((linha['Dividendos 04/09/2025'] || '0').toString().replace(',', '.'));
      if (divVal < divMin) return false;

      return true;
    });

    tabelaContainer.innerHTML = gerarCards(filtrados);
  });

  // Limpar filtros
  btnLimparFiltros.addEventListener('click', () => {
    filtroTipo.value = '';
    filtroYield.value = '';
    filtroDividendos.value = '';

    if (dadosAtivos.length > 0) {
      tabelaContainer.innerHTML = gerarCards(dadosAtivos);
    } else {
      tabelaContainer.innerHTML = `
        <p>
          Dados removidos. Carregue uma nova planilha.
        </p>
      `;
      tituloDados.textContent = 'Aguardando os investimentos';
    }
  });
});
function formatarValor(valor, tipo) {
  if (typeof valor === 'string') {
    valor = valor.replace(/R\$/g, '').replace(/\s/g, '').replace(/,/g, '.');
  }
  let numero = parseFloat(valor);
  if (isNaN(numero)) return valor;

  if (tipo === 'Yield Anual (%)') return `${numero.toFixed(2)}%`;
  if (tipo === 'Cotas aproximado') return `${Math.round(numero)}`;

  return `R$ ${numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function gerarCards(dados) {
  let html = '<div id="cards-container">';
  dados.forEach(linha => {
    const tipoOriginal = linha['Tipo']?.trim() || '';
    let tipoBase = tipoOriginal;
    if (tipoOriginal.startsWith('Ação')) tipoBase = 'Ação';
    if (tipoOriginal.startsWith('FII')) tipoBase = 'FII';

    const tipoClasse = tipoBase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-');
    const tipoKey = tipoBase.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '');

    const icones = {
      'acao': '📈',
      'fii': '🏢',
      'rendafixa': '💰',
      'etf': '📊',
      'criptoativo': '🪙'
    };
    const icone = icones[tipoKey] || '';

    const custodiadoRaw = linha['Custodiado'];
const custodiadoLimpo = typeof custodiadoRaw === 'string' ? custodiadoRaw.replace(/R\$/g, '').replace(/\s/g, '').replace(',', '.') : custodiadoRaw;
const custodiado = parseFloat(custodiadoLimpo);
const isVazioOuZero = !custodiadoRaw || isNaN(custodiado) || custodiado === 0;

const classeAlerta = isVazioOuZero ? 'card-alerta' : '';

html += `<div class="ativo-card tipo-${tipoClasse} ${classeAlerta}">`;


    html += `
      <div class="card-header-ativo" style="grid-column: 1 / -1;">
        <h3>${icone} ${linha['Ativo'] || 'Ativo Desconhecido'}</h3>
      </div>
    `;

    html += `<div class="card-coluna col-1">
      <div class="card-item">
        <span class="card-titulo">Ticker:</span>
        <span class="card-valor">${linha['Ticker'] || ''}</span>
      </div>
    </div>`;

    html += `<div class="card-coluna col-2">
      <div class="card-item">
        <span class="card-titulo">Tipo:</span>
        <span class="card-valor">${linha['Tipo'] || ''}</span>
      </div>
      <div class="card-item">
        <span class="card-titulo">Alocação:</span>
        <span class="card-valor">${formatarValor(linha['Alocação (R$)'], 'Alocação (R$)')}</span>
      </div>
      <div class="card-item">
        <span class="card-titulo">Yield Anual:</span>
        <span class="card-valor">${formatarValor(linha['Yield Anual (%)'], 'Yield Anual (%)')}</span>
      </div>
    </div>`;

    html += `<div class="card-coluna col-3">
      <div class="card-item">
        <span class="card-titulo">Cotas a ter:</span>
        <span class="card-valor">${formatarValor(linha['Cotas aproximado'], 'Cotas aproximado')}</span>
      </div>
      <div class="card-item">
        <span class="card-titulo">Cotação atual:</span>
        <span class="card-valor">${formatarValor(linha['Cotação atual'], 'Cotação atual')}</span>
      </div>
      <div class="card-item">
        <span class="card-titulo">Dividendos:</span>
        <span class="card-valor">${formatarValor(linha['Dividendos 04/09/2025'], 'Dividendos 04/09/2025')}</span>
      </div>
      <div class="card-item">
        <span class="card-titulo">Div. x Cotas:</span>
        <span class="card-valor">${formatarValor(linha['Dividendos x cotas aproximado'], 'Dividendos x cotas aproximado')}</span>
      </div>
    </div>`;

    html += `<div class="card-coluna col-4">
  <div class="card-item">
    <span class="card-titulo">Custodiado:</span>
    <span class="card-valor">${formatarValor(linha['Custodiado'], 'Custodiado')}</span>
  </div>
  <div class="card-item">
    ${(() => {
      const alocar = parseFloat((linha['Alocação (R$)'] || '0').toString().replace(',', '.'));
      const custodiadoRaw = linha['Custodiado'];
      const custodiadoLimpo = typeof custodiadoRaw === 'string' ? custodiadoRaw.replace(/R\$/g, '').replace(/\s/g, '').replace(',', '.') : custodiadoRaw;
      const custodiado = parseFloat(custodiadoLimpo);

      const isVazioOuZero = !custodiadoRaw || isNaN(custodiado) || custodiado === 0;

      if (isVazioOuZero) {
        const tipoMensagem =
          tipoKey === 'acao' ? 'Adquirir ação' :
          tipoKey === 'fii' ? 'Adquirir FII' :
          tipoKey === 'rendafixa' ? 'Adquirir Renda Fixa' :
          tipoKey === 'etf' ? 'Adquirir ETF' :
          tipoKey === 'criptoativo' ? 'Adquirir Cripto' :
          'Adquirir ativo';

        return `
          <span class="card-titulo">Faltante:</span>
          <span class="card-valor" style="color: red; font-weight: bold;">
            ${tipoMensagem} ❗
          </span>
        `;
      }

      const diferenca = custodiado - alocar;
      const emoji = diferenca >= 0 ? '✅' : '❗';
      const cor = diferenca >= 0 ? 'green' : 'red';
      const titulo = diferenca >= 0 ? 'Meta ultrapassada em:' : 'Faltante:';
      const valorFormatado = `R$ ${Math.abs(diferenca).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      return `
        <span class="card-titulo">${titulo}</span>
        <span class="card-valor" style="color: ${cor}; font-weight: bold;">
          ${valorFormatado} ${emoji}
        </span>
      `;
    })()}
  </div>
  <div class="card-item">
    <span class="card-titulo">Observação:</span>
    <span class="card-valor">${linha['Observação'] || ''}</span>
  </div>
</div>`;


    html += `</div>`;
  });
  html += '</div>';
  return html;
}

function limparPlanilha() {
  localStorage.removeItem('dadosCarteira');
  dadosAtivos = [];

  document.getElementById('tabela-container').innerHTML = `
    <p>
      Dados removidos. Carregue uma nova planilha.
    </p>
  `;
  document.getElementById('titulo-dados').textContent = 'Aguardando os investimentos';
  document.getElementById('status-arquivo').textContent = 'Planilha removida. Selecione um novo arquivo.';
  document.getElementById('status-arquivo').style.color = 'red';
  document.getElementById('arquivoCsv').value = '';
  document.getElementById('filtro-tipo').value = '';
  document.getElementById('filtro-yield').value = '';
  document.getElementById('filtro-dividendos').value = '';
}

/* Estilo do resumo */
async function carregarCotacoesResumo() {
  const tickers = ['USD/BRL', 'PETR4', 'VALE3', 'ITSA4', 'BBAS3', 'ITUB4', 'USIM5', 'JBSS3', 'CMIG4'];
  const tabela = document.getElementById('corpo-cotacoes');
  if (!tabela) return; // segurança

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
  fetch('resumo.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('resumo-mercado').innerHTML = html;
      carregarCotacoesResumo(); // só chama depois que o HTML foi inserido
    })
    .catch(error => {
      console.error('Erro ao carregar resumo.html:', error);
    });
});
