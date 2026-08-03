import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ImageOff,
  Loader2,
  Search,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

import { supabase } from '../../utils/supabase';

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  is_active: boolean;
  questionCount: number;
}

interface GameSetupProps {
  onNavigate: (page: string) => void;
}

export default function GameSetup({
  onNavigate,
}: GameSetupProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: categoriesData, error: categoriesError } =
        await supabase
          .from('categories')
          .select('id, name, image_url, is_active, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

      if (categoriesError) {
        throw categoriesError;
      }

      const { data: questionsData, error: questionsError } =
        await supabase
          .from('questions')
          .select('category_id')
          .eq('is_active', true);

      if (questionsError) {
        throw questionsError;
      }

      const questionCounts = (questionsData || []).reduce<
        Record<string, number>
      >((counts, question) => {
        const categoryId = question.category_id;

        counts[categoryId] = (counts[categoryId] || 0) + 1;

        return counts;
      }, {});

      const formattedCategories: Category[] = (
        categoriesData || []
      ).map((category) => ({
        id: category.id,
        name: category.name,
        image_url: category.image_url,
        is_active: category.is_active,
        questionCount: questionCounts[category.id] || 0,
      }));

      setCategories(formattedCategories);
    } catch (caughtError) {
      console.error('Categories loading error:', caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'تعذر تحميل الفئات.',
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchText),
    );
  }, [categories, search]);

  const maxSelections = 6;

  const toggleCategory = (id: string) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= maxSelections) {
        return current;
      }

      return [...current, id];
    });
  };

  const selectRandomCategories = () => {
    const shuffled = [...categories].sort(
      () => Math.random() - 0.5,
    );

    setSelected(
      shuffled
        .slice(0, maxSelections)
        .map((category) => category.id),
    );
  };

  const continueToTeams = () => {
    const selectedCategories = categories.filter((category) =>
      selected.includes(category.id),
    );

    localStorage.setItem(
      'selectedCategories',
      JSON.stringify(selectedCategories),
    );

    onNavigate('teams');
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
            اختر 6 فئات للبدء بالمنافسة
          </p>
        </div>

        {error && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-400/30 bg-red-500/15 px-5 py-4 text-center font-bold text-red-200">
            {error}
          </div>
        )}

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
            disabled={categories.length < 6}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-7 font-black text-[#321064] transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Shuffle className="h-5 w-5" />
            اختيار عشوائي (6)
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
          <span className="font-bold">الفئات المختارة (يجب اختيار 6)</span>

          <span className="rounded-full bg-yellow-400 px-4 py-1 font-black text-[#321064]">
            {selected.length} / {maxSelections}
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <Loader2 className="h-11 w-11 animate-spin text-yellow-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/10 px-6 text-center">
            <ImageOff className="h-14 w-14 text-yellow-400" />

            <h2 className="mt-5 text-2xl font-black">
              لا توجد فئات متاحة
            </h2>

            <p className="mt-3 text-white/55">
              أضف فئات من لوحة الإدارة وتأكد أنها مفعلة (يجب أن توفر 6 فئات على الأقل).
            </p>
          </div>
        ) : (
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
                  className={`relative overflow-hidden rounded-3xl border text-right transition ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/15 shadow-[0_15px_50px_rgba(250,204,21,0.15)]'
                      : 'border-white/10 bg-white/10 hover:border-white/30'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-[#321064] shadow-lg">
                      <Check className="h-5 w-5" />
                    </span>
                  )}

                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/20">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageOff className="h-12 w-12 text-white/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-black">
                      {category.name}
                    </h2>

                    <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                      <span>
                        {category.questionCount}{' '}
                        {category.questionCount === 1
                          ? 'سؤال'
                          : 'أسئلة'}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          category.questionCount > 0
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        {category.questionCount > 0
                          ? 'جاهزة'
                          : 'بدون أسئلة'}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {!loading &&
          categories.length > 0 &&
          filteredCategories.length === 0 && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 px-6 py-16 text-center">
              <p className="text-xl font-black">
                لم نجد فئة بهذا الاسم
              </p>
            </div>
          )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            disabled={selected.length !== 6}
            onClick={continueToTeams}
            className="min-w-64 rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-black text-[#321064] transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            متابعة لإعداد الفرق
          </button>
        </div>
      </div>
    </main>
  );
}
