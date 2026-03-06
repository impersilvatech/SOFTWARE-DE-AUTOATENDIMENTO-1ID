/* =========================================
   LÓGICA PRINCIPAL DO APLICATIVO (app.js)
   ========================================= */

// Espera que a página carregue completamente antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    
    // Tenta encontrar o formulário da página inicial
    const formCliente = document.getElementById('form-cliente');

    // Se o formulário existir (ou seja, se estamos na página index.html)
    if (formCliente) {
        formCliente.addEventListener('submit', function(evento) {
            // Evita que a página recarregue (comportamento padrão dos formulários)
            evento.preventDefault();

            // Captura os valores digitados pelo cliente
            const dadosCliente = {
                nome: document.getElementById('nome').value,
                provincia: document.getElementById('provincia').value,
                municipio: document.getElementById('municipio').value,
                bairro: document.getElementById('bairro').value
            };

            // Guarda os dados no localStorage do navegador (convertendo para texto JSON)
            localStorage.setItem('clienteCatalogo', JSON.stringify(dadosCliente));

            // Redireciona o cliente para a página do Menu
            window.location.href = 'menu.html';
        });
    }

    // (Futuramente, adicionaremos aqui a lógica do Menu, Carrinho e Confirmação)
});
