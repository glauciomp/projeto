document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('arquivoCsv');
    const tabelaContainer = document.getElementById('tabela-container');
    const statusArquivo = document.getElementById('status-arquivo');

    // Avisa que o arquivo não foi encontrado ao carregar a página
    statusArquivo.textContent = 'AVISO: Nenhum arquivo de dados carregado. Por favor, selecione seu CSV.';

    inputArquivo.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        
        if (!arquivo) {
            tabelaContainer.innerHTML = '<p>Selecione um arquivo CSV de investimentos acima para exibir a tabela.</p>';
            statusArquivo.textContent = 'AVISO: Nenhum arquivo de dados carregado. Por favor, selecione seu CSV.';
            statusArquivo.style.color = 'red';
            return;
        }

        // Verifica se o arquivo é um CSV
        if (arquivo.type && arquivo.type !== 'text/csv' && !arquivo.name.endsWith('.csv')) {
            alert('Por favor, selecione um arquivo no formato CSV (.csv).');
            inputArquivo.value = ''; // Limpa a seleção
            return;
        }

        statusArquivo.textContent = `Arquivo "${arquivo.name}" selecionado com sucesso! Carregando...`;
        statusArquivo.style.color = 'blue';

        const leitor = new FileReader();

        leitor.onload = function(e) {
            const conteudo = e.target.result;
            const tabelaHTML = converterCsvParaTabela(conteudo);
            tabelaContainer.innerHTML = tabelaHTML;
            statusArquivo.textContent = `Arquivo "${arquivo.name}" carregado e exibido.`;
            statusArquivo.style.color = 'green';
        };

        // Lança o aviso de erro, caso não encontre o arquivo
        leitor.onerror = function() {
            tabelaContainer.innerHTML = '<p>Erro ao ler o arquivo.</p>';
            statusArquivo.textContent = 'ERRO: Falha na leitura do arquivo.';
            statusArquivo.style.color = 'red';
        };

        leitor.readAsText(arquivo);
    });
});

/**
 * Função principal para converter o conteúdo CSV em uma tabela HTML.
 * Espera-se que o separador seja ponto e vírgula (;)
 */
function converterCsvParaTabela(csv) {
    // 1. Divide o CSV em linhas. Filtra linhas vazias.
    const linhas = csv.split('\n').filter(linha => linha.trim() !== '');
    
    if (linhas.length === 0) {
        return '<p style="color: red;">O arquivo CSV está vazio ou ilegível.</p>';
    }

    // 2. Define o separador (pode ser ajustado para ',' se for o caso)
    const separador = ';'; 
    
    // 3. Obtém os cabeçalhos (primeira linha)
    const cabecalhos = linhas[0].split(separador).map(h => h.trim());

    let html = '<table>';
    
    // Constrói a linha de cabeçalho (<thead>)
    html += '<thead><tr>';
    cabecalhos.forEach(cabecalho => {
        html += `<th>${cabecalho}</th>`;
    });
    html += '</tr></thead>';

    // 4. Constrói o corpo da tabela (<tbody>) com as demais linhas
    html += '<tbody>';
    for (let i = 1; i < linhas.length; i++) {
        const colunas = linhas[i].split(separador).map(c => c.trim());
        
        // Garante que a linha tenha o número correto de colunas
        if (colunas.length === cabecalhos.length) {
            html += '<tr>';
            colunas.forEach(dado => {
                html += `<td>${dado}</td>`;
            });
            html += '</tr>';
        }
    }
    html += '</tbody>';
    html += '</table>';

    return html;
}