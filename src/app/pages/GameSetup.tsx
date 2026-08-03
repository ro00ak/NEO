import { useMemo, useState } from 'react';
import { Check, Info, Search, Shuffle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  { id: 1, name: 'معلومات عامة', icon: '🧠', questions: 120 },
  { id: 2, name: 'سلطنة عمان', icon: '🇴🇲', questions: 80 },
  { id: 3, name: 'كرة القدم', icon: '⚽', questions: 150 },
  { id: 4, name: 'ألعاب الفيديو', icon: '🎮', questions: 90 },
  { id: 5, name: 'أفلام ومسلسلات', icon: '🎬', questions: 100 },
  { id: 6, name: 'تقنية', icon: '💻', questions: 70 },
  { id: 7, name: 'تاريخ', icon: '🏛️', questions: 75 },
  { id: 8, name: 'جغرافيا', icon: '🌍', questions: 85 },
  { id: 9, name: 'ألغاز', icon: '🧩', questions: 60 },
  { id: 10, name: 'خمن الصورة', icon: '🖼️', questions: 50 },
  { id: 11, name: 'خمن الصوت', icon: '🔊', questions: 45 },
  { id: 12, name: 'شعارات', icon: '✨', questions: 65 },
];

interface GameSetupProps {
  onNavigate: (page: string) => void;
}

export default function GameSetup({ onNavigate }: GameSetupProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.includes(search.trim()),
    );
  }, [search]);

  const toggleCategory = (id: number) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, id];
    });
  };

  const selectRandomCategories = () => {
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    setSelected(shuffled.slice(0, 6).map((category) => category.id));
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#1d073d] px-5 pb-20 pt-32 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            جهّز لعبتك
          </span>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            أنشئ ميدانك
          </h1>

          <p className="mt-4 text-lg text-white/70">
            اختر 6 فئات للمنافسة
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن فئة..."
              className="h-14 w-full rounded-2xl border border-white/15 bg-white/10 pr-14 pl-5 outline-none placeholder:text-white/40 focus:border-yellow-400"
            />
          </div>

          <button
            type="button"
            onClick={selectRandomCategories}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-7 font-black text-[#321064] transition hover:-translate-y-1"
          >
            <Shuffle className="h-5 w-5" />
            اختر عشوائيًا
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
          <span className="font-bold">الفئات المختارة</span>

          <span className="rounded-full bg-yellow-400 px-4 py-1 font-black text-[#321064]">
            {selected.length} / 6
          </span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => {
            const isSelected = selected.includes(category.id);

            return (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-3xl border p-6 text-right transition ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-400/15 shadow-[0_15px_50px_rgba(250,204,21,0.15)]'
                    : 'border-white/10 bg-white/10 hover:border-white/30'
                }`}
              >
                {isSelected && (
                  <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-[#321064]">
                    <Check className="h-5 w-5" />
                  </span>
                )}

                <span className="block text-6xl">{category.icon}</span>

                <h2 className="mt-5 text-xl font-black">{category.name}</h2>

                <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                  <span>{category.questions} سؤال</span>
                  <Info className="h-5 w-5" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            disabled={selected.length !== 6}
            onClick={() => onNavigate('teams')}
            className="min-w-64 rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-black text-[#321064] transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            متابعة لإعداد الفرق
          </button>
        </div>
      </div>
    </main>
  );
}
