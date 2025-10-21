document.addEventListener('DOMContentLoaded', () => {
  const inputArquivo = document.getElementById('arquivoCsv');
  const tabelaContainer = document.getElementById('tabela-container');
  const statusArquivo = document.getElementById('status-arquivo');

  statusArquivo.textContent = 'AVISO: Nenhum arquivo de dados carregado. Por favor, selecione seu arquivo Excel (.xlsx).';

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
      const html = gerarCards(dados);
      tabelaContainer.innerHTML = html;
      statusArquivo.textContent = `Arquivo "${arquivo.name}" carregado com sucesso.`;
      statusArquivo.style.color = 'green';
    };
    leitor.onerror = function () {
      statusArquivo.textContent = 'ERRO: Falha ao ler o arquivo.';
      statusArquivo.style.color = 'red';
    };
    leitor.readAsArrayBuffer(arquivo);
  });
});

function formatarValor(valor, tipo) {
  if (typeof valor === 'string') {
    valor = valor.replace(/R\$/g, '').replace(/\s/g, '').replace(/,/g, '.');
  }
  let numero = parseFloat(valor);
  if (isNaN(numero)) return valor;

  const camposEmCentavos = [
    'Alocação (R$)', 'Custodiado', 'Faltante',
    'Cotação atual', 'Dividendos 04/09/2025', 'Dividendos x cotas aproximado'
  ];

  if (camposEmCentavos.includes(tipo)) numero = numero;

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
    html += `<div class="ativo-card">`;

    html += `
      <div class="card-header-ativo" style="grid-column: 1 / -1;">
        <h3>${linha['Ativo'] || 'Ativo Desconhecido'}</h3>
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
      <div class="coluna-titulo">Cotas a ter</div>
      <div class="card-item">
        <span class="card-titulo">Cotas:</span>
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
        <span class="card-titulo">Faltante:</span>
        <span class="card-valor">${formatarValor(linha['Faltante'], 'Faltante')}</span>
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
