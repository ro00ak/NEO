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
      className="fixed inset-x-0 top-0 z-50 bg-transparent px-4 pt-5 text-white"
    >
      <div
        className="
          relative mx-auto flex max-w-[1250px] items-center justify-between
          rounded-[22px] border-2 border-[#5964BD]
          bg-gradient-to-b from-[#111522] to-[#090B12]
          px-4 py-3
          shadow-[0_8px_0_#2A326E,0_18px_35px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]
          lg:px-6
        "
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* اللوجو */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex shrink-0 items-center transition hover:scale-105"
          aria-label="الصفحة الرئيسية"
        >
          <img
            src="/almaydan-logo.png?v=7"
            alt="الميدان يا حميدان"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </button>

        {/* روابط الكمبيوتر */}
        <nav className="hidden items-center gap-3 lg:flex">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => navigate(item.page)}
              className="
                rounded-full border-2 border-[#5964BD]
                bg-gradient-to-b from-[#303873] to-[#222858]
                px-5 py-2 text-sm font-black
                shadow-[0_4px_0_#151A3D,inset_0_1px_0_rgba(255,255,255,0.2)]
                transition
                hover:-translate-y-1
                hover:border-[#FACC15]
                hover:from-[#3A4385]
                hover:to-[#293166]
              "
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* الحساب */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={openAccount}
            className="
              flex h-11 w-12 items-center justify-center
              rounded-full border-2 border-[#5964BD]
              bg-gradient-to-b from-[#303873] to-[#222858]
              shadow-[0_4px_0_#151A3D,inset_0_1px_0_rgba(255,255,255,0.2)]
              transition
              hover:-translate-y-1
              hover:border-[#FACC15]
            "
            aria-label={user ? 'حسابي' : 'الحساب'}
          >
            <UserRound className="h-5 w-5" />
          </button>

          {!user ? (
            <button
              type="button"
              onClick={() => navigate('login')}
              className="
                inline-flex h-11 items-center gap-3
                rounded-2xl border-2 border-[#FF5966]
                bg-gradient-to-b from-[#FF4B59] to-[#D92334]
                px-6 font-black text-white
                shadow-[0_5px_0_#8F1020,inset_0_1px_0_rgba(255,255,255,0.25)]
                transition
                hover:-translate-y-1
              "
            >
              <LogIn className="h-5 w-5" />
              تسجيل الدخول
            </button>
          ) : (
            <button
              type="button"
              onClick={openAccount}
              className="
                inline-flex h-11 max-w-48 items-center gap-3
                rounded-2xl border-2 border-[#FFE36A]
                bg-gradient-to-b from-[#FFD83D] to-[#F4B800]
                px-5 font-black text-[#211047]
                shadow-[0_5px_0_#9C7000,inset_0_1px_0_rgba(255,255,255,0.4)]
                transition
                hover:-translate-y-1
              "
            >
              <UserRound className="h-5 w-5" />

              <span className="truncate">
                {isAdmin ? 'لوحة الإدارة' : 'حسابي'}
              </span>
            </button>
          )}
        </div>

        {/* زر الجوال */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border-2 border-[#5964BD]
            bg-gradient-to-b from-[#303873] to-[#222858]
            shadow-[0_4px_0_#151A3D]
            lg:hidden
          "
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
        <div
          className="
            mx-auto mt-4 max-w-[1250px]
            rounded-[24px] border-2 border-[#5964BD]
            bg-gradient-to-b from-[#111522] to-[#090B12]
            p-4
            shadow-[0_8px_0_#2A326E,0_20px_40px_rgba(0,0,0,0.5)]
            lg:hidden
          "
        >
          <nav className="grid gap-3">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="
                  rounded-2xl border-2 border-[#5964BD]
                  bg-gradient-to-b from-[#303873] to-[#222858]
                  px-5 py-4 text-right font-black
                  shadow-[0_4px_0_#151A3D]
                "
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={openAccount}
              className="
                inline-flex items-center justify-center gap-2
                rounded-2xl border-2 border-[#5964BD]
                bg-gradient-to-b from-[#303873] to-[#222858]
                px-4 py-4 font-black
                shadow-[0_4px_0_#151A3D]
              "
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
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl border-2 border-[#FF5966]
                  bg-gradient-to-b from-[#FF4B59] to-[#D92334]
                  px-4 py-4 font-black
                  shadow-[0_4px_0_#8F1020]
                "
              >
                <LogIn className="h-5 w-5" />
                تسجيل الدخول
              </button>
            ) : (
              <button
                type="button"
                onClick={openAccount}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl border-2 border-[#FFE36A]
                  bg-gradient-to-b from-[#FFD83D] to-[#F4B800]
                  px-4 py-4 font-black text-[#211047]
                  shadow-[0_4px_0_#9C7000]
                "
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
