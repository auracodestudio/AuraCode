import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useI18n } from '@/i18n/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export default function Navigation({ onOpenCart, onOpenLogin, onOpenSignup }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { t, isRTL } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll to section - works from any page
  const scrollToSection = (href: string) => {
    const sectionId = href.substring(1);
    
    if (location.pathname !== '/') {
      // Not on homepage, navigate there first
      navigate(`/${href}`);
    } else {
      // On homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t.nav.work, href: '#work' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.store, href: '#store' },
    { label: t.nav.studio, href: '#studio' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0f0a1a]/90 backdrop-blur-md py-2 sm:py-3 border-b border-purple-500/10'
            : 'bg-transparent py-3 sm:py-5'
        }`}
      >
        <div className="w-full px-3 sm:px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight hover:text-purple-400 transition-colors"
          >
            AuraCode
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <span className="text-sm font-bold text-purple-400">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-[#1a1025] border-purple-500/20 text-foreground w-48"
                  align={isRTL ? 'end' : 'start'}
                >
                  <div className="px-3 py-2 border-b border-purple-500/10">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem 
                    onClick={() => navigate('/account')}
                    className="cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t.nav.myAccount}
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {t.nav.adminDashboard}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-purple-500/10" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10"
                  >
                    {t.nav.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={onOpenLogin}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  {t.nav.signIn}
                </Button>
                <Button
                  onClick={onOpenSignup}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-full text-sm"
                >
                  {t.nav.signUp}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Mobile */}
            <div className="scale-90 sm:scale-100">
              <LanguageSwitcher />
            </div>

            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 text-foreground"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button
              className="text-foreground p-1.5 sm:p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-[#0f0a1a] transition-transform duration-500 lg:hidden ${
          isMobileMenuOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full' 
              : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-5 sm:gap-6 px-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-xl sm:text-2xl font-display font-semibold text-foreground hover:text-purple-400 transition-colors"
            >
              {link.label}
            </button>
          ))}
          
          <div className="border-t border-purple-500/10 w-40 sm:w-48 my-2 sm:my-4" />
          
          {isAuthenticated ? (
            <>
              <div className="text-center">
                <p className="font-medium text-sm sm:text-base">{user?.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-40 sm:w-48 py-2.5 sm:py-3 text-center rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors text-sm sm:text-base"
              >
                {t.nav.myAccount}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-40 sm:w-48 py-2.5 sm:py-3 text-center rounded-full border border-purple-500/30 hover:bg-purple-500/10 transition-colors text-sm sm:text-base"
                >
                  {t.nav.adminDashboard}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-40 sm:w-48 py-2.5 sm:py-3 text-center rounded-full border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors text-sm sm:text-base"
              >
                {t.nav.signOut}
              </button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                variant="outline"
                className="border-purple-500/30 w-40 sm:w-48 text-sm sm:text-base"
              >
                {t.nav.signIn}
              </Button>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSignup();
                }}
                className="bg-purple-600 hover:bg-purple-700 w-40 sm:w-48 text-sm sm:text-base"
              >
                {t.nav.signUp}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
