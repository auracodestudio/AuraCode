import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface SectionButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
}

/**
 * Smart button that handles navigation to sections from any page.
 * If on homepage, scrolls to section. If on another page, navigates to homepage then scrolls.
 */
export function SectionButton({ 
  to, 
  children, 
  className = '', 
  variant = 'primary',
  showArrow = false 
}: SectionButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useI18n();

  const handleClick = () => {
    if (to.startsWith('#')) {
      const sectionId = to.substring(1);
      
      // If not on homepage, navigate to homepage with the hash
      if (location.pathname !== '/') {
        navigate(`/${to}`);
      } else {
        // Already on homepage, just scroll to section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Regular route navigation
      navigate(to);
    }
  };

  const baseStyles = 'font-semibold px-6 sm:px-8 py-4 sm:py-6 rounded-full text-sm sm:text-base transition-all';
  
  const variantStyles = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 hover:-translate-y-0.5',
    secondary: 'bg-white/10 text-foreground hover:bg-white/20 hover:scale-105',
    outline: 'border border-white/20 text-foreground hover:bg-white/5 hover:border-purple-500/50'
  };

  return (
    <Button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
      {showArrow && (
        <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} w-4 h-4 group-hover:translate-x-1 transition-transform`} />
      )}
    </Button>
  );
}

interface SmartLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Smart link component that handles both internal routes and section scrolling.
 */
export function SmartLink({ to, children, className = '', onClick }: SmartLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    if (to.startsWith('#')) {
      const sectionId = to.substring(1);
      
      if (location.pathname !== '/') {
        // Navigate to homepage with hash
        navigate(`/${to}`);
      } else {
        // Scroll to section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(to);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
