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
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setCurrencyMenuOpen(false);
      }
    };

    document.addEventListener('keydown', closeWithEscape);

    return () => {
      document.removeEventListener(
        'keydown',
        closeWithEscape,
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
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 text-white sm:px-5 sm:pt-4">
        <div
          className="
            relative mx-auto flex min-h-[64px] max-w-[1280px]
            items-center justify-between gap-2
            rounded-[22px] border border-[#7868D9]/40
            bg-[linear-gradient(135deg,rgba(16,7,37,0.97),rgba(28,11,61,0.96))]
            px-3 py-2.5
            shadow-[0_7px_0_rgba(43,31,105,0.72),0_18px_45px_rgba(4,0,18,0.38)]
            sm:min-h-[72px] sm:rounded-[26px] sm:px-5
          "
        >
          {/* الجوال: القائمة على اليسار */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-2xl border border-[#7569CB]/50
              bg-gradient-to-b from-[#302A68] to-[#211A4D]
              text-[#FACC15]
              shadow-[0_4px_0_#151132,inset_0_1px_0_rgba(255,255,255,0.12)]
              transition active:translate-y-0.5
              lg:hidden
            "
            aria-label={
              mobileMenuOpen
                ? 'إغلاق القائمة'
                : 'فتح القائمة'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* الكمبيوتر: الروابط فقط بدون لوجو */}
          <nav
            dir="rtl"
            className="
              hidden items-center gap-1.5 rounded-2xl
              border border-white/[0.07]
              bg-black/10 p-1.5
              lg:flex
            "
          >
            {navigationItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => navigate(item.page)}
                className="
                  rounded-xl px-5 py-2.5
                  text-sm font-black text-white/80
                  transition
                  hover:bg-white/10 hover:text-[#FACC15]
                "
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* العملة: يظهر العلم فقط من الخارج */}
          <div
            ref={currencyMenuRef}
            className="relative ml-auto lg:ml-0"
          >
            <button
              type="button"
              onClick={() =>
                setCurrencyMenuOpen((current) => !current)
              }
              className="
                flex h-11 w-11 items-center justify-center
                rounded-2xl border border-[#7569CB]/50
                bg-gradient-to-b from-[#302A68] to-[#211A4D]
                shadow-[0_4px_0_#151132,inset_0_1px_0_rgba(255,255,255,0.12)]
                transition
                hover:border-[#FACC15]/70
                active:translate-y-0.5
              "
              aria-label={`العملة الحالية: ${currency.name}`}
              aria-expanded={currencyMenuOpen}
            >
              <img
                src={currency.flagUrl}
                alt={currency.name}
                width={28}
                height={28}
                className="
                  h-7 w-7 rounded-full
                  border border-white/60 bg-white
                  object-contain p-[1px]
                "
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
                  className="
                    absolute left-1/2 top-[calc(100%+14px)]
                    z-[120] w-[300px] -translate-x-1/2
                    overflow-hidden rounded-[24px]
                    border border-[#8D7DF0]/45
                    bg-[#F5F3FC] p-3
                    text-[#25183F]
                    shadow-[0_24px_60px_rgba(5,0,20,0.42)]
                    sm:w-[330px]
                    lg:left-0 lg:translate-x-0
                  "
                >
                  <div className="mb-3 px-1">
                    <p className="text-sm font-black text-[#28104B]">
                      اختر العملة
                    </p>

                    <p className="mt-0.5 text-[11px] font-bold text-[#28104B]/50">
                      تتغير أسعار الباقات تلقائيًا
                    </p>
                  </div>

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
                          className={`flex min-h-[58px] items-center gap-2.5 rounded-2xl border px-3 py-2 text-right transition ${
                            isSelected
                              ? 'border-[#5B3FC4] bg-[#E8E1FF]'
                              : 'border-[#D2CDE3] bg-white hover:border-[#D7A900]'
                          }`}
                        >
                          <img
                            src={item.flagUrl}
                            alt={item.name}
                            width={30}
                            height={30}
                            className="
                              h-[30px] w-[30px] shrink-0
                              rounded-full border border-[#D7D4E2]
                              bg-white object-contain p-[1px]
                            "
                          />

                          <span className="min-w-0">
                            <span className="block text-sm font-black">
                              {item.code}
                            </span>

                            <span className="block truncate text-[10px] font-bold text-[#28104B]/55">
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

          {/* الحساب أو تسجيل الدخول على اليمين */}
          <button
            type="button"
            onClick={openAccount}
            className="
              inline-flex h-11 max-w-[155px] items-center
              justify-center gap-2 rounded-2xl
              border border-[#FACC15]/35
              bg-gradient-to-b from-[#F9D441] to-[#E8AC00]
              px-3.5 font-black text-[#28104B]
              shadow-[0_4px_0_#8A6200,inset_0_1px_0_rgba(255,255,255,0.45)]
              transition
              hover:-translate-y-0.5
              active:translate-y-0.5
              sm:max-w-[190px] sm:px-5
            "
          >
            {user ? (
              <UserRound className="h-4 w-4 shrink-0" />
            ) : (
              <LogIn className="h-4 w-4 shrink-0" />
            )}

            <span className="truncate text-sm">
              {accountLabel}
            </span>
          </button>
        </div>
      </header>

      {/* غطاء خلف القائمة الجانبية */}
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
              className="
                fixed inset-0 z-[55]
                bg-black/55
                lg:hidden
              "
            />

            {/* القائمة الجانبية: روابط فقط */}
            <motion.aside
              dir="rtl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'tween',
                duration: 0.22,
              }}
              className="
                fixed bottom-0 left-0 top-0 z-[60]
                w-[82%] max-w-[330px]
                border-r border-[#7868D9]/35
                bg-[linear-gradient(160deg,#180934,#250D50)]
                px-4 pb-6 pt-5
                shadow-[18px_0_60px_rgba(0,0,0,0.45)]
                lg:hidden
              "
            >
              <div className="mb-7 flex items-center justify-between">
                <h2 className="text-lg font-black text-white">
                  القائمة
                </h2>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl border border-white/10
                    bg-white/[0.06] text-[#FACC15]
                  "
                  aria-label="إغلاق القائمة"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="grid gap-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => navigate(item.page)}
                    className="
                      rounded-2xl border border-white/10
                      bg-white/[0.055]
                      px-5 py-4 text-right
                      font-black text-white/90
                      transition
                      hover:border-[#FACC15]/45
                      hover:bg-white/10
                      hover:text-[#FACC15]
                    "
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
