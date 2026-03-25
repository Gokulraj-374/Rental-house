import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Moon, Sun, House, Heart, Plus, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <House className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">RentAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    isActive('/dashboard') ? 'text-primary' : 'text-foreground'
                  }`}
                  data-testid="nav-dashboard"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/browse"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    isActive('/browse') ? 'text-primary' : 'text-foreground'
                  }`}
                  data-testid="nav-browse"
                >
                  {t('nav.browse')}
                </Link>
                <Link
                  to="/favorites"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    isActive('/favorites') ? 'text-primary' : 'text-foreground'
                  }`}
                  data-testid="nav-favorites"
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  {t('nav.favorites')}
                </Link>
                <Link
                  to="/add-property"
                  className={`text-sm font-medium hover:text-primary transition-colors ${
                    isActive('/add-property') ? 'text-primary' : 'text-foreground'
                  }`}
                  data-testid="nav-add-property"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  {t('nav.add_property')}
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full"
              data-testid="theme-toggle"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" data-testid="nav-profile">
                  <Button variant="ghost" size="sm" className="rounded-full gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/?auth=login" data-testid="login-link">
                <Button className="rounded-full btn-hover" size="sm">
                  {t('nav.login')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
            data-testid="mobile-menu"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                  <Link
                    to="/browse"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.browse')}
                  </Link>
                  <Link
                    to="/favorites"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.favorites')}
                  </Link>
                  <Link
                    to="/add-property"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.add_property')}
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-sm font-medium hover:text-primary text-left w-full"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};