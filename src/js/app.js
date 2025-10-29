console.log('Script carregado!');

// State
let allProducts = [];
let filteredProducts = [];
let displayedProducts = [];
let currentPage = 1;
let PRODUCTS_PER_PAGE = 9;

const activeFilters = {
  colors: [],
  sizes: [],
  priceRanges: []
};

function updateProductsPerPage() {
  if (window.innerWidth < 768) {
    PRODUCTS_PER_PAGE = 4;
  } else {
    PRODUCTS_PER_PAGE = 9;
  }
}

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:5000/products');
    const data = await response.json();
    console.log('Produtos carregados:', data);
    allProducts = data;
    filteredProducts = data;
    updateProductsPerPage();
    renderColorFilters();
    renderProducts();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

function renderColorFilters() {
  const allColors = ['Amarelo', 'Azul', 'Branco', 'Cinza', 'Laranja', 'Verde', 'Vermelho', 'Preto', 'Rosa', 'Vinho'];
  
  const desktopContainer = document.getElementById('desktop-color-filters');
  const visibleColors = allColors.slice(0, 5);
  const hiddenColors = allColors.slice(5);
  
  let html = '';
  
  visibleColors.forEach(color => {
    html += `
      <label class="filter-checkbox">
        <input type="checkbox" name="color" value="${color.toLowerCase()}" onchange="handleColorFilter('${color.toLowerCase()}')">
        ${color}
      </label>
    `;
  });
  
  if (hiddenColors.length > 0) {
    html += `
      <div class="hidden-colors" id="hidden-colors" style="display: none;">
        ${hiddenColors.map(color => `
          <label class="filter-checkbox">
            <input type="checkbox" name="color" value="${color.toLowerCase()}" onchange="handleColorFilter('${color.toLowerCase()}')">
            ${color}
          </label>
        `).join('')}
      </div>
      <button class="btn-show-more" onclick="toggleColors()">
        <span id="toggle-text">Ver todas as cores</span>
      </button>
    `;
  }
  
  if (desktopContainer) {
    desktopContainer.innerHTML = html;
  }
  
  const mobileContainer = document.getElementById('mobile-color-filters');
  if (mobileContainer) {
    mobileContainer.innerHTML = allColors.map(color => `
      <label class="filter-checkbox">
        <input type="checkbox" name="color-mobile" value="${color.toLowerCase()}" onchange="handleColorFilter('${color.toLowerCase()}')">
        ${color}
      </label>
    `).join('');
  }
}

function toggleColors() {
  const hiddenColors = document.getElementById('hidden-colors');
  const toggleText = document.getElementById('toggle-text');
  
  if (hiddenColors && toggleText) {
    if (hiddenColors.style.display === 'none') {
      hiddenColors.style.display = 'block';
      toggleText.textContent = 'Ver menos cores';
    } else {
      hiddenColors.style.display = 'none';
      toggleText.textContent = 'Ver todas as cores';
    }
  }
}

function handleColorFilter(color) {
  const index = activeFilters.colors.indexOf(color);
  if (index > -1) {
    activeFilters.colors.splice(index, 1);
  } else {
    activeFilters.colors.push(color);
  }
  
  syncColorCheckboxes(color);
  applyFilters();
}

function syncColorCheckboxes(color) {
  const allCheckboxes = document.querySelectorAll(`input[value="${color}"]`);
  const isChecked = activeFilters.colors.includes(color);
  allCheckboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

function handleSizeFilter(size) {
  const index = activeFilters.sizes.indexOf(size);
  
  if (index > -1) {
    activeFilters.sizes.splice(index, 1);
  } else {
    activeFilters.sizes.push(size);
  }
  
  const allSizeButtons = document.querySelectorAll('.size-btn');
  allSizeButtons.forEach(btn => {
    if (btn.textContent === size) {
      if (activeFilters.sizes.includes(size)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
  
  applyFilters();
}

function handlePriceFilter(range) {
  const index = activeFilters.priceRanges.indexOf(range);
  if (index > -1) {
    activeFilters.priceRanges.splice(index, 1);
  } else {
    activeFilters.priceRanges.push(range);
  }
  
  syncPriceCheckboxes(range);
  applyFilters();
}

function syncPriceCheckboxes(range) {
  const allCheckboxes = document.querySelectorAll(`input[value="${range}"]`);
  const isChecked = activeFilters.priceRanges.includes(range);
  allCheckboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
  });
}

function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    if (activeFilters.colors.length > 0) {
      const productColorLower = product.color.toLowerCase();
      if (!activeFilters.colors.includes(productColorLower)) {
        return false;
      }
    }
    
    if (activeFilters.sizes.length > 0) {
      const hasSize = product.size.some(size => activeFilters.sizes.includes(size));
      if (!hasSize) return false;
    }
    
    if (activeFilters.priceRanges.length > 0) {
      const matchesPrice = activeFilters.priceRanges.some(range => {
        return checkPriceRange(product.price, range);
      });
      if (!matchesPrice) return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  renderProducts();
}

function checkPriceRange(price, range) {
  switch(range) {
    case '0-50':
      return price >= 0 && price <= 50;
    case '51-150':
      return price >= 51 && price <= 150;
    case '151-300':
      return price >= 151 && price <= 300;
    case '301-500':
      return price >= 301 && price <= 500;
    case '500+':
      return price > 500;
    default:
      return true;
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const endIndex = currentPage * PRODUCTS_PER_PAGE;
  displayedProducts = filteredProducts.slice(0, endIndex);
  
  if (displayedProducts.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum produto encontrado</p>';
  } else {
    grid.innerHTML = displayedProducts.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
        <p class="product-installment">até ${product.parcelamento[0]}x de R$${product.parcelamento[1].toFixed(2).replace('.', ',')}</p>
        <button class="btn-buy" data-product-id="${product.id}">COMPRAR</button>
      </div>
    `).join('');
    
    // Adicionar event listeners aos botões COMPRAR
    attachBuyButtonListeners();
  }
  
  const loadMoreBtn = document.querySelector('.btn-load-more');
  if (loadMoreBtn) {
    if (displayedProducts.length >= filteredProducts.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }
}

// Adicionar listeners aos botões de comprar
function attachBuyButtonListeners() {
  const buyButtons = document.querySelectorAll('.btn-buy');
  buyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      console.log('Clicou em comprar, produto ID:', productId);
      addToCart(productId);
    });
  });
}

function loadMore() {
  currentPage++;
  renderProducts();
}

// Carrinho
let cart = [];

function normalizeId(id) {
  return Number(id);
}

function saveCartToLocalStorage() {
  try { localStorage.setItem('cart_v1', JSON.stringify(cart)); } catch (e) { /* ignore */ }
}
function loadCartFromLocalStorage() {
  try {
    const raw = localStorage.getItem('cart_v1');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) cart = parsed.map(i => ({ ...i, id: Number(i.id) }));
  } catch (e) { console.warn('Erro ao ler cart do localStorage', e); }
}

loadCartFromLocalStorage();
updateCart(); 

// --- Adiciona ao carrinho ---
function addToCart(productId) {
  const id = normalizeId(productId);
  console.log('[CART] addToCart chamado com id:', productId, '-> normalizado:', id);

  // Garante que allProducts foi carregado
  if (!Array.isArray(allProducts) || allProducts.length === 0) {
    console.error('[CART] allProducts vazio ao tentar adicionar:', id);
    return;
  }

  // Encontra produto convertendo id para número
  const product = allProducts.find(p => Number(p.id) === id);

  if (!product) {
    console.error('[CART] Produto não encontrado em allProducts:', id);
    return;
  }

  // Normaliza id do produto antes de adicionar
  const existingItem = cart.find(item => Number(item.id) === id);

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 0) + 1;
    console.log('[CART] Quantidade aumentada para:', existingItem.quantity);
  } else {
    // adiciona apenas campos necessários, garante id numérico
    const itemToPush = {
      id: id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || '',
      quantity: 1
    };
    cart.push(itemToPush);
    console.log('[CART] Novo produto adicionado:', itemToPush);
  }

  saveCartToLocalStorage();
  updateCart();
}

// --- Atualiza UI do carrinho ---
function updateCart() {
  const cartCount = document.querySelector('.cart-count');
  const cartTotalElement = document.getElementById('cart-total');

  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const cartTotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);

  if (cartCount) {
  cartCount.textContent = totalItems;  
  cartCount.style.display = 'flex';

  cartCount.style.transition = 'transform 0.2s';
  cartCount.style.transform = 'scale(1.15)';
  setTimeout(() => { cartCount.style.transform = 'scale(1)'; }, 150);
}


  if (cartTotalElement) {
    cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;
  }

  renderCartItems();
}

// --- Renderiza itens do carrinho ---
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');

  if (!cartItemsContainer) {
    console.error('[CART] Container do carrinho não encontrado (#cart-items)');
    return;
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty"><p>Seu carrinho está vazio</p></div>';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${Number(item.id)}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>R$ ${Number(item.price).toFixed(2).replace('.', ',')}</p>
        <div class="cart-item-quantity">
          <button class="btn-decrease" aria-label="Diminuir">-</button>
          <span class="cart-item-qty">${Number(item.quantity)}</span>
          <button class="btn-increase" aria-label="Aumentar">+</button>
        </div>
      </div>
      <button class="btn-remove" aria-label="Remover">&times;</button>
    </div>
  `).join('');

  // Não precisamos reanexar vários listeners: usamos delegation abaixo
  ensureCartDelegation();
}

// --- Delegation: um listener único no container para lidar com + / - / remover ---
let cartDelegationAttached = false;
function ensureCartDelegation() {
  const container = document.getElementById('cart-items');
  if (!container || cartDelegationAttached) return;

  container.addEventListener('click', function(e) {
    const btn = e.target;
    const cartItemEl = btn.closest('.cart-item');
    if (!cartItemEl) return;
    const id = normalizeId(cartItemEl.dataset.id);

    // Ações por classe
    if (btn.classList.contains('btn-increase')) {
      increaseQuantity(id);
      return;
    }
    if (btn.classList.contains('btn-decrease')) {
      decreaseQuantity(id);
      return;
    }
    if (btn.classList.contains('btn-remove')) {
      removeFromCart(id);
      return;
    }

    // Caso o clique venha em um span ou img dentro do botão, também cheque ancestors
    const increaseAncestor = btn.closest('.btn-increase');
    const decreaseAncestor = btn.closest('.btn-decrease');
    const removeAncestor = btn.closest('.btn-remove');
    if (increaseAncestor) { increaseQuantity(id); return; }
    if (decreaseAncestor) { decreaseQuantity(id); return; }
    if (removeAncestor) { removeFromCart(id); return; }
  });

  cartDelegationAttached = true;
}

// --- Modificadores de quantidade e remoção ---
function increaseQuantity(productId) {
  const id = normalizeId(productId);
  const item = cart.find(i => Number(i.id) === id);
  if (!item) {
    console.warn('[CART] increaseQuantity: item não encontrado', id);
    return;
  }
  item.quantity = Number(item.quantity || 0) + 1;
  saveCartToLocalStorage();
  updateCart();
}

function decreaseQuantity(productId) {
  const id = normalizeId(productId);
  const item = cart.find(i => Number(i.id) === id);
  if (!item) {
    console.warn('[CART] decreaseQuantity: item não encontrado', id);
    return;
  }
  if (item.quantity > 1) {
    item.quantity = Number(item.quantity) - 1;
  } else {
    cart = cart.filter(i => Number(i.id) !== id);
  }
  saveCartToLocalStorage();
  updateCart();
}

function removeFromCart(productId) {
  const id = normalizeId(productId);
  cart = cart.filter(i => Number(i.id) !== id);
  saveCartToLocalStorage();
  updateCart();
}



function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (!cartItemsContainer) {
    console.error('Container do carrinho não encontrado');
    return;
  }
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty"><p>Seu carrinho está vazio</p></div>';
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
        <div class="cart-item-quantity">
          <button class="btn-decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="btn-increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="btn-remove" data-id="${item.id}">&times;</button>
    </div>
  `).join('');
  
  // Adicionar event listeners aos botões do carrinho
  attachCartButtonListeners();
}

function attachCartButtonListeners() {
  document.querySelectorAll('.btn-increase').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      increaseQuantity(id);
    };
  });

  document.querySelectorAll('.btn-decrease').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      decreaseQuantity(id);
    };
  });

  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      removeFromCart(id);
    };
  });
}


function increaseQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity++;
    updateCart();
  }
}

function decreaseQuantity(productId) {
  const item = cart.find(i => i.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}


function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  cartSidebar.classList.toggle('active');
}

function toggleFilterModal() {
  const modal = document.getElementById('filter-modal');
  modal.classList.toggle('active');
}

function toggleSortModal() {
  const modal = document.getElementById('sort-modal');
  modal.classList.toggle('active');
}

function toggleFilterGroup(header) {
  const content = header.nextElementSibling;
  header.classList.toggle('active');
  content.classList.toggle('active');
}

function sortProducts(type) {
  const select = document.querySelector('.sort-select');
  
  switch(type) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      if (select) select.value = 'price-low';
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      if (select) select.value = 'price-high';
      break;
    case 'recent':
      filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (select) select.value = 'recent';
      break;
  }
  
  currentPage = 1;
  renderProducts();
  toggleSortModal();
}

function handleSort(event) {
  const value = event.target.value;
  
  switch(value) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'recent':
      filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
  }
  
  currentPage = 1;
  renderProducts();
}

function clearFilters() {
  activeFilters.colors = [];
  activeFilters.sizes = [];
  activeFilters.priceRanges = [];
  
  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  applyFilters();
}



function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, iniciando app...');
  fetchProducts();
  
  window.addEventListener('resize', () => {
    const oldValue = PRODUCTS_PER_PAGE;
    updateProductsPerPage();
    
    if (oldValue !== PRODUCTS_PER_PAGE) {
      currentPage = 1;
      renderProducts();
    }
  });
});