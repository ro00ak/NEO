import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { language } = useLanguage();
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { key: 'الرئيسية', page: 'home' },
    { key: 'ابدأ اللعب', page: 'play' },
    { key: 'طريقة اللعب', page: 'how' },
  ];

  // Close user menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    if (!showUserMenu) {
      return;
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#14001F] text-white"
    >
      <div className="relative max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            type="button"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center cursor-pointer"
          >
            <div className="flex items-center justify-center bg-transparent p-0">
              <img
                src="/almaydan-logo.png?v=5"
                alt="الميدان يا حميدان"
                className="h-14 w-auto object-contain"
              />
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.page)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative text-sm tracking-wide text-white/80 hover:text-white transition-colors group"
              >
                {item.key}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"
                />
              </motion.button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            {user ? (
              <div className="relative user-menu-container">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                >
                  <User className="w-5 h-5" />
                </motion.button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 p-2 rounded-2xl bg-[#14001F]/95 backdrop-blur-xl border border-white/10 shadow-lg z-50 text-white"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-white/70">{user.email}</p>
                      {user.role === 'wholesale' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                          {language === 'ar' ? 'جملة' : 'Wholesale'}
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-right text-sm hover:bg-white/10 rounded-xl flex items-center gap-2 text-white"
                      >
                        <Settings className="w-4 h-4" />
                        {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                      </button>
                    )}

                    {user.role === 'wholesale' && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('wholesale-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-right text-sm hover:bg-white/10 rounded-xl flex items-center gap-2 text-white"
                      >
                        <Settings className="w-4 h-4" />
                        {language === 'ar' ? 'لوحة الجملة' : 'Wholesale Dashboard'}
                      </button>
                    )}

                    {user.role === 'user' && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('customer-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-right text-sm hover:bg-white/10 rounded-xl flex items-center gap-2 text-white"
                      >
                        <User className="w-4 h-4" />
                        {language === 'ar' ? 'حسابي' : 'My Account'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        onNavigate('home');
                      }}
                      className="w-full px-4 py-2 text-right text-sm hover:bg-white/10 rounded-xl flex items-center gap-2 text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('login')}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <User className="w-5 h-5" />
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.page);
                  setIsMenuOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="block py-3 text-sm text-white/80 hover:text-white transition-colors w-full text-right"
              >
                {item.key}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
