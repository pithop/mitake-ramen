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
import { HelmetProvider, Helmet } from 'react-helmet-async';
import SeoHead from './components/SeoHead';

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
    <HelmetProvider>
      <CartProvider>
        <Router>
          <SeoHead
            title="Mitake Ramen | Restaurant Japonais Aix-en-Provence"
            description="Découvrez Mitake Ramen, le restaurant japonais authentique à Aix-en-Provence. Ramen faits maison, Gyoza, et cuisine traditionnelle. Commandez en ligne ou sur place."
            canonicalUrl="https://mitakeramen.page"
          />
          <Helmet>
            <script type="application/ld+json">
              {`
                {
                  "@context": "https://schema.org",
                  "@type": "Restaurant",
                  "name": "Mitake Ramen",
                  "image": "https://mitakeramen.page/assets/hero-ramen.png",
                  "@id": "https://mitakeramen.page",
                  "url": "https://mitakeramen.page",
                  "telephone": "",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Aix-en-Provence",
                    "addressLocality": "Aix-en-Provence",
                    "postalCode": "13100",
                    "addressCountry": "FR"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 43.5297,
                    "longitude": 5.4474
                  },
                  "servesCuisine": "Ramen, Japanese",
                  "priceRange": "€€",
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                      ],
                      "opens": "11:30",
                      "closes": "22:30"
                    }
                  ]
                }
              `}
            </script>
          </Helmet>
          <AppContent />
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
