import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { questions } from '../data/questions';

interface QuestionProps {
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

const QUESTION_TIME = 30;

export default function Question({ onNavigate }: QuestionProps) {
  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestion | null>(null);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const savedQuestion = localStorage.getItem('currentQuestion');

    if (!savedQuestion) {
      onNavigate('board');
      return;
    }

    try {
      setCurrentQuestion(JSON.parse(savedQuestion));
    } catch {
      onNavigate('board');
    }
  }, [onNavigate]);

  const questionData = useMemo(() => {
    if (!currentQuestion) {
      return null;
    }

    return questions.find(
      (question) =>
        question.categoryId === currentQuestion.categoryId &&
        question.value === currentQuestion.value,
    );
  }, [currentQuestion]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft]);

  const restartTimer = () => {
    setTimeLeft(QUESTION_TIME);
    setIsRunning(true);
  };

  const showAnswer = () => {
    if (!currentQuestion || !questionData) {
      return;
    }

    localStorage.setItem(
      'currentAnswer',
      JSON.stringify({
        ...currentQuestion,
        question: questionData.question,
        answer: questionData.answer,
      }),
    );

    setIsRunning(false);
    onNavigate('answer');
  };

  if (!currentQuestion || !questionData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2E1065] text-white">
        جاري تحميل السؤال...
      </main>
    );
  }

  const timerPercentage = (timeLeft / QUESTION_TIME) * 100;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052f] px-5 pb-16 pt-28 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-white/10 p-5">
          <button
            type="button"
            onClick={() => onNavigate('question-ready')}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 font-bold hover:bg-white/15"
          >
            <ArrowRight className="h-5 w-5" />
            رجوع
          </button>

          <div className="text-center">
            <p className="text-sm text-white/55">
              {categoryNames[currentQuestion.categoryId]}
            </p>

            <h1 className="text-2xl font-black text-yellow-400">
              {currentQuestion.value} نقطة
            </h1>
          </div>

          <div className="rounded-xl bg-yellow-400 px-5 py-3 font-black text-[#321064]">
            الفريق الأول
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[40px] border border-white/15 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
          <div className="border-b border-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-7 w-7 text-yellow-400" />

                <span className="text-3xl font-black">
                  {timeLeft}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning((value) => !value)}
                  className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                >
                  {isRunning ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={restartTimer}
                  className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-black/20">
              <motion.div
                animate={{ width: `${timerPercentage}%` }}
                className={`h-full rounded-full ${
                  timeLeft <= 5
                    ? 'bg-red-500'
                    : timeLeft <= 10
                      ? 'bg-orange-400'
                      : 'bg-yellow-400'
                }`}
              />
            </div>
          </div>

          <div className="flex min-h-[380px] flex-col items-center justify-center p-8 text-center sm:p-14">
            <p className="max-w-4xl text-3xl font-black leading-[1.8] sm:text-5xl">
              {questionData.question}
            </p>

            {questionData.options && (
              <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
                {questionData.options.map((option, index) => (
                  <div
                    key={option}
                    className="rounded-2xl border border-white/15 bg-black/15 p-5 text-xl font-bold"
                  >
                    <span className="ml-2 text-yellow-400">
                      {index + 1}.
                    </span>

                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-6 text-center">
            <motion.button
              type="button"
              onClick={showAnswer}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex min-w-64 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-9 py-4 text-xl font-black text-[#321064]"
            >
              <Eye className="h-6 w-6" />
              إظهار الإجابة
            </motion.button>
          </div>
        </section>
      </div>
    </main>
  );
}
