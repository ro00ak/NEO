import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface AnswerProps {
  onNavigate: (page: string) => void;
}

export default function Answer({ onNavigate }: AnswerProps) {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052f] px-5 pb-16 pt-28 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[40px] border border-white/15 bg-white/10 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:p-12">
          <p className="text-lg font-bold text-white/50">
            الإجابة الصحيحة
          </p>

          <h1 className="mt-5 text-4xl font-black text-yellow-400 sm:text-6xl">
            ستظهر الإجابة هنا
          </h1>

          <div className="mt-10 rounded-3xl border border-dashed border-white/20 bg-black/10 p-12 text-white/40">
            صورة أو فيديو الإجابة
          </div>

          <h2 className="mt-10 text-2xl font-black">
            أي فريق أجاب بشكل صحيح؟
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('board')}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-green-500 px-7 py-5 text-xl font-black"
            >
              <CheckCircle2 className="h-7 w-7" />
              الفريق الأول
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('board')}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-500 px-7 py-5 text-xl font-black"
            >
              <CheckCircle2 className="h-7 w-7" />
              الفريق الثاني
            </motion.button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('board')}
            className="mt-5 inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-black hover:bg-white/15"
          >
            <XCircle className="h-6 w-6" />
            لم يجب أحد
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      </div>
    </main>
  );
}
