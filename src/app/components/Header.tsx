import { useState } from 'react';
import {
  LogIn,
  Menu,
  UserRound,
  X,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onCartClick?: () => void;
}

const navigationItems = [
  {
    label: 'الرئيسية',
    page: 'home',
  },
  {
    label: 'ابدأ اللعب',
    page: 'play',
  },
  {
    label: 'طريقة اللعب',
    page: 'how',
  },
  {
    label: 'وسائل المساعدة',
    page: 'helpers-info',
  },
];

export default function Header({
  onNavigate,
}: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const openAccount = () => {
    if (!user) {
      navigate('login');
      return;
    }

    if (isAdmin) {
      navigate('admin');
      return;
    }

    navigate('account');
  };

  return (
    <header
      dir="rtl"
      className="fixed inset-x-0 top-0 z-50 border-b border-[#5962B7]/35 bg-[#080A10]/95 px-4 py-3 text-white backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1250px] items-center justify-between rounded-[20px] border-[3px] border-[#4A5397] bg-[#0C0E15] px-4 py-2 shadow-[7px_8px_0_rgba(48,54,112,0.55)] lg:px-6">
        {/* اللوجو */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex shrink-0 items-center"
          aria-label="الصفحة الرئيسية"
        >
          <img
            src="/almaydan-logo.png?v=6"
            alt="الميدان يا حميدان"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </button>

        {/* روابط الكمبيوتر */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => navigate(item.page)}
              className="rounded-full border-2 border-[#5862AE] bg-[#272C60] px-5 py-2 text-sm font-black transition hover:-translate-y-0.5 hover:border-[#FACC15] hover:bg-[#323975]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* الحساب وتسجيل الدخول */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={openAccount}
            className="flex h-11 w-12 items-center justify-center rounded-full border-2 border-[#5862AE] bg-[#272C60] transition hover:border-[#FACC15] hover:bg-[#323975]"
            aria-label={user ? 'حسابي' : 'الحساب'}
          >
            <UserRound className="h-5 w-5" />
          </button>

          {!user ? (
            <button
              type="button"
              onClick={() => navigate('login')}
              className="inline-flex h-11 items-center gap-3 rounded-2xl border-2 border-[#FF4E5A] bg-[#EF3340] px-6 font-black text-white shadow-[inset_0_-4px_0_rgba(130,0,15,0.25)] transition hover:-translate-y-0.5 hover:bg-[#FF4452]"
            >
              <LogIn className="h-5 w-5" />
              تسجيل الدخول
            </button>
          ) : (
            <button
              type="button"
              onClick={openAccount}
              className="inline-flex h-11 max-w-48 items-center gap-3 rounded-2xl border-2 border-[#FACC15] bg-[#FACC15] px-5 font-black text-[#211047] transition hover:-translate-y-0.5"
            >
              <UserRound className="h-5 w-5" />

              <span className="truncate">
                {isAdmin ? 'لوحة الإدارة' : 'حسابي'}
              </span>
            </button>
          )}
        </div>

        {/* زر قائمة الجوال */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 lg:hidden"
          aria-label="فتح القائمة"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* قائمة الجوال */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-[1250px] rounded-[24px] border-2 border-[#4A5397] bg-[#0C0E15] p-4 shadow-2xl lg:hidden">
          <nav className="grid gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right font-black transition hover:border-[#FACC15]/50 hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={openAccount}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#5862AE] bg-[#272C60] px-4 py-4 font-black"
            >
              <UserRound className="h-5 w-5" />
              {user
                ? isAdmin
                  ? 'الإدارة'
                  : 'حسابي'
                : 'الحساب'}
            </button>

            {!user ? (
              <button
                type="button"
                onClick={() => navigate('login')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EF3340] px-4 py-4 font-black"
              >
                <LogIn className="h-5 w-5" />
                تسجيل الدخول
              </button>
            ) : (
              <button
                type="button"
                onClick={openAccount}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FACC15] px-4 py-4 font-black text-[#211047]"
              >
                <UserRound className="h-5 w-5" />
                فتح الحساب
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
