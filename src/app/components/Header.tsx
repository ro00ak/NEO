import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
} from 'motion/react';
import {
  ChevronDown,
  Crown,
  Gamepad2,
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

export default function Header({
  onNavigate,
}: HeaderProps) {
  const {
    user,
    isAdmin,
    entitlement,
    entitlementLoading,
  } = useAuth();
  const { currency, setCurrencyCode } = useCurrency();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] =
    useState(false);

  const currencyMenuRef = useRef<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    const closeCurrencyMenu = (event: MouseEvent) => {
      if (
        currencyMenuRef.current &&
        !currencyMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setCurrencyMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      closeCurrencyMenu,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        closeCurrencyMenu,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const isGold =
    Boolean(user) &&
    (isAdmin || entitlement.unlimited);

  const packageText = !user
    ? 'بدون باقة'
    : entitlementLoading
      ? 'جاري التحميل'
      : isGold
        ? 'الباقة الملكية'
        : entitlement.gamesRemaining === 0
          ? 'الرصيد صفر'
          : entitlement.gamesRemaining === 1
            ? 'متبقي لعبة'
            : `متبقي ${entitlement.gamesRemaining} ألعاب`;

  const accountLabel = !user
    ? 'تسجيل الدخول'
    : isAdmin
      ? 'لوحة الإدارة'
      : user.name ||
        user.email?.split('@')[0] ||
        'حسابي';

  const PackageBadge = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <button
      type="button"
      onClick={() =>
        navigate(user ? 'account' : 'pricing')
      }
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border font-black transition-all duration-300 hover:scale-[1.02] ${
        mobile
          ? 'h-10 max-w-[102px] px-2.5 text-[10px]'
          : 'h-14 min-w-[165px] px-4 text-sm'
      } ${
        isGold
          ? 'border-cyan-400/50 bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          : 'border-purple-500/30 bg-gradient-to-r from-purple-950/90 to-indigo-950/90 text-purple-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]'
      }`}
    >
      {isGold ? (
        <Crown
          className={
            mobile ? 'h-4 w-4 text-cyan-400 animate-pulse' : 'h-5 w-5 text-cyan-400 animate-pulse'
          }
        />
      ) : (
        <Gamepad2
          className={
            mobile
              ? 'h-4 w-4 text-purple-400'
              : 'h-5 w-5 text-purple-400'
          }
        />
      )}

      <span className="truncate tracking-wide">{packageText}</span>
    </button>
  );

  const CurrencyMenu = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <div
      ref={currencyMenuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setCurrencyMenuOpen(
            (current) => !current,
          )
        }
        className={
          mobile
            ? 'flex h-10 items-center gap-1.5 rounded-xl border border-purple-500/30 bg-gradient-to-r from-indigo-950 to-purple-950 px-2.5 shadow-md text-white font-bold'
            : 'flex h-11 min-w-[125px] items-center justify-between gap-2 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-indigo-950/90 to-purple-950/90 px-3.5 font-black text-white shadow-lg transition-all hover:border-cyan-500/50 hover:shadow-cyan-500/10'
        }
      >
        <div className="flex items-center gap-2">
          <img
            src={currency.flagUrl}
            alt={currency.name}
            className="h-6 w-6 rounded-full border border-purple-300/40 bg-white object-contain p-[1px] shadow-sm"
          />
          <span className="text-sm tracking-wider font-extrabold">
            {currency.code}
          </span>
        </div>

        <ChevronDown className={`h-4 w-4 text-cyan-400 transition-transform duration-300 ${currencyMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {currencyMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.95,
            }}
            dir="rtl"
            className={`absolute top-[calc(100%+12px)] z-[120] rounded-[24px] border border-purple-500/30 bg-[#120728]/95 p-3.5 text-white backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${
              mobile
                ? 'left-1/2 w-[292px] -translate-x-1/2'
                : 'left-0 w-[330px]'
            }`}
          >
            <p className="mb-3 text-xs font-black tracking-wider text-purple-300 uppercase px-1">
              اختر العملة المفضلة
            </p>

            <div className="grid grid-cols-2 gap-2">
              {currencies.map((item) => {
                const selected =
                  currency.code === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() =>
                      chooseCurrency(
                        item.code as CurrencyCode,
                      )
                    }
                    className={`flex min-h-[52px] items-center gap-2.5 rounded-2xl border px-3 py-2 text-right transition-all ${
                      selected
                        ? 'border-cyan-400/60 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
                    }`}
                  >
                    <img
                      src={item.flagUrl}
                      alt={item.name}
                      className="h-7 w-7 shrink-0 rounded-full border border-white/20 bg-white object-contain p-[1px]"
                    />

                    <span className="min-w-0">
                      <span className="block text-xs font-black text-white">
                        {item.code}
                      </span>
                      <span className="block truncate text-[10px] font-medium text-purple-300/70">
                        {item.name}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* هيدر الكمبيوتر */}
      <header className="fixed inset-x-0 top-0 z-50 hidden bg-transparent px-6 pt-5 text-white lg:block">
        <div
          dir="ltr"
          className="relative mx-auto grid min-h-[84px] max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-visible rounded-[30px] border border-purple-500/30 bg-[linear-gradient(135deg,rgba(15,5,32,0.95),rgba(26,9,56,0.92))] px-6 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl"
        >
          <div className="justify-self-start">
            <PackageBadge />
          </div>

          <nav
            dir="rtl"
            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/20 p-1.5 shadow-inner"
          >
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="rounded-xl px-5 py-2.5 text-sm font-black text-purple-200/80 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-indigo-600/30 hover:text-white hover:shadow-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div
            dir="rtl"
            className="flex items-center justify-self-end gap-3"
          >
            <button
              type="button"
              onClick={openAccount}
              className="inline-flex h-12 max-w-[200px] items-center gap-2.5 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-5 font-black text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_25px_rgba(6,182,212,0.5)]"
            >
              {user ? (
                <UserRound className="h-4 w-4 shrink-0 text-cyan-300" />
              ) : (
                <LogIn className="h-4 w-4 shrink-0 text-cyan-300" />
              )}
              <span className="truncate tracking-wide">
                {accountLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={openAccount}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950 to-indigo-950 text-cyan-400 shadow-md transition-all hover:border-cyan-400/50"
            >
              <UserRound className="h-5 w-5" />
            </button>

            <CurrencyMenu />
          </div>
        </div>
      </header>

      {/* هيدر الجوال */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 text-white lg:hidden">
        <div className="mx-auto flex min-h-[66px] items-center justify-between gap-2 rounded-[22px] border border-purple-500/30 bg-[linear-gradient(135deg,rgba(15,5,32,0.96),rgba(26,9,56,0.95))] px-3 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <button
            type="button"
            onClick={openAccount}
            className="inline-flex h-10 max-w-[110px] items-center justify-center gap-1.5 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 font-black text-white shadow-md"
          >
            {user ? (
              <UserRound className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
            ) : (
              <LogIn className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
            )}
            <span className="truncate text-[10px] tracking-wide">
              {accountLabel}
            </span>
          </button>

          <PackageBadge mobile />

          <div className="flex items-center gap-2">
            <CurrencyMenu mobile />

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950 to-indigo-950 text-cyan-400 shadow-md"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              dir="rtl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed bottom-0 right-0 top-0 z-[60] w-[85%] max-w-[340px] border-l border-purple-500/30 bg-[linear-gradient(160deg,#0f0520,#1a0938)] px-5 pb-6 pt-6 shadow-[-20px_0_50px_rgba(0,0,0,0.7)] lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-black tracking-wider text-cyan-300">
                  قائمة التصفح
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/60 text-cyan-400 shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="grid gap-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() =>
                      navigate(item.page)
                    }
                    className="rounded-2xl border border-purple-500/20 bg-white/[0.04] px-5 py-4 text-right font-black text-white/90 transition-all active:scale-[0.98] hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-cyan-300"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
