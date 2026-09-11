import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/authHelpers';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface/85 backdrop-blur-md shadow-premium' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">First Computer ERP</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              to={link.href}
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button className="gap-2">
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-input transition-colors cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {isOpen && (
        <div className="md:hidden bg-surface p-6 space-y-4 shadow-lg absolute top-18 left-0 right-0">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border/50" />
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full justify-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="text-base font-medium text-text-secondary hover:text-primary transition-colors block py-1"
                >
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block">
                  <Button className="w-full justify-center">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
