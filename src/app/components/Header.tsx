import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion } from 'motion/react';
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
  { label: 'الرئيسية', page: 'home' },
  { label: 'ابدأ اللعب', page: 'play' },
  { label: 'الباقات', page: 'pricing' },
  { label: 'طريقة اللعب', page: 'how' },
];

export default function Header({ onNavigate }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const { currency, setCurrencyCode } = useCurrency();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeCurrencyMenu = (event: MouseEvent) => {
      if (
        currencyMenuRef.current &&
        !currencyMenuRef.current.contains(event.target as Node)
      ) {
        setCurrencyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeCurrencyMenu);
    return () => document.removeEventListener('mousedown', closeCurrencyMenu);
  }, []);

  const navigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setCurrencyMenuOpen(false);
  };

  const openAccount = () => {
    if (!user) return navigate('login');
    if (isAdmin) return navigate('admin');
    navigate('account');
  };

  const chooseCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    setCurrencyMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent px-3 pt-4 text-white sm:px-5">
      <div
        dir="ltr"
        className="relative mx-auto grid min-h-[78px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-visible rounded-[28px] border border-[#7868D9]/45 bg-[linear-gradient(135deg,rgba(18,8,42,0.97),rgba(31,12,67,0.94))] px-5 py-3 shadow-[0_10px_0_rgba(44,32,111,0.75),0_28px_70px_rgba(5,0,20,0.52),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl lg:px-7"
      >
        <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#B9A8FF]/70 to-transparent" />

        <button
          type="button"
          onClick={() => navigate('home')}
          className="group justify-self-start rounded-2xl p-1.5 transition duration-300 hover:-translate-y-0.5"
          aria-label="الصفحة الرئيسية"
        >
          <div className="relative flex h-14 min-w-[118px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="absolute inset-2 rounded-xl bg-[#7C3AED]/25 blur-xl transition group-hover:bg-[#FACC15]/15" />
            <img
              src="/almaydan-logo.png?v=12"
              alt="الميدان يا حميدان"
              className="relative z-10 h-12 w-auto object-contain drop-shadow-[0_7px_12px_rgba(0,0,0,0.4)] transition duration-300 group-hover:scale-105"
            />
          </div>
        </button>

        <nav dir="rtl" className="hidden items-center gap-2 rounded-2xl border border-white/[0.07] bg-black/10 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              type="button"
              onClick={() => navigate(item.page)}
              className="rounded-xl px-5 py-2.5 text-sm font-black text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-[#FACC15] hover:shadow-[0_8px_22px_rgba(0,0,0,0.24)]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div dir="rtl" className="hidden items-center justify-self-end gap-2.5 lg:flex">
          {!user ? (
            <button
              type="button"
              onClick={() => navigate('login')}
              className="inline-flex h-11 items-center gap-2.5 rounded-2xl border border-[#FACC15]/35 bg-gradient-to-b from-[#F9D441] to-[#E8AC00] px-5 font-black text-[#28104B] shadow-[0_5px_0_#8A6200,inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:-translate-y-1"
            >
              <LogIn className="h-4 w-4" />
              تسجيل الدخول
            </button>
          ) : (
            <button
              type="button"
              onClick={openAccount}
              className="inline-flex h-11 max-w-[190px] items-center gap-2.5 rounded-2xl border border-[#FACC15]/40 bg-gradient-to-b from-[#F9D441] to-[#E8AC00] px-5 font-black text-[#28104B] shadow-[0_5px_0_#8A6200,inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:-translate-y-1"
            >
              <UserRound className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {isAdmin ? 'لوحة الإدارة' : user?.name || user?.email?.split('@')[0] || 'حسابي'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={openAccount}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7D70D9]/45 bg-gradient-to-b from-[#302A68] to-[#211A4D] text-[#FACC15] shadow-[0_4px_0_#151132,inset_0_1px_0_rgba(255,255,255,0.14)] transition hover:-translate-y-1 hover:border-[#FACC15]/70"
            aria-label={user ? 'حسابي' : 'الحساب'}
          >
            <UserRound className="h-5 w-5" />
          </button>

          <div ref={currencyMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setCurrencyMenuOpen((current) => !current)}
              className="flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-2xl border border-[#7D70D9]/55 bg-gradient-to-b from-[#39337A] to-[#27215C] px-3.5 font-black text-white shadow-[0_4px_0_#17133A,inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-[#FACC15]/70"
              aria-expanded={currencyMenuOpen}
              aria-label="اختيار العملة"
            >
              <img
                src={currency.flagUrl}
                alt={currency.name}
                className="h-6 w-6 rounded-full border border-white/60 bg-white object-contain p-[1px]"
              />
              <span className="text-sm tracking-wide">{currency.code}</span>
              <ChevronDown className={`h-4 w-4 text-[#FACC15] transition ${currencyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute left-0 top-[calc(100%+16px)] z-[120] w-[330px] overflow-hidden rounded-[28px] border border-[#8D7DF0]/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(239,238,250,0.98))] p-4 text-[#25183F] shadow-[0_28px_70px_rgba(5,0,20,0.48),0_8px_0_rgba(74,59,150,0.25)] backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p className="text-sm font-black text-[#28104B]">اختر العملة</p>
                    <p className="mt-0.5 text-[11px] font-bold text-[#28104B]/45">ستتغير أسعار الباقات تلقائيًا</p>
                  </div>
                  <span className="rounded-full bg-[#28104B]/8 px-3 py-1 text-[11px] font-black text-[#28104B]/60">{currencies.length} عملات</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {currencies.map((item) => {
                    const isSelected = currency.code === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => chooseCurrency(item.code as CurrencyCode)}
                        className={`group flex min-h-[58px] items-center gap-3 rounded-2xl border px-3 py-2.5 text-right transition ${
                          isSelected
                            ? 'border-[#5B3FC4] bg-gradient-to-b from-[#EEE9FF] to-[#E1D8FF] shadow-[0_4px_0_#B7A8EF]'
                            : 'border-[#CBC7DD] bg-white/85 hover:-translate-y-0.5 hover:border-[#D7A900] hover:bg-[#FFF9DD]'
                        }`}
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#5B3FC4]/35 bg-white' : 'border-[#D7D4E2] bg-white'}`}>
                          <img src={item.flagUrl} alt={item.name} className="h-7 w-7 rounded-full object-contain p-[1px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-black">{item.code}</span>
                          <span className="block truncate text-[11px] font-bold text-[#28104B]/55">{item.name}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center justify-self-end rounded-2xl border border-[#7D70D9]/45 bg-gradient-to-b from-[#302A68] to-[#211A4D] text-[#FACC15] shadow-[0_4px_0_#151132] lg:hidden"
          aria-label="فتح القائمة"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 max-w-[1280px] rounded-[28px] border border-[#7868D9]/40 bg-[linear-gradient(145deg,rgba(22,9,49,0.98),rgba(35,14,74,0.98))] p-4 shadow-[0_25px_60px_rgba(5,0,20,0.6),0_7px_0_rgba(44,32,111,0.65)] backdrop-blur-2xl lg:hidden"
        >
          <nav className="grid gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3.5 text-right font-black text-white/90 transition hover:border-[#FACC15]/50 hover:bg-white/10 hover:text-[#FACC15]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-white">اختر العملة</p>
              <span className="text-xs font-bold text-white/45">{currency.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {currencies.map((item) => {
                const isSelected = currency.code === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => chooseCurrency(item.code as CurrencyCode)}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-right font-black transition ${
                      isSelected
                        ? 'border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15]'
                        : 'border-white/10 bg-white/[0.05] text-white'
                    }`}
                  >
                    <img src={item.flagUrl} alt={item.name} className="h-7 w-7 rounded-full border border-white/40 bg-white object-contain p-[1px]" />
                    <span>
                      <span className="block text-sm">{item.code}</span>
                      <span className="block text-[10px] text-white/45">{item.name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={openAccount}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#7D70D9]/45 bg-white/[0.06] px-4 py-3.5 font-black text-white"
            >
              <UserRound className="h-5 w-5 text-[#FACC15]" />
              {user ? (isAdmin ? 'الإدارة' : user.name || user.email.split('@')[0]) : 'الحساب'}
            </button>

            {!user ? (
              <button
                type="button"
                onClick={() => navigate('login')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#F9D441] to-[#E8AC00] px-4 py-3.5 font-black text-[#28104B] shadow-[0_4px_0_#8A6200]"
              >
                <LogIn className="h-5 w-5" />
                تسجيل الدخول
              </button>
            ) : (
              <button
                type="button"
                onClick={openAccount}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#F9D441] to-[#E8AC00] px-4 py-3.5 font-black text-[#28104B] shadow-[0_4px_0_#8A6200]"
              >
                <UserRound className="h-5 w-5" />
                فتح الحساب
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
