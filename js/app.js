let carrinho = JSON.parse(localStorage.getItem('carrinhoCatalogo')) || [];

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // LÓGICA DA TELA INICIAL (index.html)
    // =========================================
    const formCliente = document.getElementById('form-cliente');
    if (formCliente) {
        formCliente.addEventListener('submit', function(evento) {
            evento.preventDefault();
            const dadosCliente = {
                nome: document.getElementById('nome').value,
                provincia: document.getElementById('provincia').value,
                municipio: document.getElementById('municipio').value,
                bairro: document.getElementById('bairro').value
            };
            localStorage.setItem('clienteCatalogo', JSON.stringify(dadosCliente));
            window.location.href = 'menu.html';
        });
    }

    // =========================================
    // LÓGICA DA TELA DE MENU (menu.html)
    // =========================================
    const listaProdutos = document.getElementById('lista-produtos');
    if (listaProdutos) {
        // 1. Exibir o nome do cliente no cabeçalho
        const clienteGuardado = localStorage.getItem('clienteCatalogo');
        if (clienteGuardado) {
            const cliente = JSON.parse(clienteGuardado);
            document.getElementById('nome-cliente-display').textContent = cliente.nome;
        } else {
            // Se não houver cliente salvo (alguém tentou aceder ao menu diretamente), volta ao início
            window.location.href = 'index.html';
        }

        // 2. Desenhar os produtos na tela
        produtos.forEach(produto => {
            // Verifica se este produto já está no carrinho
            const jaNoCarrinho = carrinho.find(item => item.id === produto.id);
            
            // Define o aspecto do botão com base na verificação acima (Regra de adicionar apenas 1 vez)
            const textoBotao = jaNoCarrinho ? "✅ Adicionado" : "Adicionar ➕";
            const classeBotao = jaNoCarrinho ? "btn-sucesso" : "btn-primario";
            const estadoBotao = jaNoCarrinho ? "disabled" : "";

            // Cria o "cartão" do HTML para o produto
            const card = document.createElement('div');
            card.className = 'card produto-card';
            
            // Aqui usamos crases (`) para criar blocos de HTML dinâmicos
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" onerror="this.src='https://via.placeholder.com/80?text=Sem+Foto'">
                <div class="produto-info">
                    <h3 style="font-size: 1.1em; margin-bottom: 5px;">${produto.nome}</h3>
                    <p style="font-size: 0.85em; color: #666; margin-bottom: 8px;">${produto.descricao}</p>
                    <div class="produto-preco">${produto.preco} Kz</div>
                    <button class="${classeBotao}" ${estadoBotao} onclick="adicionarAoCarrinho(${produto.id}, this)">
                        ${textoBotao}
                    </button>
                </div>
            `;
            // Adiciona o cartão pronto à nossa caixa principal
            listaProdutos.appendChild(card);
        });

        // 3. Atualizar o contador do carrinho na barra inferior
        atualizarContador();

        // 4. Configurar o botão de "Ver Carrinho"
        document.getElementById('btn-ver-carrinho').addEventListener('click', () => {
            window.location.href = 'carrinho.html';
        });
    }
});

// =========================================
// FUNÇÕES GLOBAIS
// =========================================

// Função chamada quando o cliente clica no botão "Adicionar"
window.adicionarAoCarrinho = function(idProduto, elementoBotao) {
    // Procura o produto completo na nossa base de dados (produtos.js)
    const produto = produtos.find(p => p.id === idProduto);
    
    if (produto) {
        // Adiciona ao carrinho com quantidade inicial de 1
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });

        // Salva o carrinho atualizado no localStorage
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));

        // Altera o visual do botão para mostrar que foi adicionado (cumprindo a sua restrição)
        elementoBotao.textContent = "✅ Adicionado";
        elementoBotao.classList.remove('btn-primario');
        elementoBotao.classList.add('btn-sucesso');
        elementoBotao.disabled = true; // Desativa o botão para não adicionar duplicados aqui

        // Atualiza o número no botão do rodapé
        atualizarContador();
    }
};

// Função para atualizar o número de itens no botão do carrinho
function atualizarContador() {
    const contador = document.getElementById('contador-carrinho');
    if (contador) {
        contador.textContent = carrinho.length;
    }
}
