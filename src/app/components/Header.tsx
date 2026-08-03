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
  const { user, isAdmin } = useAuth();
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
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

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

  const chooseCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
    setCurrencyMenuOpen(false);
  };

  const accountLabel = !user
    ? 'تسجيل الدخول'
    : isAdmin
      ? 'لوحة الإدارة'
      : user.name ||
        user.email?.split('@')[0] ||
        'حسابي';

  return (
    <>
      {/* =========================
          هيدر الكمبيوتر: بدون تغيير
      ========================== */}
      <header className="fixed inset-x-0 top-0 z-50 hidden bg-transparent px-5 pt-4 text-white lg:block">
        <div
          dir="ltr"
          className="relative mx-auto grid min-h-[78px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-visible rounded-[28px] border border-[#7868D9]/45 bg-[linear-gradient(135deg,rgba(18,8,42,0.97),rgba(31,12,67,0.94))] px-5 py-3 shadow-[0_10px_0_rgba(44,32,111,0.75),0_28px_70px_rgba(5,0,20,0.52),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl lg:px-7"
        >
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#B9A8FF]/70 to-transparent" />

          {/* اللوجو */}
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

          {/* روابط الكمبيوتر */}
          <nav
            dir="rtl"
            className="hidden items-center gap-2 rounded-2xl border border-white/[0.07] bg-black/10 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex"
          >
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

          {/* الحساب والعملات في الكمبيوتر */}
          <div
            dir="rtl"
            className="hidden items-center justify-self-end gap-2.5 lg:flex"
          >
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
                  {isAdmin
                    ? 'لوحة الإدارة'
                    : user?.name ||
                      user?.email?.split('@')[0] ||
                      'حسابي'}
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
                className="flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-2xl border border-[#7D70D9]/55 bg-gradient-to-b from-[#39337A] to-[#27215C] px-3.5 font-black text-white shadow-[0_4px_0_#17133A,inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-[#FACC15]/70"
                aria-expanded={currencyMenuOpen}
                aria-label="اختيار العملة"
              >
                <img
                  src={currency.flagUrl}
                  alt={currency.name}
                  className="h-6 w-6 rounded-full border border-white/60 bg-white object-contain p-[1px]"
                />

                <span className="text-sm tracking-wide">
                  {currency.code}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-[#FACC15] transition ${
                    currencyMenuOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

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
                  className="absolute left-0 top-[calc(100%+16px)] z-[120] w-[330px] overflow-hidden rounded-[28px] border border-[#8D7DF0]/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(239,238,250,0.98))] p-4 text-[#25183F] shadow-[0_28px_70px_rgba(5,0,20,0.48),0_8px_0_rgba(74,59,150,0.25)] backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div>
                      <p className="text-sm font-black text-[#28104B]">
                        اختر العملة
                      </p>

                      <p className="mt-0.5 text-[11px] font-bold text-[#28104B]/45">
                        ستتغير أسعار الباقات تلقائيًا
                      </p>
                    </div>

                    <span className="rounded-full bg-[#28104B]/8 px-3 py-1 text-[11px] font-black text-[#28104B]/60">
                      {currencies.length} عملات
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {currencies.map((item) => {
                      const isSelected =
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
                          className={`group flex min-h-[58px] items-center gap-3 rounded-2xl border px-3 py-2.5 text-right transition ${
                            isSelected
                              ? 'border-[#5B3FC4] bg-gradient-to-b from-[#EEE9FF] to-[#E1D8FF] shadow-[0_4px_0_#B7A8EF]'
                              : 'border-[#CBC7DD] bg-white/85 hover:-translate-y-0.5 hover:border-[#D7A900] hover:bg-[#FFF9DD]'
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? 'border-[#5B3FC4]/35 bg-white'
                                : 'border-[#D7D4E2] bg-white'
                            }`}
                          >
                            <img
                              src={item.flagUrl}
                              alt={item.name}
                              className="h-7 w-7 rounded-full object-contain p-[1px]"
                            />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-black">
                              {item.code}
                            </span>

                            <span className="block truncate text-[11px] font-bold text-[#28104B]/55">
                              {item.name}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          هيدر الجوال فقط
      ========================== */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 text-white lg:hidden">
        <div className="mx-auto flex min-h-[62px] items-center rounded-[21px] border border-[#7868D9]/40 bg-[linear-gradient(135deg,rgba(16,7,37,0.97),rgba(28,11,61,0.96))] px-3 py-2.5 shadow-[0_6px_0_rgba(43,31,105,0.72),0_16px_38px_rgba(4,0,18,0.34)]">

          {/* يسار: الثلاث خطوط + العملة */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7569CB]/50 bg-gradient-to-b from-[#302A68] to-[#211A4D] text-[#FACC15] shadow-[0_3px_0_#151132]"
              aria-label={
                mobileMenuOpen
                  ? 'إغلاق القائمة'
                  : 'فتح القائمة'
              }
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyMenuOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7569CB]/50 bg-gradient-to-b from-[#302A68] to-[#211A4D] shadow-[0_3px_0_#151132]"
                aria-label={`العملة الحالية: ${currency.name}`}
              >
                <img
                  src={currency.flagUrl}
                  alt={currency.name}
                  className="h-6 w-6 rounded-full border border-white/60 bg-white object-contain p-[1px]"
                />
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
                    transition={{ duration: 0.16 }}
                    dir="rtl"
                    className="absolute left-1/2 top-[calc(100%+12px)] z-[120] w-[292px] -translate-x-1/2 rounded-[22px] border border-[#8D7DF0]/45 bg-[#F5F3FC] p-3 text-[#25183F] shadow-[0_24px_55px_rgba(5,0,20,0.42)]"
                  >
                    <p className="mb-3 text-sm font-black text-[#28104B]">
                      اختر العملة
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {currencies.map((item) => {
                        const isSelected =
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
                            className={`flex min-h-[56px] items-center gap-2 rounded-2xl border px-2.5 py-2 text-right ${
                              isSelected
                                ? 'border-[#5B3FC4] bg-[#E8E1FF]'
                                : 'border-[#D2CDE3] bg-white'
                            }`}
                          >
                            <img
                              src={item.flagUrl}
                              alt={item.name}
                              width={28}
                              height={28}
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

          </div>

          {/* يمين: تسجيل الدخول */}
          <button
            type="button"
            onClick={openAccount}
            className="ml-auto inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#FACC15]/35 bg-gradient-to-b from-[#F9D441] to-[#E8AC00] px-4 font-black text-[#28104B] shadow-[0_3px_0_#8A6200]"
          >
            {user ? (
              <UserRound className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}

            <span className="text-xs">
              {accountLabel}
            </span>
          </button>

        </div>
      </header>

      {/* القائمة الجانبية للجوال تفتح من اليمين */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="إغلاق القائمة"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[55] bg-black/55 lg:hidden"
            />

            <motion.aside
              dir="rtl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.22,
              }}
              className="fixed bottom-0 right-0 top-0 z-[60] w-[82%] max-w-[330px] border-l border-[#7868D9]/35 bg-[linear-gradient(160deg,#180934,#250D50)] px-4 pb-6 pt-5 shadow-[-18px_0_60px_rgba(0,0,0,0.45)] lg:hidden"
            >
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-lg font-black text-white">
                  القائمة
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#FACC15]"
                  aria-label="إغلاق القائمة"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* روابط فقط، بدون الحساب والعملات */}
              <nav className="grid gap-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => navigate(item.page)}
                    className="rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 text-right font-black text-white/90 transition hover:border-[#FACC15]/45 hover:bg-white/10 hover:text-[#FACC15]"
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
