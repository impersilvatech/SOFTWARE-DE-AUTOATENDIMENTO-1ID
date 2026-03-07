/* =========================================
   LÓGICA PRINCIPAL DO APLICATIVO (app.js)
   ========================================= */

let carrinho = JSON.parse(localStorage.getItem('carrinhoCatalogo')) || [];

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. TELA INICIAL (index.html)
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
    // 2. TELA DE MENU (menu.html)
    // =========================================
    const listaProdutos = document.getElementById('lista-produtos');
    if (listaProdutos) {
        const clienteGuardado = localStorage.getItem('clienteCatalogo');
        if (clienteGuardado) {
            const cliente = JSON.parse(clienteGuardado);
            document.getElementById('nome-cliente-display').textContent = cliente.nome;
        } else {
            window.location.href = 'index.html';
        }

        produtos.forEach(produto => {
            const jaNoCarrinho = carrinho.find(item => item.id === produto.id);
            const textoBotao = jaNoCarrinho ? "✅ Adicionado" : "Adicionar ➕";
            const classeBotao = jaNoCarrinho ? "btn-sucesso" : "btn-primario";
            const estadoBotao = jaNoCarrinho ? "disabled" : "";

            const card = document.createElement('div');
            card.className = 'card produto-card';
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
            listaProdutos.appendChild(card);
        });

        atualizarContador();
        document.getElementById('btn-ver-carrinho').addEventListener('click', () => {
            window.location.href = 'carrinho.html';
        });
    }

    // =========================================
    // 3. TELA DE CARRINHO (carrinho.html)
    // =========================================
    const containerCarrinho = document.getElementById('itens-carrinho');
    if (containerCarrinho) {
        // Quando a página abre, desenha o carrinho imediatamente
        renderizarCarrinho();

        // Configura o botão de confirmar pedido
        document.getElementById('btn-confirmar').addEventListener('click', () => {
            if (carrinho.length === 0) {
                alert('O seu carrinho está vazio! Adicione produtos antes de confirmar.');
                return;
            }
            window.location.href = 'confirmacao.html';
        });
    }
});

// =========================================
// FUNÇÕES GLOBAIS
// =========================================

window.adicionarAoCarrinho = function(idProduto, elementoBotao) {
    const produto = produtos.find(p => p.id === idProduto);
    if (produto) {
        carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));
        elementoBotao.textContent = "✅ Adicionado";
        elementoBotao.classList.remove('btn-primario');
        elementoBotao.classList.add('btn-sucesso');
        elementoBotao.disabled = true;
        atualizarContador();
    }
};

function atualizarContador() {
    const contador = document.getElementById('contador-carrinho');
    if (contador) contador.textContent = carrinho.length;
}

// NOVA FUNÇÃO: Desenha os itens na tela do carrinho e calcula o total
window.renderizarCarrinho = function() {
    const container = document.getElementById('itens-carrinho');
    const valorTotalElemento = document.getElementById('valor-total');
    
    // Limpa o que estava na tela antes de redesenhar
    container.innerHTML = '';
    let total = 0;

    // Se estiver vazio, avisa o cliente
    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">O seu carrinho está vazio. 🥺</p>';
        valorTotalElemento.textContent = '0';
        return;
    }

    // Passa por cada item no carrinho
    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal; // Vai somando ao total do pedido

        const div = document.createElement('div');
        div.className = 'carrinho-item';
        div.innerHTML = `
            <div class="carrinho-info">
                <strong>${item.nome}</strong><br>
                <span style="color: #666;">${item.preco} Kz un.</span><br>
                <button class="btn-remover" onclick="removerItem(${index})">🗑️ Remover</button>
            </div>
            
            <div class="carrinho-controles">
                <button class="btn-qtd" onclick="alterarQuantidade(${index}, -1)">➖</button>
                <span style="font-weight: bold; font-size: 1.1em; width: 25px; text-align: center;">${item.quantidade}</span>
                <button class="btn-qtd" onclick="alterarQuantidade(${index}, 1)">➕</button>
            </div>
            
            <div style="font-weight: bold; width: 90px; text-align: right; color: var(--cor-vermelho);">
                ${subtotal} Kz
            </div>
        `;
        container.appendChild(div);
    });

    // Atualiza o texto do total na tela
    valorTotalElemento.textContent = total;
};

// NOVA FUNÇÃO: Aumenta ou diminui a quantidade
window.alterarQuantidade = function(index, mudanca) {
    carrinho[index].quantidade += mudanca;
    
    // Se a quantidade chegar a 0, remove o item
    if (carrinho[index].quantidade <= 0) {
        removerItem(index);
    } else {
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));
        renderizarCarrinho(); // Atualiza a tela imediatamente
    }
};

// NOVA FUNÇÃO: Remove um item do carrinho
window.removerItem = function(index) {
    carrinho.splice(index, 1); // Remove o item da lista
    localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho)); // Salva no telemóvel
    renderizarCarrinho(); // Atualiza a tela
};
