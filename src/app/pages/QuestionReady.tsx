import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CirclePlay,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface QuestionReadyProps {
  onNavigate: (page: string) => void;
}

interface CurrentQuestion {
  id: string;
  categoryId: number;
  value: number;
  side: 'right' | 'left';
}

const categoryNames: Record<number, string> = {
  1: 'معلومات عامة',
  2: 'سلطنة عمان',
  3: 'كرة القدم',
  4: 'ألعاب الفيديو',
  5: 'أفلام ومسلسلات',
  6: 'تقنية',
};

export default function QuestionReady({
  onNavigate,
}: QuestionReadyProps) {
  const [question, setQuestion] =
    useState<CurrentQuestion | null>(null);

  useEffect(() => {
    const savedQuestion = localStorage.getItem('currentQuestion');

    if (!savedQuestion) {
      onNavigate('board');
      return;
    }

    try {
      setQuestion(JSON.parse(savedQuestion));
    } catch {
      onNavigate('board');
    }
  }, [onNavigate]);

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2E1065] text-white">
        جاري تحميل السؤال...
      </main>
    );
  }

  const categoryName =
    categoryNames[question.categoryId] ?? 'فئة غير معروفة';

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#321064] to-[#17052f] px-5 py-24 text-white"
    >
      <div className="absolute right-[-150px] top-[-150px] h-[420px] w-[420px] rounded-full bg-purple-500/30 blur-[110px]" />
      <div className="absolute bottom-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-yellow-400/15 blur-[120px]" />

      <motion.section
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.7,
          type: 'spring',
          stiffness: 90,
        }}
        className="relative z-10 w-full max-w-4xl rounded-[40px] border border-white/15 bg-white/10 p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-yellow-400 text-[#321064] shadow-[0_15px_50px_rgba(250,204,21,0.3)]">
          <Sparkles className="h-12 w-12" />
        </div>

        <p className="mt-8 text-lg font-bold text-white/60">
          استعدوا للسؤال
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-6xl">
          {categoryName}
        </h1>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-black/15 px-5 py-4">
            <Trophy className="h-6 w-6 text-yellow-400" />

            <div className="text-right">
              <p className="text-xs text-white/50">
                قيمة السؤال
              </p>

              <p className="text-2xl font-black text-yellow-400">
                {question.value} نقطة
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-black/15 px-5 py-4">
            <div>
              <p className="text-xs text-white/50">
                الفريق صاحب الدور
              </p>

              <p className="mt-1 text-xl font-black">
                الفريق الأول
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70">
          بعد الضغط على جاهز سيظهر السؤال، ويبدأ المؤقت بعد
          تحميل محتوى السؤال بالكامل.
        </div>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate('board')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black transition hover:bg-white/15"
          >
            <ArrowRight className="h-5 w-5" />
            الرجوع للوحة
          </button>

          <motion.button
            type="button"
            onClick={() => onNavigate('question')}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex min-w-64 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 text-xl font-black text-[#321064] shadow-[0_15px_45px_rgba(250,204,21,0.25)]"
          >
            <CirclePlay className="h-7 w-7" />
            جاهز، أظهر السؤال
          </motion.button>
        </div>
      </motion.section>
    </main>
  );
}
