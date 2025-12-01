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
import KitchenDashboard from './pages/KitchenDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
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
        <Route path="/admin/kitchen" element={<KitchenDashboard />} />
        <Route path="/admin/manager" element={<ManagerDashboard />} />
        <Route path="/admin/delivery" element={<DeliveryDashboard />} />
      </Routes>
    </>
  );
};

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <SeoHead
              title="Restaurant Japonais Aix-en-Provence"
              description="Mitake Ramen - Restaurant japonais authentique à Aix-en-Provence. Découvrez nos ramen tonkotsu, shoyu, miso faits maison. Livraison Aix-en-Provence, Marseille & Bouches-du-Rhône. Gyoza, cuisine japonaise traditionnelle. Commandez en ligne."
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
                    "telephone": "+33972213899",
                    "menu": "https://mitakeramen.page/#menu",
                    "acceptsReservations": true,
                    "servesCuisine": ["Ramen", "Japanese", "Tonkotsu", "Gyoza", "Nouilles Japonaises"],
                    "priceRange": "€€",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "569 Av. Henri Mauriat, 13100 Aix-en-Provence",
                      "addressLocality": "Aix-en-Provence",
                      "addressRegion": "Provence-Alpes-Côte d'Azur",
                      "postalCode": "13100",
                      "addressCountry": "FR"
                    },
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": 43.5263,
                      "longitude": 5.4454
                    },
                    "areaServed": [
                      {
                        "@type": "City",
                        "name": "Aix-en-Provence"
                      },
                      {
                        "@type": "City",
                        "name": "Marseille"
                      },
                      {
                        "@type": "State",
                        "name": "Bouches-du-Rhône"
                      }
                    ],
                    "sameAs": [
                      "https://www.instagram.com/mitake.ramen",
                      "https://www.facebook.com/mitakeramen"
                    ],
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
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
