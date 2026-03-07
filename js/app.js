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
        localStorage.removeItem('carrinhoCatalogo');
        localStorage.removeItem('clienteCatalogo');
        carrinho = []; 

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

        window.renderizarMenu = function() {
            listaProdutos.innerHTML = ''; 
            
            produtos.forEach(produto => {
                const jaNoCarrinho = carrinho.find(item => item.id === produto.id);
                
                let htmlBotao = '';
                if (jaNoCarrinho) {
                    htmlBotao = `<button class="btn-perigo" onclick="removerDoMenu(${produto.id})">🗑️ Remover</button>`;
                } else {
                    htmlBotao = `<button class="btn-primario" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ➕</button>`;
                }

                const card = document.createElement('div');
                card.className = 'card produto-card';
                card.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" onerror="this.src='https://via.placeholder.com/80?text=Sem+Foto'">
                    <div class="produto-info">
                        <h3 style="font-size: 1.1em; margin-bottom: 5px;">${produto.nome}</h3>
                        <p style="font-size: 0.85em; color: #666; margin-bottom: 8px;">${produto.descricao}</p>
                        <div class="produto-preco">${produto.preco} Kz</div>
                        ${htmlBotao}
                    </div>
                `;
                listaProdutos.appendChild(card);
            });
            atualizarContador();
        };

        renderizarMenu();

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
                // AQUI: Usamos a nova notificação em vez de alert()
                mostrarNotificacao('O seu carrinho está vazio! Adicione produtos.', 'erro');
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
            const numeroLoja = "244954288128"; 

            let mensagem = `✅ Pedido Confirmado!\n`;
            mensagem += `Nome do cliente: ${cliente.nome}\n`;
            mensagem += `Local: ${cliente.provincia} / ${cliente.municipio}\n`;
            mensagem += `Endereço: ${cliente.bairro}\n\n`;

            carrinho.forEach(item => {
                mensagem += `${item.quantidade}x ${item.nome} - ${item.preco} Kz\n`;
            });

            mensagem += `\nTotal: ${totalPedido} Kz\n`;
            mensagem += `Obrigado pela preferência!`;

            const mensagemCodificada = encodeURIComponent(mensagem);
            const urlWhatsapp = `https://wa.me/${numeroLoja}?text=${mensagemCodificada}`;

            window.open(urlWhatsapp, '_blank');
            window.location.href = 'index.html';
        });
    }
});

// =========================================
// FUNÇÕES GLOBAIS
// =========================================

// NOVA FUNÇÃO: Cria a notificação bonita na tela
window.mostrarNotificacao = function(mensagem, tipo = 'sucesso') {
    // Cria a caixinha da notificação
    const toast = document.createElement('div');
    toast.className = `toast-notificacao ${tipo === 'erro' ? 'toast-erro' : ''}`;
    toast.textContent = mensagem;
    
    // Adiciona na tela
    document.body.appendChild(toast);

    // Faz ela descer (animação)
    setTimeout(() => {
        toast.classList.add('mostrar');
    }, 10);

    // Depois de 3 segundos, faz ela subir e desaparece
    setTimeout(() => {
        toast.classList.remove('mostrar');
        setTimeout(() => toast.remove(), 400); // Remove totalmente do HTML
    }, 3000);
};

window.adicionarAoCarrinho = function(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    if (produto) {
        carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));
        
        // AQUI: Chama a notificação flutuante de sucesso
        mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, 'sucesso');
        
        if (window.renderizarMenu) renderizarMenu(); 
    }
};

window.removerDoMenu = function(idProduto) {
    const index = carrinho.findIndex(item => item.id === idProduto);
    if (index !== -1) {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinhoCatalogo', JSON.stringify(carrinho));
        if (window.renderizarMenu) renderizarMenu(); 
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
