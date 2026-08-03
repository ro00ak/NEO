import { motion } from 'motion/react';
import {
  ArrowRight,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { useState } from 'react';

interface QuestionProps {
  onNavigate: (page: string) => void;
}

export default function Question({ onNavigate }: QuestionProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

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
            <p className="text-sm text-white/55">اسم الفئة</p>
            <h1 className="text-2xl font-black text-yellow-400">
              قيمة السؤال
            </h1>
          </div>

          <div className="rounded-xl bg-yellow-400 px-5 py-3 font-black text-[#321064]">
            الفريق صاحب الدور
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[40px] border border-white/15 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
          <div className="border-b border-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-7 w-7 text-yellow-400" />
                <span className="text-3xl font-black">{timeLeft}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning((value) => !value)}
                  className="rounded-xl bg-white/10 p-3 hover:bg-white/20"
                >
                  {isRunning ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimeLeft(30);
                    setIsRunning(false);
                  }}
                  className="rounded-xl bg-white/10 p-3 hover:bg-white/20"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex min-h-[430px] flex-col items-center justify-center p-8 text-center sm:p-14">
            <p className="text-lg font-bold text-white/45">
              سيظهر هنا السؤال الذي تضيفه من لوحة الأدمن
            </p>

            <h2 className="mt-5 max-w-4xl text-3xl font-black leading-[1.8] sm:text-5xl">
              نص السؤال
            </h2>

            <div className="mt-10 w-full max-w-3xl rounded-3xl border border-dashed border-white/20 bg-black/10 p-12 text-white/40">
              صورة، صوت أو فيديو السؤال
            </div>
          </div>

          <div className="border-t border-white/10 p-6 text-center">
            <motion.button
              type="button"
              onClick={() => onNavigate('answer')}
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
