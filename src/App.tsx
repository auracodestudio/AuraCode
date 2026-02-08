import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Database
import { db } from './db/database';
import { seedDatabase } from './db/seed';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Import sections
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import DesignSection from './sections/DesignSection';
import CodeSection from './sections/CodeSection';
import MobileSection from './sections/MobileSection';
import BrandSection from './sections/BrandSection';
import IdentitySection from './sections/IdentitySection';
import ServicesSection from './sections/ServicesSection';
import WorkSection from './sections/WorkSection';
import ProductCatalog from './sections/ProductCatalog';
import AdminPanel from './sections/AdminPanel';
import UserAccount from './sections/UserAccount';
import ContactSection from './sections/ContactSection';

// E-commerce components
import AuthModal from './components/ecommerce/AuthModal';
import CartDrawer from './components/ecommerce/CartDrawer';
import CheckoutModal from './components/ecommerce/CheckoutModal';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [isDbReady, setIsDbReady] = useState(false);

  // Initialize database on mount
  useEffect(() => {
    const initDb = async () => {
      await db.init();
      await seedDatabase();
      setIsDbReady(true);
    };
    initDb();
  }, []);

  useLayoutEffect(() => {
    if (!isDbReady) return;

    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center:
          (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isDbReady]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const openLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Initializing database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div ref={mainRef} className="relative bg-dark text-foreground">
          <div className="grain-overlay" />

          <Navigation
            onOpenCart={() => setIsCartOpen(true)}
            onOpenLogin={openLogin}
            onOpenSignup={openSignup}
          />

          <main className="relative">
            <HeroSection className="z-10" />
            <DesignSection className="z-20" />
            <CodeSection className="z-30" />
            <MobileSection className="z-40" />
            <BrandSection className="z-50" />
            <IdentitySection className="z-[60]" />
            <ServicesSection className="z-[70]" />
            <WorkSection className="z-[80]" />
            <ProductCatalog className="z-[85]" />
            <AdminPanel className="z-[86]" />
            <UserAccount className="z-[87]" />
            <ContactSection className="z-[90]" />
          </main>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            defaultTab={authModalTab}
          />
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
