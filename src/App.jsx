import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Hero from './components/Hero';
import PhilosophySection from './components/PhilosophySection';
import MenuSection from './components/MenuSection';
import SignatureCarousel from './components/SignatureCarousel';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OrderModeModal from './components/OrderModeModal';
import FloatingCartButton from './components/FloatingCartButton';
import AdminDashboard from './pages/AdminDashboard';
import { Analytics } from "@vercel/analytics/react"

// Wrapper component to access context for OrderModeModal
const AppContent = () => {
  const { isOrderModeModalOpen, setIsOrderModeModalOpen } = useCart();

  return (
    <>
      <Analytics />
      <OrderModeModal
        isOpen={isOrderModeModalOpen}
        onClose={() => setIsOrderModeModalOpen(false)}
      />
      <CartDrawer />
      <FloatingCartButton />

      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-mitake-black text-mitake-offwhite font-sans selection:bg-mitake-gold selection:text-black overflow-x-hidden">
            <div className="noise-overlay pointer-events-none"></div>
            <main>
              <Hero />
              <PhilosophySection />
              <MenuSection />
              <SignatureCarousel />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/admin-mitake" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
