import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Expand,
  Flag,
  Minus,
  Plus,
  Trophy,
  Volume2,
} from 'lucide-react';

interface GameBoardProps {
  onNavigate: (page: string) => void;
}

const categories = [
  {
    id: 1,
    name: 'معلومات عامة',
    icon: '🧠',
  },
  {
    id: 2,
    name: 'سلطنة عمان',
    icon: '🇴🇲',
  },
  {
    id: 3,
    name: 'كرة القدم',
    icon: '⚽',
  },
  {
    id: 4,
    name: 'ألعاب الفيديو',
    icon: '🎮',
  },
  {
    id: 5,
    name: 'أفلام ومسلسلات',
    icon: '🎬',
  },
  {
    id: 6,
    name: 'تقنية',
    icon: '💻',
  },
];

const questionValues = [200, 400, 600];

export default function GameBoard({ onNavigate }: GameBoardProps) {
  const [teamOneScore, setTeamOneScore] = useState(0);
  const [teamTwoScore, setTeamTwoScore] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<1 | 2>(1);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const openQuestion = (
    categoryId: number,
    value: number,
    side: 'right' | 'left',
  ) => {
    const questionId = `${categoryId}-${value}-${side}`;

    if (usedQuestions.includes(questionId)) {
      return;
    }

    localStorage.setItem(
      'currentQuestion',
      JSON.stringify({
        id: questionId,
        categoryId,
        value,
        side,
      }),
    );

    localStorage.setItem(
      'gameBoardState',
      JSON.stringify({
        teamOneScore,
        teamTwoScore,
        currentTeam,
        usedQuestions,
      }),
    );

    onNavigate('question-ready');
  };

  const adjustScore = (
    team: 1 | 2,
    amount: number,
  ) => {
    if (team === 1) {
      setTeamOneScore((score) => Math.max(0, score + amount));
    } else {
      setTeamTwoScore((score) => Math.max(0, score + amount));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052f] px-4 pb-44 pt-24 text-white"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* الشريط العلوي */}
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <img
              src="/almaydan-logo.png"
              alt="الميدان يا حميدان"
              className="h-14 w-14 rounded-2xl object-cover"
            />

            <div>
              <p className="text-sm text-white/55">اللعبة الحالية</p>
              <h1 className="text-xl font-black">
                الميدان يا حميدان
              </h1>
            </div>
          </div>

          <div className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-[#321064]">
            دور فريق:{' '}
            {currentTeam === 1 ? 'الفريق الأول' : 'الفريق الثاني'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`rounded-xl p-3 transition ${
                soundEnabled
                  ? 'bg-yellow-400 text-[#321064]'
                  : 'bg-white/10 text-white'
              }`}
            >
              <Volume2 className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
            >
              <Expand className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-black"
            >
              <Flag className="h-5 w-5" />
              إنهاء اللعبة
            </button>
          </div>
        </header>

        {/* شبكة الأسئلة */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="overflow-hidden rounded-[30px] border border-white/15 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-center justify-center gap-4 bg-gradient-to-l from-[#7c3aed] to-[#4c1d95] px-5 py-6">
                <span className="text-5xl">{category.icon}</span>

                <h2 className="text-2xl font-black">
                  {category.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4">
                {questionValues.flatMap((value) =>
                  (['right', 'left'] as const).map((side) => {
                    const questionId =
                      `${category.id}-${value}-${side}`;

                    const isUsed =
                      usedQuestions.includes(questionId);

                    return (
                      <motion.button
                        key={questionId}
                        type="button"
                        disabled={isUsed}
                        onClick={() =>
                          openQuestion(
                            category.id,
                            value,
                            side,
                          )
                        }
                        whileHover={
                          isUsed ? undefined : { scale: 1.04 }
                        }
                        whileTap={
                          isUsed ? undefined : { scale: 0.96 }
                        }
                        className={`relative h-20 rounded-2xl text-2xl font-black transition ${
                          isUsed
                            ? 'cursor-not-allowed bg-black/25 text-white/25'
                            : 'bg-white text-[#321064] hover:bg-yellow-400'
                        }`}
                      >
                        {isUsed ? 'مستخدم' : value}

                        {!isUsed && (
                          <span className="absolute bottom-1 left-2 text-[10px] font-bold opacity-40">
                            {side === 'right' ? 'أ' : 'ب'}
                          </span>
                        )}
                      </motion.button>
                    );
                  }),
                )}
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* شريط نقاط الفرق */}
      <section className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/15 bg-[#18052f]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[1fr_auto_1fr]">
          <TeamScore
            name="الفريق الأول"
            score={teamOneScore}
            color="#FACC15"
            isCurrent={currentTeam === 1}
            onAdd={() => adjustScore(1, 100)}
            onSubtract={() => adjustScore(1, -100)}
          />

          <button
            type="button"
            onClick={() =>
              setCurrentTeam((team) => (team === 1 ? 2 : 1))
            }
            className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 font-black transition hover:bg-white/20"
          >
            تبديل الدور
          </button>

          <TeamScore
            name="الفريق الثاني"
            score={teamTwoScore}
            color="#3B82F6"
            isCurrent={currentTeam === 2}
            onAdd={() => adjustScore(2, 100)}
            onSubtract={() => adjustScore(2, -100)}
          />
        </div>
      </section>
    </main>
  );
}

interface TeamScoreProps {
  name: string;
  score: number;
  color: string;
  isCurrent: boolean;
  onAdd: () => void;
  onSubtract: () => void;
}

function TeamScore({
  name,
  score,
  color,
  isCurrent,
  onAdd,
  onSubtract,
}: TeamScoreProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${
        isCurrent
          ? 'border-yellow-400 bg-yellow-400/10'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-[#321064]"
          style={{ backgroundColor: color }}
        >
          <Trophy className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-white/55">
            {isCurrent ? 'الدور الحالي' : 'الفريق'}
          </p>

          <h3 className="font-black">{name}</h3>
        </div>
      </div>

      <strong className="text-3xl font-black">{score}</strong>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSubtract}
          className="rounded-xl bg-red-500/20 p-2 text-red-300 hover:bg-red-500/30"
        >
          <Minus className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-green-500/20 p-2 text-green-300 hover:bg-green-500/30"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
