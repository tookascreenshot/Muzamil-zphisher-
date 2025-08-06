// Sample Products Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        description: "High-quality wireless headphones with noise cancellation",
        category: "electronics",
        rating: 4.5,
        inStock: true
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        description: "Feature-rich smartwatch with health monitoring",
        category: "electronics",
        rating: 4.3,
        inStock: true
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        description: "Comfortable running shoes for all terrains",
        category: "sports",
        rating: 4.7,
        inStock: true
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=300&h=300&fit=crop",
        description: "Automatic coffee maker with programmable timer",
        category: "home",
        rating: 4.2,
        inStock: false
    },
    {
        id: 5,
        name: "Laptop Backpack",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        description: "Durable laptop backpack with multiple compartments",
        category: "accessories",
        rating: 4.4,
        inStock: true
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
        description: "Portable Bluetooth speaker with rich sound",
        category: "electronics",
        rating: 4.6,
        inStock: true
    },
    {
        id: 7,
        name: "Yoga Mat",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
        description: "Non-slip yoga mat for home and studio practice",
        category: "sports",
        rating: 4.5,
        inStock: true
    },
    {
        id: 8,
        name: "Desk Lamp",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
        description: "LED desk lamp with adjustable brightness",
        category: "home",
        rating: 4.1,
        inStock: true
    }
];

// App State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentCategory = 'all';
let currentSort = 'name';
let searchTerm = '';
let currentPage = 'home';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const wishlistCount = document.getElementById('wishlistCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const toastContainer = document.getElementById('toastContainer');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    updateCartDisplay();
    updateWishlistDisplay();
    attachEventListeners();
});

function initializeApp() {
    // Page navigation
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === 'homePage') {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

function attachEventListeners() {
    // Navigation
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('closeCartBtn').addEventListener('click', closeCartModal);
    document.getElementById('wishlistBtn').addEventListener('click', showWishlistPage);
    document.getElementById('adminBtn').addEventListener('click', showAdminPanel);
    
    // Back buttons
    document.getElementById('backBtn').addEventListener('click', showHomePage);
    document.getElementById('backToHomeBtn').addEventListener('click', showHomePage);
    document.getElementById('backToStoreBtn').addEventListener('click', showHomePage);
    
    // Search and filters
    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
    
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });
    
    // Cart actions
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
    // Close modal on outside click
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Checkout form events
    document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckoutModal);
    document.getElementById('cancelCheckout').addEventListener('click', closeCheckoutModal);
    document.getElementById('checkoutForm').addEventListener('submit', processOrder);
    
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
}

// Product Display Functions
function loadProducts() {
    const filteredProducts = getFilteredProducts();
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onclick="showProductDetail(${product.id})">
            <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                <i class="fas fa-heart"></i>
            </button>
            ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title" onclick="showProductDetail(${product.id})">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="stars">${renderStars(product.rating)}</div>
                <span>(${product.rating})</span>
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-primary" ${!product.inStock ? 'disabled' : ''} onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

function getFilteredProducts() {
    let filtered = products;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Sort products
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
    
    return filtered;
}

// Filter and Search Functions
function handleCategoryFilter(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentCategory = e.target.dataset.category;
    loadProducts();
}

function handleSearch(e) {
    searchTerm = e.target.value;
    loadProducts();
}

function handleSort(e) {
    currentSort = e.target.value;
    loadProducts();
}

// Product Detail Functions
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productDetailContent = document.getElementById('productDetailContent');
    const isInWishlist = wishlist.some(item => item.id === product.id);
    
    productDetailContent.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <div class="product-category">${product.category}</div>
                    <h1>${product.name}</h1>
                    <div class="product-rating">
                        <div class="stars">${renderStars(product.rating)}</div>
                        <span>(${product.rating}) • 127 reviews</span>
                    </div>
                    <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="features">
                        <h3>Features:</h3>
                        <ul>
                            <li>Premium quality materials</li>
                            <li>1 year warranty included</li>
                            <li>Free shipping on orders over $50</li>
                            <li>30-day return policy</li>
                        </ul>
                    </div>
                    
                    ${product.inStock ? `
                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <input type="number" id="quantityInput" class="quantity-input" value="1" min="1" max="10">
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCartWithQuantity(${product.id})">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                            <button class="btn ${isInWishlist ? 'btn-secondary' : 'btn-primary'}" onclick="toggleWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                                ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>
                    ` : `
                        <div class="out-of-stock-message">
                            <p><strong>Out of Stock</strong></p>
                            <button class="btn btn-secondary" onclick="toggleWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                                Add to Wishlist
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    showPage('productDetailPage');
}

function addToCartWithQuantity(productId) {
    const quantityInput = document.getElementById('quantityInput');
    const quantity = parseInt(quantityInput.value) || 1;
    
    for (let i = 0; i < quantity; i++) {
        addToCart(productId);
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartDisplay();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
        saveCart();
    }
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    saveCart();
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p>Add some products to get started!</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function openCartModal() {
    cartModal.classList.add('active');
}

function closeCartModal() {
    cartModal.classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    showCheckoutForm();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout Functions
function showCheckoutForm() {
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    // Display cart items in checkout
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Display total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = total.toFixed(2);
    
    checkoutModal.classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function processOrder(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString(),
        customer: {
            name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phoneNumber'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country')
        },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending'
    };
    
    // Save order
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    // Close modals
    closeCheckoutModal();
    closeCartModal();
    
    // Show success message
    alert(`Order placed successfully!\nOrder ID: ${orderData.id}\nThank you ${orderData.customer.name}!`);
    
    // Reset form
    e.target.reset();
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
    } else {
        wishlist.push(product);
    }
    
    updateWishlistDisplay();
    saveWishlist();
    
    // Refresh current page to update heart icons
    if (currentPage === 'home') {
        loadProducts();
    } else if (currentPage === 'wishlist') {
        loadWishlistProducts();
    }
}

function updateWishlistDisplay() {
    wishlistCount.textContent = wishlist.length;
}

function loadWishlistProducts() {
    const wishlistContent = document.getElementById('wishlistContent');
    
    if (wishlist.length === 0) {
        wishlistContent.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Your wishlist is empty</h3>
                <p>Start adding products you love to your wishlist!</p>
                <button class="btn btn-primary" onclick="showHomePage()">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    wishlistContent.innerHTML = '';
    wishlist.forEach(product => {
        const productCard = createWishlistCard(product);
        wishlistContent.appendChild(productCard);
    });
}

function createWishlistCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onclick="showProductDetail(${product.id})">
            <button class="wishlist-btn active" onclick="toggleWishlist(${product.id})">
                <i class="fas fa-heart"></i>
            </button>
            ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title" onclick="showProductDetail(${product.id})">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="stars">${renderStars(product.rating)}</div>
                <span>(${product.rating})</span>
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-primary" ${!product.inStock ? 'disabled' : ''} onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId.replace('Page', '');
}

function showHomePage() {
    showPage('homePage');
    loadProducts();
}

function showWishlistPage() {
    showPage('wishlistPage');
    loadWishlistProducts();
}

function showAdminPanel() {
    showPage('adminPage');
    loadAdminDashboard();
}

// Admin Panel Functions
function loadAdminDashboard() {
    const adminContent = document.getElementById('adminContent');
    
    // Calculate real stats from orders
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalUsers = new Set(orders.map(order => order.customer.email)).size;
    
    adminContent.innerHTML = `
        <div class="admin-stats">
            <div class="stat-card">
                <div class="stat-number">${totalOrders}</div>
                <div>Total Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$${totalRevenue.toLocaleString()}</div>
                <div>Revenue</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalProducts}</div>
                <div>Products</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalUsers}</div>
                <div>Users</div>
            </div>
        </div>
        
        <div class="admin-table">
            <h3>Recent Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.length === 0 ? `
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 2rem;">
                                No orders yet. Orders will appear here when customers make purchases.
                            </td>
                        </tr>
                    ` : orders.slice(-5).reverse().map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.customer.name}</td>
                            <td>${order.customer.phone}</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td><span class="status ${order.status}">${order.status}</span></td>
                            <td>${order.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Add admin tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.dataset.tab;
            if (tab === 'products') {
                loadProductsAdmin();
            } else if (tab === 'orders') {
                loadOrdersAdmin();
            } else {
                loadAdminDashboard();
            }
        });
    });
}

function loadProductsAdmin() {
    const adminContent = document.getElementById('adminContent');
    
    adminContent.innerHTML = `
        <div class="admin-header">
            <h3>Product Management</h3>
            <button class="btn btn-primary" onclick="alert('Add product feature coming soon!')">
                <i class="fas fa-plus"></i>
                Add Product
            </button>
        </div>
        
        <div class="admin-table">
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.category}</td>
                            <td>$${product.price}</td>
                            <td>${product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                            <td>
                                <button class="btn btn-sm" onclick="alert('Edit feature coming soon!')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="alert('Delete feature coming soon!')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function loadOrdersAdmin() {
    const adminContent = document.getElementById('adminContent');
    
    adminContent.innerHTML = `
        <h3>Order Management</h3>
        <div class="admin-table">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Details</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.length === 0 ? `
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 2rem;">
                                No orders yet. Orders will appear here when customers make purchases.
                            </td>
                        </tr>
                    ` : orders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>
                                <strong>${order.customer.name}</strong><br>
                                📧 ${order.customer.email}<br>
                                📞 ${order.customer.phone}<br>
                                📍 ${order.customer.address}, ${order.customer.city}
                            </td>
                            <td>
                                ${order.items.map(item => `${item.name} (x${item.quantity})`).join('<br>')}
                            </td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td>
                                <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </td>
                            <td>${order.date}</td>
                            <td>
                                <button class="btn btn-sm" onclick="viewOrderDetails('${order.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Order Management Functions
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        alert(`Order ${orderId} status updated to: ${newStatus}`);
    }
}

function viewOrderDetails(orderId) {
    const order = orders.find(order => order.id === orderId);
    if (order) {
        const details = `
Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${order.id}
Date: ${order.date}
Status: ${order.status}

Customer Information:
• Name: ${order.customer.name}
• Email: ${order.customer.email}
• Phone: ${order.customer.phone}
• Address: ${order.customer.address}
• City: ${order.customer.city}
• Postal Code: ${order.customer.postalCode}
• Country: ${order.customer.country}

Items Ordered:
${order.items.map(item => `• ${item.name} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total Amount: $${order.total.toFixed(2)}
        `;
        alert(details);
    }
}

// Global functions for onclick handlers
window.showProductDetail = showProductDetail;
window.addToCart = addToCart;
window.addToCartWithQuantity = addToCartWithQuantity;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.checkout = checkout;
window.toggleWishlist = toggleWishlist;
window.showHomePage = showHomePage;
window.showWishlistPage = showWishlistPage;
window.showAdminPanel = showAdminPanel;
window.updateOrderStatus = updateOrderStatus;
window.viewOrderDetails = viewOrderDetails;