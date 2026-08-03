import {
  Bomb,
  CircleHelp,
  Hand,
  Phone,
  Sparkles,
  Swords,
} from 'lucide-react';

const helpers = [
  {
    id: 'phone',
    name: 'اتصال بصديق',
    timing: 'بعد مشاهدة السؤال',
    description:
      'بعد ظهور السؤال يمكنك إيقاف المؤقت لمدة دقيقة تقريبًا، والاتصال بصديق لمساعدتك في معرفة الإجابة.',
    icon: Phone,
  },
  {
    id: 'hole',
    name: 'الحفرة',
    timing: 'قبل مشاهدة السؤال',
    description:
      'تُفعّل قبل فتح السؤال. إذا أجبت إجابة صحيحة تحصل على نقاط السؤال، ويُخصم نفس العدد من نقاط الفريق المنافس. إذا أخطأت فلا يتم خصم شيء.',
    icon: Swords,
  },
  {
    id: 'two-answers',
    name: 'جاوب جوابين',
    timing: 'بعد مشاهدة السؤال',
    description:
      'تسمح لك بتقديم إجابتين مختلفتين على السؤال، وتُحسب لك الإجابة إذا كانت واحدة منهما صحيحة.',
    icon: CircleHelp,
  },
  {
    id: 'rest',
    name: 'استريح',
    timing: 'قبل مشاهدة السؤال',
    description:
      'عندما يكون دورك في اختيار السؤال، فعّل هذه الوسيلة حتى لا يتمكن الفريق المنافس من المشاركة أو الإجابة على هذا السؤال.',
    icon: Hand,
  },
  {
    id: 'trap',
    name: 'الفخ',
    timing: 'قبل مشاهدة السؤال',
    description:
      'إذا لم تجب عن السؤال، ينتقل إلى الفريق المنافس. إذا أجاب المنافس بشكل خاطئ، تُخصم منه قيمة السؤال كاملة: 200 أو 400 أو 600 نقطة.',
    icon: Bomb,
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
            اختر وسائل المساعدة المناسبة واستخدم كل وسيلة في الوقت
            الصحيح أثناء المنافسة.
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-[1100px] grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {helpers.map((helper, index) => {
            const Icon = helper.icon;
            const isLast = index === helpers.length - 1;

            return (
              <article
                key={helper.id}
                className={`relative flex min-h-[300px] flex-col rounded-[24px] border border-white/10 bg-white/[0.065] p-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.18)] sm:min-h-[370px] sm:rounded-[28px] sm:p-6 ${
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

                <span className="mx-auto mt-3 rounded-full border border-[#FACC15]/25 bg-[#FACC15]/10 px-3 py-1 text-[9px] font-black text-[#FACC15] sm:text-xs">
                  {helper.timing}
                </span>

                <p className="mt-4 flex-1 text-[11px] leading-6 text-white/60 sm:text-sm sm:leading-7">
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
            كل فريق يختار 3 وسائل مساعدة قبل بدء المباراة، ولا يمكن
            استخدام الوسيلة نفسها أكثر من مرة في اللعبة.
          </p>
        </div>
      </div>
    </section>
  );
}
