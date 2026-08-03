import {
  Check,
  Crown,
  Gamepad2,
  Sparkles,
  Star,
} from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

interface PricingProps {
  onNavigate: (page: string) => void;
}

const packages = [
  {
    id: 'one-game',
    title: 'لعبة واحدة',
    games: '1 لعبة',
    price: 0.9,
    description: 'مناسبة لتجربة اللعبة لأول مرة.',
    icon: Gamepad2,
    featured: false,
    bestValue: false,
  },
  {
    id: 'two-games',
    title: 'باقة لعبتين',
    games: '2 لعبتين',
    price: 1.6,
    description: 'خيار مناسب للعبتين منفصلتين.',
    icon: Gamepad2,
    featured: false,
    bestValue: false,
  },
  {
    id: 'five-games',
    title: 'باقة 5 ألعاب',
    games: '5 ألعاب',
    price: 3,
    description: 'باقة مناسبة للمجموعات والجلسات.',
    icon: Star,
    featured: false,
    bestValue: false,
  },
  {
    id: 'eight-games',
    title: 'باقة 8 ألعاب',
    games: '8 ألعاب',
    price: 5,
    description: 'عدد أكبر من الألعاب بسعر أفضل.',
    icon: Sparkles,
    featured: false,
    bestValue: true,
  },
  {
    id: 'full-game',
    title: 'اللعبة كاملة',
    games: 'لعب غير محدود',
    price: 7,
    description: 'اشترِ اللعبة كاملة والعب بدون حدود.',
    icon: Crown,
    featured: true,
    bestValue: false,
  },
];

export default function Pricing({ onNavigate }: PricingProps) {
  const { formatPrice, currency } = useCurrency();

  const handlePurchase = (packageId: string) => {
    sessionStorage.setItem('selectedPackage', packageId);
    onNavigate('account');
  };

  return (
    <section
      dir="rtl"
      className="bg-[linear-gradient(180deg,#241048_0%,#17052F_100%)] px-3 py-16 text-white sm:px-5 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-bold sm:px-5 sm:text-sm">
            <Sparkles className="h-4 w-4 text-[#FACC15]" />
            اختر الباقة المناسبة
          </span>

          <h2 className="mt-4 text-3xl font-black sm:text-5xl">
            باقات الميدان
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-lg">
            اختر عدد الألعاب المناسب لك، أو اشترِ اللعبة كاملة واستمتع باللعب بدون حدود.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-[1120px] grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {packages.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === packages.length - 1;

            return (
              <article
                key={item.id}
                className={`relative flex min-h-[410px] flex-col overflow-hidden rounded-[24px] border p-4 shadow-[0_14px_38px_rgba(0,0,0,0.2)] sm:min-h-[500px] sm:rounded-[30px] sm:p-6 ${
                  item.featured
                    ? 'border-[#FFD84D] bg-gradient-to-b from-[#5B4310]/85 to-[#281702]/90]'
                    : item.bestValue
                    ? 'border-purple-400/55 bg-purple-500/10'
                    : 'border-white/10 bg-white/[0.065]'
                } ${
                  isLast
                    ? 'col-span-2 mx-auto w-[calc(50%-0.375rem)] min-w-[calc(50%-0.375rem)] lg:col-span-1 lg:w-auto lg:min-w-0'
                    : ''
                }`}
              >
                {item.featured && (
                  <span className="absolute left-3 top-3 rounded-full border border-yellow-200 bg-gradient-to-b from-[#FFE787] to-[#D99A00] px-2.5 py-1 text-[9px] font-black text-[#321064] sm:left-5 sm:top-5 sm:px-4 sm:text-xs">
                    الباقة الذهبية
                  </span>
                )}

                {item.bestValue && (
                  <span className="absolute left-3 top-3 rounded-full bg-purple-500 px-2.5 py-1 text-[9px] font-black text-white sm:left-5 sm:top-5 sm:px-4 sm:text-xs">
                    أفضل قيمة
                  </span>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FACC15]/15 text-[#FACC15] sm:h-16 sm:w-16 sm:rounded-2xl">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>

                <h3 className="mt-5 text-lg font-black sm:mt-6 sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-[10px] font-bold text-white/48 sm:mt-2 sm:text-sm">
                  {item.games}
                </p>

                <strong className="mt-5 block break-words text-2xl font-black leading-tight text-[#FACC15] sm:mt-6 sm:text-4xl">
                  {formatPrice(item.price)}
                </strong>

                <p className="mt-2 text-[9px] font-bold leading-4 text-white/42 sm:mt-3 sm:text-sm">
                  السعر بعملة {currency.name}
                </p>

                <p className="mt-5 min-h-12 text-[11px] leading-5 text-white/62 sm:mt-6 sm:min-h-14 sm:text-base sm:leading-7">
                  {item.description}
                </p>

                <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                  {[
                    'الوصول إلى جميع الفئات',
                    'جميع وسائل المساعدة',
                    'حفظ النتائج داخل الحساب',
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-1.5 text-[10px] font-bold leading-5 text-white/72 sm:gap-3 sm:text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FACC15] sm:h-5 sm:w-5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handlePurchase(item.id)}
                  className={`mt-auto h-12 w-full rounded-xl text-sm font-black transition active:scale-[0.98] sm:h-14 sm:rounded-2xl sm:text-base ${
                    item.featured || item.bestValue
                      ? 'bg-[#FACC15] text-[#321064] shadow-[0_4px_0_#8B6500]'
                      : 'border border-[#FACC15]/30 bg-[#FACC15]/10 text-[#FACC15]'
                  }`}
                >
                  اشتر الآن
                </button>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center sm:mt-10 sm:rounded-3xl sm:p-6">
          <p className="text-xs leading-6 text-white/62 sm:text-base sm:leading-8">
            بعد اختيار الباقة سيتم نقلك إلى حسابك لإكمال الدفع.
          </p>
        </div>
      </div>
    </section>
  );
}
