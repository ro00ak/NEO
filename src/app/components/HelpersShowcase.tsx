import { motion } from 'motion/react';
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
    description:
      'تساعدك في تضييق خيارات الإجابة وزيادة فرصة الوصول للإجابة الصحيحة.',
    icon: CircleHelp,
  },
  {
    id: 'phone',
    name: 'اتصال بصديق',
    description:
      'يتم إيقاف المؤقت مؤقتًا حتى تتمكن من الاتصال بصديق وطلب المساعدة.',
    icon: Phone,
  },
  {
    id: 'replace',
    name: 'تبديل السؤال',
    description:
      'استبدل السؤال الحالي بسؤال آخر من نفس الفئة ونفس عدد النقاط.',
    icon: RefreshCw,
  },
  {
    id: 'second-chance',
    name: 'فرصة ثانية',
    description:
      'تحصل على محاولة إضافية للإجابة إذا كانت إجابتك الأولى خاطئة.',
    icon: ShieldCheck,
  },
  {
    id: 'steal',
    name: 'سرقة السؤال',
    description:
      'انتزع فرصة الإجابة من الفريق المنافس وحاول الفوز بنقاط السؤال.',
    icon: Swords,
  },
];

export default function HelpersShowcase() {
  return (
    <section
      id="helpers-showcase"
      dir="rtl"
      className="relative overflow-hidden bg-[#1D073D] px-5 py-24 text-white"
    >
      {/* خلفية القسم */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-180px] top-[-180px] h-[450px] w-[450px] rounded-full bg-[#7C3AED]/25 blur-[120px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[450px] w-[450px] rounded-full bg-[#FACC15]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1450px]">
        {/* عنوان القسم */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#FACC15]" />
            قوة إضافية لفريقك
          </span>

          <h2 className="mt-5 text-4xl font-black sm:text-5xl lg:text-6xl">
            وسائل المساعدة
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            اختر وسائل المساعدة المناسبة لفريقك واستخدمها بذكاء أثناء
            المنافسة.
          </p>
        </motion.div>

        {/* البطاقات */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {helpers.map((helper, index) => {
            const Icon = helper.icon;

            return (
              <motion.article
                key={helper.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="group relative flex min-h-[410px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] p-6 text-center shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:border-[#FACC15]/50"
              >
                {/* رقم الوسيلة */}
                <span className="absolute left-5 top-5 text-sm font-black text-white/20">
                  0{index + 1}
                </span>

                {/* الأيقونة */}
                <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#FACC15]/60 bg-[#FACC15]/10 text-[#FACC15] transition duration-300 group-hover:bg-[#FACC15] group-hover:text-[#321064]">
                  <Icon className="h-11 w-11" />
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  {helper.name}
                </h3>

                <p className="mt-5 flex-1 text-sm leading-7 text-white/60">
                  {helper.description}
                </p>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm font-bold text-white/75">
                  تستخدم مرة واحدة
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* الملاحظة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#FACC15]/20 bg-[#FACC15]/10 px-6 py-5 text-center"
        >
          <p className="font-bold leading-8 text-white/80">
            كل فريق يختار 3 وسائل مساعدة قبل بدء المباراة، ولا يمكن
            استخدام الوسيلة أكثر من مرة في نفس اللعبة.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
