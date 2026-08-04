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
      'click',
      closeCurrencyMenu,
    );

    return () => {
      document.removeEventListener(
        'click',
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
        ? 'الباقة الذهبية'
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
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border font-black transition hover:-translate-y-0.5 ${
        mobile
          ? 'h-10 max-w-[92px] px-2 text-[9px]'
          : 'h-14 min-w-[150px] px-4 text-sm'
      } ${
        isGold
          ? 'border-[#FFD84D]/80 bg-gradient-to-b from-[#78590A] via-[#523B04] to-[#2B1B00] text-[#FFF1A8] shadow-[0_5px_0_#5E4303,0_10px_25px_rgba(255,216,77,0.3)]'
          : 'border-[#7D70D9]/45 bg-gradient-to-b from-[#302A68] to-[#211A4D] text-white shadow-[0_4px_0_#151132]'
      }`}
    >
      {isGold ? (
        <Crown
          className={
            mobile ? 'h-4 w-4 text-[#FFD84D]' : 'h-5 w-5 text-[#FFD84D]'
          }
        />
      ) : (
        <Gamepad2
          className={
            mobile
              ? 'h-4 w-4 text-[#FACC15]'
              : 'h-5 w-5 text-[#FACC15]'
          }
        />
      )}

      <span className="truncate">{packageText}</span>
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
        onClick={(e) => {
          e.stopPropagation();
          setCurrencyMenuOpen((current) => !current);
        }}
        className={
          mobile
            ? 'flex h-10 w-10 items-center justify-center rounded-xl border border-[#7569CB]/50 bg-gradient-to-b from-[#302A68] to-[#211A4D] shadow-[0_3px_0_#151132]'
            : 'flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-2xl border border-[#7D70D9]/55 bg-gradient-to-b from-[#39337A] to-[#27215C] px-3.5 font-black text-white shadow-[0_4px_0_#17133A] transition hover:-translate-y-1'
        }
      >
        <img
          src={currency.flagUrl}
          alt={currency.name}
          className="h-6 w-6 rounded-full border border-white/60 bg-white object-contain p-[1px]"
        />

        {!mobile && (
          <>
            <span className="text-sm">
              {currency.code}
            </span>
            <ChevronDown className="h-4 w-4 text-[#FACC15]" />
          </>
        )}
      </button>

      <AnimatePresence>
        {currencyMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-[calc(100%+12px)] z-[120] rounded-[24px] border border-[#8D7DF0]/45 bg-[#F5F3FC] p-3 text-[#25183F] shadow-[0_24px_55px_rgba(5,0,20,0.42)] ${
              mobile
                ? 'left-1/2 w-[292px] -translate-x-1/2'
                : 'left-0 w-[330px]'
            }`}
          >
            <p className="mb-3 text-sm font-black text-[#28104B]">
              اختر العملة
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
                    className={`flex min-h-[56px] items-center gap-2 rounded-2xl border px-2.5 py-2 text-right transition hover:scale-[1.02] ${
                      selected
                        ? 'border-[#5B3FC4] bg-[#E8E1FF]'
                        : 'border-[#D2CDE3] bg-white'
                    }`}
                  >
                    <img
                      src={item.flagUrl}
                      alt={item.name}
                      className="h-7 w-7 shrink-0 rounded-full border border-[#D7D4E2] bg-white object-contain p-[1px]"
                    />

                    <span className="min-w-0">
                      <span className="block text-xs font-black">
                        {item.code}
                      </span>
                      <span className="block truncate text-[9px] font-bold text-[#28104B]/55">
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
      <header className="fixed inset-x-0 top-0 z-50 hidden bg-transparent px-5 pt-4 text-white lg:block">
        <div
          dir="ltr"
          className="relative mx-auto grid min-h-[78px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-visible rounded-[28px] border border-[#8B7AE0]/50 bg-[linear-gradient(135deg,rgba(18,8,42,0.98),rgba(33,12,71,0.96))] px-5 py-3 shadow-[0_12px_35px_rgba(10,4,25,0.65),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
        >
          <div className="justify-self-start">
            <PackageBadge />
          </div>

          <nav
            dir="rtl"
            className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/15 p-1.5 shadow-inner"
          >
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="rounded-xl px-5 py-2.5 text-sm font-black text-white/85 transition-all hover:bg-white/10 hover:text-[#FFD84D]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div
            dir="rtl"
            className="flex items-center justify-self-end gap-2.5"
          >
            <button
              type="button"
              onClick={openAccount}
              className="inline-flex h-11 max-w-[190px] items-center gap-2.5 rounded-2xl border border-[#FFD84D]/45 bg-gradient-to-b from-[#FFDE69] to-[#E6A900] px-5 font-black text-[#2B1B00] shadow-[0_5px_0_#9E7500,0_10px_20px_rgba(255,222,105,0.25)] transition hover:-translate-y-0.5"
            >
              {user ? (
                <UserRound className="h-4 w-4 shrink-0 text-[#2B1B00]" />
              ) : (
                <LogIn className="h-4 w-4 shrink-0 text-[#2B1B00]" />
              )}
              <span className="truncate">
                {accountLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={openAccount}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7D70D9]/45 bg-gradient-to-b from-[#302A68] to-[#211A4D] text-[#FFD84D] shadow-[0_4px_0_#151132]"
            >
              <UserRound className="h-5 w-5" />
            </button>

            <CurrencyMenu />
          </div>
        </div>
      </header>

      {/* هيدر الجوال */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 text-white lg:hidden">
        <div className="mx-auto flex min-h-[62px] items-center justify-between gap-1.5 rounded-[21px] border border-[#8B7AE0]/50 bg-[linear-gradient(135deg,rgba(16,7,37,0.98),rgba(30,11,66,0.96))] px-2.5 py-2.5 shadow-[0_8px_25px_rgba(10,4,25,0.6)] backdrop-blur-xl">
          <button
            type="button"
            onClick={openAccount}
            className="inline-flex h-10 max-w-[105px] items-center justify-center gap-1.5 rounded-xl border border-[#FFD84D]/40 bg-gradient-to-b from-[#FFDE69] to-[#E6A900] px-2.5 font-black text-[#2B1B00] shadow-[0_3px_0_#9E7500]"
          >
            {user ? (
              <UserRound className="h-3.5 w-3.5 shrink-0 text-[#2B1B00]" />
            ) : (
              <LogIn className="h-3.5 w-3.5 shrink-0 text-[#2B1B00]" />
            )}
            <span className="truncate text-[10px]">
              {accountLabel}
            </span>
          </button>

          <PackageBadge mobile />

          <div className="flex items-center gap-1.5">
            <CurrencyMenu mobile />

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7569CB]/50 bg-gradient-to-b from-[#302A68] to-[#211A4D] text-[#FFD84D] shadow-[0_3px_0_#151132]"
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
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              dir="rtl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed bottom-0 right-0 top-0 z-[60] w-[82%] max-w-[330px] border-l border-[#8B7AE0]/40 bg-[linear-gradient(160deg,#180934,#280E55)] px-4 pb-6 pt-5 shadow-[-18px_0_60px_rgba(0,0,0,0.5)] lg:hidden"
            >
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-lg font-black text-[#FFD84D]">
                  القائمة
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#FFD84D]"
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
                    className="rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 text-right font-black text-white/90 transition hover:border-[#FFD84D]/40 hover:text-[#FFD84D]"
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
