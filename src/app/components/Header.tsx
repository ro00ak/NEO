import { useState } from 'react';
import {
  ChevronDown,
  LogIn,
  Menu,
  UserRound,
  X,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import {
  currencies,
  useCurrency,
  type CurrencyCode,
} from '../contexts/CurrencyContext';

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
    label: 'الباقات',
    page: 'pricing',
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
  const { currency, setCurrencyCode } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] =
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
          rounded-[28px] border border-white/15
          bg-[#180b32]/85 px-5 py-3.5
          shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]
          backdrop-blur-2xl lg:px-7
        "
      >
        <div className="pointer-events-none absolute inset-x-16 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

        {/* الحساب واختيار العملة (يسار القائمة في الديسكتوب) */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() =>
                setCurrencyMenuOpen((current) => !current)
              }
              className="
                flex h-11 min-w-[105px] items-center justify-center gap-2
                rounded-2xl border-2 border-[#5964BD]
                bg-gradient-to-b from-[#303873] to-[#222858]
                px-4 font-black text-white
                shadow-[0_4px_0_#151A3D,inset_0_1px_0_rgba(255,255,255,0.2)]
                transition
                hover:-translate-y-1
                hover:border-[#FACC15]
              "
            >
              <span className="text-xl">{currency.flag}</span>

              <span>{currency.code}</span>

              <ChevronDown
                className={`h-4 w-4 text-[#FACC15] transition ${
                  currencyMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {currencyMenuOpen && (
              <div
                className="
                  absolute left-0 top-[calc(100%+14px)] z-[100]
                  w-[260px]
                  rounded-[28px] border-2 border-[#5964BD]
                  bg-[#F7F7F8] p-4
                  shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                "
              >
                <div className="grid grid-cols-2 gap-3">
                  {currencies.map((item) => {
                    const isSelected =
                      currency.code === item.code;

                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setCurrencyCode(
                            item.code as CurrencyCode,
                          );
                          setCurrencyMenuOpen(false);
                        }}
                        className={`flex h-12 items-center justify-center gap-2 rounded-full border-2 px-3 font-black transition ${
                          isSelected
                            ? 'border-[#321064] bg-[#E4E6EA] text-[#321064]'
                            : 'border-[#7B8494] bg-white text-[#252B35] hover:border-[#FACC15]'
                        }`}
                      >
                        <span className="text-xl">
                          {item.flag}
                        </span>

                        <span className="text-sm">
                          {item.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openAccount}
            className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl border border-white/15
              bg-white/5
              shadow-[0_4px_20px_rgba(0,0,0,0.2)]
              transition-all duration-300
              hover:-translate-y-0.5 hover:border-yellow-400/50 hover:bg-white/10
            "
            aria-label={user ? 'حسابي' : 'الحساب'}
          >
            <UserRound className="h-5 w-5 text-yellow-400" />
          </button>

          {!user ? (
            <button
              type="button"
              onClick={() => navigate('login')}
              className="
                inline-flex h-11 items-center gap-2.5
                rounded-2xl border border-yellow-400/30
                bg-gradient-to-r from-yellow-500/20 to-amber-500/10
                px-6 font-bold text-yellow-300
                shadow-[0_4px_20px_rgba(250,204,21,0.1)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:border-yellow-400 hover:bg-yellow-400/20 hover:text-white
              "
            >
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </button>
          ) : (
            <button
              type="button"
              onClick={openAccount}
              className="
                inline-flex h-11 max-w-[200px] items-center gap-2.5
                rounded-2xl border border-yellow-400/40
                bg-gradient-to-r from-yellow-500/25 to-amber-500/15
                px-5 font-bold text-yellow-300
                shadow-[0_4px_20px_rgba(250,204,21,0.15)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:border-yellow-400 hover:bg-yellow-400/30 hover:text-white
              "
            >
              <UserRound className="h-4 w-4 shrink-0 text-yellow-400" />
              <span className="truncate">
                {isAdmin
                  ? 'لوحة الإدارة'
                  : user?.name || user?.email?.split('@')[0] || 'حسابي'}
              </span>
            </button>
          )}
        </div>

        {/* روابط التنقل في المنتصف */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => navigate(item.page)}
              className="
                rounded-xl px-5 py-2.5 text-sm font-bold text-white/80
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-white/10 hover:text-yellow-400
              "
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* اللوجو (يمين) */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex shrink-0 items-center transition-transform duration-300 hover:scale-105"
          aria-label="الصفحة الرئيسية"
        >
          <img
            src="/almaydan-logo.png?v=7"
            alt="الميدان يا حميدان"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </button>

        {/* زر الجوال */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="
            flex h-11 w-11 items-center justify-center
            rounded-2xl border border-white/15
            bg-white/5
            transition-all duration-300
            hover:border-yellow-400/50 hover:bg-white/10
            lg:hidden
          "
          aria-label="فتح القائمة"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-yellow-400" />
          ) : (
            <Menu className="h-6 w-6 text-yellow-400" />
          )}
        </button>
      </div>

      {/* قائمة الجوال */}
      {mobileMenuOpen && (
        <div
          className="
            mx-auto mt-4 max-w-[1250px]
            rounded-[24px] border border-white/15
            bg-[#180b32]/95 p-5
            shadow-[0_20px_50px_rgba(0,0,0,0.6)]
            backdrop-blur-2xl lg:hidden
          "
        >
          <nav className="grid gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="
                  rounded-2xl border border-white/10
                  bg-white/5 px-5 py-3.5 text-right font-bold text-white/90
                  transition hover:border-yellow-400/40 hover:bg-white/10 hover:text-yellow-400
                "
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* اختيار العملة في الجوال */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2 text-sm font-bold text-white/55">
              العملة
            </p>

            <select
              value={currency.code}
              onChange={(event) =>
                setCurrencyCode(
                  event.target.value as CurrencyCode,
                )
              }
              className="h-14 w-full rounded-2xl border-2 border-[#5964BD] bg-[#272C60] px-4 font-black text-white outline-none"
            >
              {currencies.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                  className="bg-[#272C60]"
                >
                  {item.flag} {item.code} — {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={openAccount}
              className="
                inline-flex items-center justify-center gap-2
                rounded-2xl border border-white/15
                bg-white/5 px-4 py-3.5 font-bold text-white
                transition hover:border-yellow-400/40 hover:bg-white/10
              "
            >
              <UserRound className="h-5 w-5 text-yellow-400" />
              {user
                ? isAdmin
                  ? 'الإدارة'
                  : user.name || user.email.split('@')[0]
                : 'الحساب'}
            </button>

            {!user ? (
              <button
                type="button"
                onClick={() => navigate('login')}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl border border-yellow-400/30
                  bg-yellow-400/20 px-4 py-3.5 font-bold text-yellow-300
                  transition hover:border-yellow-400 hover:bg-yellow-400/30 hover:text-white
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
                  rounded-2xl border border-yellow-400/30
                  bg-yellow-400/20 px-4 py-3.5 font-bold text-yellow-300
                  transition hover:border-yellow-400 hover:bg-yellow-400/30 hover:text-white
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
