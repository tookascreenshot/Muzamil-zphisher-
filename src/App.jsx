import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductListing from './components/ProductListing';
import CartModal from './components/CartModal';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onCartClick={handleCartClick}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        <main>
          <ProductListing searchTerm={searchTerm} />
        </main>
        
        <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
      </div>
    </CartProvider>
  );
}

export default App;
