import {
  CircleHelp,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Swords,
} from 'lucide-react';

const helpers = [
  {
    id: 'two-answers',
    name: 'إجابتان',
    description: 'تضييق خيارات الإجابة وزيادة فرصة الوصول للإجابة الصحيحة.',
    icon: CircleHelp,
  },
  {
    id: 'phone',
    name: 'اتصال بصديق',
    description: 'إيقاف المؤقت مؤقتًا حتى تتمكن من الاتصال بصديق.',
    icon: Phone,
  },
  {
    id: 'replace',
    name: 'تبديل السؤال',
    description: 'استبدال السؤال بسؤال آخر من نفس الفئة ونفس النقاط.',
    icon: RefreshCw,
  },
  {
    id: 'second-chance',
    name: 'فرصة ثانية',
    description: 'محاولة إضافية للإجابة إذا كانت إجابتك الأولى خاطئة.',
    icon: ShieldCheck,
  },
  {
    id: 'steal',
    name: 'سرقة السؤال',
    description: 'انتزاع فرصة الإجابة من الفريق المنافس والفوز بالنقاط.',
    icon: Swords,
  },
];

export default function HelpersShowcase() {
  return (
    <section
      id="helpers-showcase"
      dir="rtl"
      className="bg-[#1D073D] px-3 py-16 text-white sm:px-5 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-bold sm:px-5 sm:text-sm">
            <Sparkles className="h-4 w-4 text-[#FACC15]" />
            قوة إضافية لفريقك
          </span>

          <h2 className="mt-4 text-3xl font-black sm:text-5xl">
            وسائل المساعدة
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-lg">
            اختر وسائل المساعدة المناسبة لفريقك واستخدمها بذكاء أثناء المنافسة.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-[1100px] grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {helpers.map((helper, index) => {
            const Icon = helper.icon;
            const isLast = index === helpers.length - 1;

            return (
              <article
                key={helper.id}
                className={`relative flex min-h-[270px] flex-col rounded-[24px] border border-white/10 bg-white/[0.065] p-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.18)] sm:min-h-[330px] sm:rounded-[28px] sm:p-6 ${
                  isLast
                    ? 'col-span-2 mx-auto w-[calc(50%-0.375rem)] min-w-[calc(50%-0.375rem)] lg:col-span-1 lg:w-auto lg:min-w-0'
                    : ''
                }`}
              >
                <span className="absolute left-3 top-3 text-[10px] font-black text-white/20 sm:left-5 sm:top-5 sm:text-sm">
                  0{index + 1}
                </span>

                <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FACC15]/55 bg-[#FACC15]/10 text-[#FACC15] sm:mt-6 sm:h-22 sm:w-22 sm:border-4">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>

                <h3 className="mt-5 text-lg font-black sm:mt-7 sm:text-2xl">
                  {helper.name}
                </h3>

                <p className="mt-3 flex-1 text-[11px] leading-5 text-white/58 sm:mt-5 sm:text-sm sm:leading-7">
                  {helper.description}
                </p>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/10 px-2 py-2.5 text-[10px] font-bold text-white/70 sm:mt-7 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                  تستخدم مرة واحدة
                </div>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#FACC15]/20 bg-[#FACC15]/8 px-4 py-4 text-center sm:mt-10 sm:rounded-3xl sm:px-6 sm:py-5">
          <p className="text-xs font-bold leading-6 text-white/78 sm:text-base sm:leading-8">
            كل فريق يختار 3 وسائل مساعدة قبل بدء المباراة، ولا يمكن استخدام الوسيلة أكثر من مرة في نفس اللعبة.
          </p>
        </div>
      </div>
    </section>
  );
}
