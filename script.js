// Seleção de elementos do DOM
const btnCarrinho = document.getElementById('ver-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const btnFecharModal = document.querySelector('.fechar');
const btnAddCarrinho = document.querySelectorAll('.add-carrinho');
const itensCarrinhoContainer = document.getElementById('itens-carrinho');
const precoTotalElemento = document.getElementById('preco-total');
const contagemCarrinhoElemento = document.getElementById('contagem-carrinho');
const btnFinalizarPedido = document.getElementById('finalizar-pedido');

// Estado do Carrinho
let carrinho = [];

// Abrir e fechar modal
btnCarrinho.addEventListener('click', () => {
    modalCarrinho.style.display = 'flex';
    exibirCarrinho();
});

btnFecharModal.addEventListener('click', () => {
    modalCarrinho.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modalCarrinho) {
        modalCarrinho.style.display = 'none';
    }
});

// Adicionar produto ao carrinho
btnAddCarrinho.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const produtoElemento = e.target.closest('.item-produto');
        const id = produtoElemento.getAttribute('data-id');
        const nome = produtoElemento.getAttribute('data-nome');
        const preco = parseFloat(produtoElemento.getAttribute('data-preco'));

        adicionarAoCarrinho(id, nome, preco);
    });
});

function adicionarAoCarrinho(id, nome, preco) {
    // Verifica se o item já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    atualizarContador();
}

// Atualizar a contagem do botão superior
function atualizarContador() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contagemCarrinhoElemento.textContent = totalItens;
}

// Renderizar itens no Modal do Carrinho
function exibirCarrinho() {
    itensCarrinhoContainer.innerHTML = '';
    
    if (carrinho.length === 0) {
        itensCarrinhoContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        precoTotalElemento.textContent = '0,00';
        return;
    }

    let totalGeral = 0;

    carrinho.forEach(item => {
        const totalItem = item.preco * item.quantidade;
        totalGeral += totalItem;

        const div = document.createElement('div');
        div.classList.add('item-no-carrinho');
        div.innerHTML = `
            <div>
                <strong>${item.nome}</strong> x${item.quantidade}
                <br><small>R$ ${item.preco.toFixed(2)} un.</small>
            </div>
            <div>
                <span>R$ ${totalItem.toFixed(2)}</span>
            </div>
        `;
        itensCarrinhoContainer.appendChild(div);
    });

    precoTotalElemento.textContent = totalGeral.toFixed(2).replace('.', ',');
}

// Finalizar pedido enviando mensagem mockada para o WhatsApp
btnFinalizarPedido.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let mensagem = '🍔 *Novo Pedido DevBurger* 🍔\n\n';
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} (Qtd: ${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    
    const totalGeral = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    mensagem += `\n*Total:* R$ ${totalGeral.toFixed(2)}`;

    // Codifica o texto para URL e redireciona (Substitua o 000... pelo número real se quiser)
    const urlWhatsApp = `https://wa.me/5500000000000?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
});