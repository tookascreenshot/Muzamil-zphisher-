import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import ProductDetail from './components/ProductDetail';
import WishlistPage from './components/WishlistPage';
import AdminPanel from './components/AdminPanel';
import CartModal from './components/CartModal';
import Toast from './components/Toast';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('products'); // products, productDetail, wishlist, admin
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentView('productDetail');
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
    setSelectedProduct(null);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'productDetail':
        return (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToProducts}
            onAddReview={(product) => showToast('Review feature coming soon!', 'info')}
          />
        );
      case 'wishlist':
        return (
          <WishlistPage
            onBack={handleBackToProducts}
            onProductClick={handleProductClick}
          />
        );
      case 'admin':
        return <AdminPanel onBack={handleBackToProducts} />;
      case 'products':
      default:
        return (
          <ProductListing
            searchTerm={searchTerm}
            onProductClick={handleProductClick}
          />
        );
    }
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen bg-gray-50">
          {currentView !== 'admin' && (
            <Header
              onCartClick={handleCartClick}
              onWishlistClick={() => setCurrentView('wishlist')}
              onAdminClick={() => setCurrentView('admin')}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          )}
          
          <main>
            {renderCurrentView()}
          </main>
          
          <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
          
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
