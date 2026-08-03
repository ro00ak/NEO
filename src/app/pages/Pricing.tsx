import { motion } from 'motion/react';
import {
  Check,
  Crown,
  Gamepad2,
  Sparkles,
  Star,
} from 'lucide-react';

interface PricingProps {
  onNavigate: (page: string) => void;
}

const packages = [
  {
    id: 'one-game',
    title: 'لعبة واحدة',
    games: '1 لعبة',
    price: '0.900',
    currency: 'ر.ع',
    saudiPrice: 'حوالي 9 ر.س',
    description: 'مناسبة لتجربة اللعبة لأول مرة.',
    icon: Gamepad2,
    featured: false,
    bestValue: false,
  },
  {
    id: 'two-games',
    title: 'باقة لعبتين',
    games: '2 لعبتين',
    price: '1.600',
    currency: 'ر.ع',
    saudiPrice: 'حوالي 16 ر.س',
    description: 'خيار مناسب للعبتين منفصلتين.',
    icon: Gamepad2,
    featured: false,
    bestValue: false,
  },
  {
    id: 'five-games',
    title: 'باقة 5 ألعاب',
    games: '5 ألعاب',
    price: '3.000',
    currency: 'ر.ع',
    saudiPrice: 'حوالي 30 ر.س',
    description: 'باقة مناسبة للمجموعات والجلسات.',
    icon: Star,
    featured: true,
    bestValue: false,
  },
  {
    id: 'eight-games',
    title: 'باقة 8 ألعاب',
    games: '8 ألعاب',
    price: '5.000',
    currency: 'ر.ع',
    saudiPrice: 'حوالي 50 ر.س',
    description: 'عدد أكبر من الألعاب بسعر أفضل.',
    icon: Sparkles,
    featured: false,
    bestValue: true,
  },
  {
    id: 'full-game',
    title: 'اللعبة كاملة',
    games: 'لعب غير محدود',
    price: '8.000',
    currency: 'ر.ع',
    saudiPrice: 'حوالي 80 ر.س',
    description: 'اشترِ اللعبة كاملة والعب بدون حدود.',
    icon: Crown,
    featured: false,
    bestValue: false,
  },
];

export default function Pricing({
  onNavigate,
}: PricingProps) {
  const handlePurchase = (packageId: string) => {
    sessionStorage.setItem(
      'selectedPackage',
      packageId,
    );

    onNavigate('account');
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052F] px-5 pb-24 pt-36 text-white"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-[#FACC15]" />
            اختر الباقة المناسبة
          </span>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            باقات الميدان
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
            اختر عدد الألعاب المناسب لك، أو اشترِ اللعبة
            كاملة واستمتع باللعب بدون حدود.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                }}
                className={`relative overflow-hidden rounded-[32px] border p-6 shadow-[0_25px_70px_rgba(0,0,0,0.2)] ${
                  item.featured
                    ? 'border-[#FACC15] bg-[#FACC15]/10'
                    : item.bestValue
                    ? 'border-purple-400/60 bg-purple-500/10'
                    : 'border-white/10 bg-white/[0.07]'
                }`}
              >
                {item.featured && (
                  <span className="absolute left-5 top-5 rounded-full bg-[#FACC15] px-4 py-1 text-xs font-black text-[#321064]">
                    الأكثر طلبًا
                  </span>
                )}

                {item.bestValue && (
                  <span className="absolute left-5 top-5 rounded-full bg-purple-500 px-4 py-1 text-xs font-black text-white">
                    أفضل قيمة
                  </span>
                )}

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FACC15]/15 text-[#FACC15]">
                  <Icon className="h-8 w-8" />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-white/50">
                  {item.games}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <strong className="text-5xl font-black text-[#FACC15]">
                    {item.price}
                  </strong>

                  <span className="pb-2 font-bold text-white/65">
                    {item.currency}
                  </span>
                </div>

                <p className="mt-2 text-sm text-white/45">
                  {item.saudiPrice}
                </p>

                <p className="mt-6 min-h-14 leading-7 text-white/65">
                  {item.description}
                </p>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold text-white/75">
                    <Check className="h-5 w-5 text-[#FACC15]" />
                    الوصول إلى جميع الفئات
                  </li>

                  <li className="flex items-center gap-3 text-sm font-bold text-white/75">
                    <Check className="h-5 w-5 text-[#FACC15]" />
                    جميع وسائل المساعدة
                  </li>

                  <li className="flex items-center gap-3 text-sm font-bold text-white/75">
                    <Check className="h-5 w-5 text-[#FACC15]" />
                    حفظ النتائج داخل الحساب
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => handlePurchase(item.id)}
                  className={`mt-8 h-14 w-full rounded-2xl font-black transition hover:-translate-y-1 ${
                    item.featured || item.bestValue
                      ? 'bg-[#FACC15] text-[#321064]'
                      : 'border border-[#FACC15]/30 bg-[#FACC15]/10 text-[#FACC15]'
                  }`}
                >
                  اشتر الآن
                </button>
              </motion.article>
            );
          })}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center">
          <p className="leading-8 text-white/65">
            بعد اختيار الباقة سيتم نقلك إلى حسابك لإكمال
            الدفع. ربط بوابة الدفع سيتم في الخطوة التالية.
          </p>
        </div>
      </div>
    </main>
  );
}
