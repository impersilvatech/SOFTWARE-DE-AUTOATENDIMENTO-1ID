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
            // Verifica se este produto já está no carrinho
            const jaNoCarrinho = carrinho.find(item => item.id === produto.id);
            
            // Define o aspecto e comportamento do botão
            const textoBotao = jaNoCarrinho ? "✅ Adicionado" : "Adicionar ➕";
            const classeBotao = jaNoCarrinho ? "btn-sucesso" : "btn-primario";
            // O botão NÃO fica mais desabilitado, mas muda a função de clique
            const onclick = jaNoCarrinho ? `onclick="alertaJáAdicionado('${produto.nome}')"` : `onclick="adicionarAoCarrinho(${produto.id}, this)"`;

            // Cria o cartão do produto
            const card = document.createElement('div');
            card.className = 'card produto-card';
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" onerror="this.src='https://via.placeholder.com/80?text=Sem+Foto'">
                <div class="produto-info">
                    <h3 style="font-size: 1.1em; margin-bottom: 5px;">${produto.nome}</h3>
                    <p style="font-size: 0.85em; color: #666; margin-bottom: 8px;">${produto.descricao}</p>
                    <div class="produto-preco">${produto.preco} Kz</div>
                    <button class="${classeBotao}" ${onclick}>
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
        renderizarCarrinho();

        document.getElementById('btn-confirmar').addEventListener('click', () => {
            if (carrinho.length === 0) {
                alert('O seu carrinho está vazio! Adicione produtos antes de confirmar.');
                return;
            }
            window.location.href = 'confirmacao.html';
        });
    }

    // =========================================
    // 4. TELA DE CONFIRMAÇÃO (confirmacao.html)
    // =========================================
    const resumoItens = document.getElementById('resumo-itens');
    if (resumoItens) {
        const clienteGuardado = localStorage.getItem('clienteCatalogo');
        
        if (!clienteGuardado || carrinho.length === 0) {
            window.location.href = 'index.html';
            return;
        }

        const cliente = JSON.parse(clienteGuardado);
        
        document.getElementById('resumo-nome').textContent = cliente.nome;
        document.getElementById('resumo-local').textContent = `${cliente.provincia} / ${cliente.municipio}`;
        document.getElementById('resumo-endereco').textContent = cliente.bairro;

        let totalPedido = 0;
        resumoItens.innerHTML = ''; 
        
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            totalPedido += subtotal;
            
            const linha = document.createElement('div');
            linha.className = 'linha-resumo';
            linha.innerHTML = `
                <span>${item.quantidade}x ${item.nome}</span>
                <strong>${subtotal} Kz</strong>
            `;
            resumoItens.appendChild(linha);
        });

        document.getElementById('resumo-total').textContent = totalPedido;

        document.getElementById('btn-whatsapp').addEventListener('click', () => {
            // NÚMERO DO VENDEDOR (coloque aqui o número da sua loja)
            const numeroLoja = "244954288128"; 

            let mensagem = `✅ Pedido Confirmado!\n`;
            mensagem += `Nome do cliente: ${cliente.nome}\n`;
            mensagem += `província/município: ${cliente.provincia} / ${cliente.municipio}\n`;
            mensagem += `rua/bairro: ${cliente.bairro}\n\n`;

            carrinho.forEach(item => {
                mensagem += `${item.quantidade}x ${item.nome} - ${item.preco} Kz\n`;
            });

            mensagem += `\nTotal: ${totalPedido} Kz\n`;
            mensagem += `Obrigado pela preferência!`;

            const mensagemCodificada = encodeURIComponent(mensagem);
            const urlWhatsapp = `https://wa.me/${numeroLoja}?text=${mensagemCodificada}`;

            localStorage.removeItem('carrinhoCatalogo');
            window.open(urlWhatsapp, '_blank');
            window.location.href = 'index.html';
        });
    }
});

// =========================================
// FUNÇÕES GLOBAIS
// =========================================

// NOVA FUNÇÃO: Alerta para itens já no carrinho
window.alertaJáAdicionado = function(nome) {
    alert(`O item "${nome}" já foi adicionado ao carrinho!`);
};

window.adicionarAoCarrinho = function(idProduto, elementoBotao) {
    const produto = produtos.find(p => p.id === idProduto);
    if (produto) {
        // Adiciona ao carrinho
        carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));
        
        // Altera o visual do botão
        elementoBotao.textContent = "✅ Adicionado";
        elementoBotao.classList.remove('btn-primario');
        elementoBotao.classList.add('btn-sucesso');
        
        // Muda o comportamento do botão para dar alerta no próximo clique
        elementoBotao.setAttribute('onclick', `alertaJáAdicionado('${produto.nome}')`);
        
        atualizarContador();
    }
};

function atualizarContador() {
    const contador = document.getElementById('contador-carrinho');
    if (contador) contador.textContent = carrinho.length;
}

window.renderizarCarrinho = function() {
    const container = document.getElementById('itens-carrinho');
    const valorTotalElemento = document.getElementById('valor-total');
    
    container.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">O seu carrinho está vazio. 🥺</p>';
        valorTotalElemento.textContent = '0';
        return;
    }

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

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

    valorTotalElemento.textContent = total;
};

window.alterarQuantidade = function(index, mudanca) {
    carrinho[index].quantidade += mudanca;
    if (carrinho[index].quantidade <= 0) {
        removerItem(index);
    } else {
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));
        renderizarCarrinho(); 
    }
};

window.removerItem = function(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho)); 
    renderizarCarrinho(); 
};
