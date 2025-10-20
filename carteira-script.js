document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('arquivoCsv');
    const tabelaContainer = document.getElementById('tabela-container');
    const statusArquivo = document.getElementById('status-arquivo');
    statusArquivo.textContent = 'AVISO: Nenhum arquivo de dados carregado. Por favor, selecione seu CSV.';
    inputArquivo.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        if (!arquivo) {
            tabelaContainer.innerHTML = '<p>Selecione um arquivo CSV de investimentos acima para exibir a tabela.</p>';
            statusArquivo.textContent = 'AVISO: Nenhum arquivo de dados carregado. Por favor, selecione seu CSV.';
            statusArquivo.style.color = 'red';
            return;
        }
        if (arquivo.type && arquivo.type !== 'text/csv' && !arquivo.name.endsWith('.csv')) {
            console.error('Por favor, selecione um arquivo no formato CSV (.csv).');
            inputArquivo.value = '';
            statusArquivo.textContent = 'ERRO: Arquivo inválido. Selecione um CSV.';
            statusArquivo.style.color = 'red';
            return;
        }
        statusArquivo.textContent = `Arquivo "${arquivo.name}" selecionado com sucesso! Carregando...`;
        statusArquivo.style.color = 'blue';
        const leitor = new FileReader();
        leitor.onload = function(e) {
            const conteudo = e.target.result;
            const cardsHTML = converterCsvParaTabela(conteudo);
            tabelaContainer.innerHTML = cardsHTML;
            statusArquivo.textContent = `Arquivo "${arquivo.name}" carregado e exibido.`;
            statusArquivo.style.color = 'green';
            inputArquivo.value = '';
        };
        leitor.onerror = function() {
            tabelaContainer.innerHTML = '<p>Erro ao ler o arquivo.</p>';
            statusArquivo.textContent = 'ERRO: Falha na leitura do arquivo.';
            statusArquivo.style.color = 'red';
            inputArquivo.value = '';
        };
        leitor.readAsText(arquivo, 'UTF-8');
    });
});

function formatarValor(valorBruto, tipo) {
    if (!valorBruto || valorBruto.trim() === '') {
        return '';
    }
    const valorTrimmed = valorBruto.trim();
    if (valorTrimmed.toLowerCase() === 'r$ -') {
        return 'R$ -';
    }
    const valorLimpo = valorTrimmed.replace(/R\$/g, '').replace(/\s/g, '').replace(/,/g, ''); 
    const numero = parseFloat(valorLimpo);
    if (isNaN(numero)) {
        return valorBruto;
    }
    const formatadorBRL = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    switch (tipo) {
        case 'monetario':
            return `R$ ${formatadorBRL.format(numero)}`;
        case 'percentual':
            return `${formatadorBRL.format(numero)}%`;
        case 'cotas':
            const formatadorCotas = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            return formatadorCotas.format(numero);
        default:
            return formatadorBRL.format(numero);
    }
}

function converterCsvParaTabela(csv) {
    const linhas = csv.split(/[\r\n]+/).filter(linha => linha.trim() !== '');
    if (linhas.length === 0) {
        return '<p style="color: red;">O arquivo CSV está vazio ou ilegível.</p>';
    }
    const primeiraLinha = linhas[0];
    let separador = ',';
    if (primeiraLinha.includes(';')) {
        separador = ';';
    } else if (primeiraLinha.includes('\t')) {
        separador = '\t'; 
    }
    let cabecalhos = primeiraLinha.split(separador).map(h => h.trim());
    cabecalhos = cabecalhos.filter(h => h.length > 0); 
    const titulosFormatados = [
        "Ativo", "Tipo", "Alocação", "Yield Anual", 
        "Cotas aproximado", "Cotação atual", "Dividendos", 
        "Div. x Cotas Aprox.", "Ticker", "Custodiado", 
        "Faltante", "Observação"
    ];
    let html = '<div id="cards-container">';
    for (let i = 1; i < linhas.length; i++) {
        const colunas = linhas[i].split(separador).map(c => c.trim());
        if (colunas.length < 2) continue;
        const tituloDividendoCSV = cabecalhos[6] || "Dividendos (Data Desconhecida)"; 
        const criarItem = (index) => {
            const titulo = titulosFormatados[index];
            let dado = colunas[index] !== undefined ? colunas[index] : '';
            let dadoFormatado = dado;
            let valorClass = '';
            switch (index) {
                case 2:
                case 5:
                case 6:
                case 7:
                case 9:
                case 10:
                    dadoFormatado = formatarValor(dado, 'monetario');
                    valorClass = 'valor-monetario';
                    break;
                case 3:
                    dadoFormatado = formatarValor(dado, 'percentual');
                    break;
                case 4:
                    dadoFormatado = formatarValor(dado, 'cotas');
                    break;
                case 8:
                    valorClass = 'valor-ticker';
                    dadoFormatado = dado;
                    break;
                default:
                    dadoFormatado = dado;
            }
            if (index === 0) {
                return `
                    <div class="card-header-ativo" style="grid-column: 1 / -1; background-color: #f9f9f9; padding: 10px 15px; border-bottom: 2px solid #e0e0e0; margin-bottom: 10px;">
                        <h3 style="margin: 0; font-size: 1.3rem; font-weight: bold; color: #1f2937;">${dado}</h3>
                    </div>
                `;
            }
            if (index === 6) {
                return `
                    <div class="card-item col-full">
                        <span class="card-titulo">${tituloDividendoCSV}</span>
                        <span class="card-valor">${dadoFormatado}</span>
                    </div>
                `;
            }
            return `
                <div class="card-item">
                    <span class="card-titulo">${titulo}:</span>
                    <span class="card-valor ${valorClass}">${dadoFormatado}</span>
                </div>
            `;
        };
        html += `<div class="ativo-card">`;
        html += criarItem(0); 
        html += `<div class="card-coluna col-1">`;
        html += criarItem(8); // Ticker agora é a primeira coluna
        html += `</div>`;
        html += `<div class="card-coluna col-2">`;
        html += criarItem(1);
        html += criarItem(2);
        html += criarItem(3);
        html += `</div>`;
        html += `<div class="card-coluna col-3">`;
        html += `<div class="coluna-titulo">Cotas a ter</div>`; 
        html += criarItem(4);
        html += criarItem(5);
        html += criarItem(6); 
        html += criarItem(7);
        html += `</div>`;
        html += `<div class="card-coluna col-4">`;
        html += criarItem(9);
        html += criarItem(10);
        html += criarItem(11);
        html += `</div>`;
        html += `</div>`;
    }
    html += '</div>';
    return html;
}
