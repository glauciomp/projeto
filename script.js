document.addEventListener('DOMContentLoaded', (event) => {
    const meuBotao = document.getElementById('meuBotao');

    meuBotao.addEventListener('click', () => {
        alert('Você clicou no botão! O JavaScript está funcionando.');
    });
});
