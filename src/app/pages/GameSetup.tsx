import { useEffect, useMemo, useState } from 'react';
import { Check, Info, Loader2, Search, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';

import { supabase } from '../../utils/supabase';

interface GameSetupProps {
  onNavigate: (page: string) => void;
}

interface CategoryRow {
  id: string;
  name: string;
  image_url: string | null;
  section_name: string | null;
  is_active: boolean;
}

interface RoundRow {
  id: string;
  category_id: string;
  is_active: boolean;
}

interface CategoryItem extends CategoryRow {
  roundsCount: number;
}

export default function GameSetup({ onNavigate }: GameSetupProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    const [categoriesResponse, roundsResponse] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, image_url, section_name, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),

      supabase
        .from('question_rounds')
        .select('id, category_id, is_active')
        .eq('is_active', true),
    ]);

    if (categoriesResponse.error) {
      setError(categoriesResponse.error.message);
      setLoading(false);
      return;
    }

    if (roundsResponse.error) {
      setError(roundsResponse.error.message);
      setLoading(false);
      return;
    }

    const rounds = (roundsResponse.data || []) as RoundRow[];

    const preparedCategories = (
      (categoriesResponse.data || []) as CategoryRow[]
    ).map((category) => ({
      ...category,
      roundsCount: rounds.filter(
        (round) => round.category_id === category.id,
      ).length,
    }));

    setCategories(preparedCategories);
    setLoading(false);
  };

  const filteredCategories = useMemo(() => {
    const cleanSearch = search.trim();

    if (!cleanSearch) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name.includes(cleanSearch) ||
        (category.section_name || '').includes(cleanSearch),
    );
  }, [categories, search]);

  const groupedCategories = useMemo(() => {
    const groups = new Map<string, CategoryItem[]>();

    filteredCategories.forEach((category) => {
      const section = category.section_name?.trim() || 'غير مصنف';
      const existing = groups.get(section) || [];
      existing.push(category);
      groups.set(section, existing);
    });

    return Array.from(groups.entries());
  }, [filteredCategories]);

  const toggleCategory = (category: CategoryItem) => {
    if (category.roundsCount === 0) {
      return;
    }

    setSelected((current) => {
      if (current.includes(category.id)) {
        return current.filter((id) => id !== category.id);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, category.id];
    });
  };

  const selectRandomCategories = () => {
    const availableCategories = categories.filter(
      (category) => category.roundsCount > 0,
    );

    const shuffled = [...availableCategories].sort(
      () => Math.random() - 0.5,
    );

    setSelected(
      shuffled.slice(0, 6).map((category) => category.id),
    );
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
  };

  const continueToTeams = () => {
    if (selected.length !== 6) {
      return;
    }

    sessionStorage.setItem(
      'selectedCategories',
      JSON.stringify(selected),
    );

    onNavigate('teams');
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#1D073D] px-5 pb-20 pt-36 text-white"
    >
      <div className="mx-auto max-w-[1450px]">
        <div className="text-center">
          <h1 className="text-4xl font-black sm:text-6xl">
            أنشئ ميدانك
          </h1>

          <p className="mt-4 text-lg text-white/65">
            اختر 6 فئات للبدء بالمنافسة
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن فئة أو قسم..."
              className="h-14 w-full rounded-2xl border border-white/15 bg-white/10 pr-14 pl-5 outline-none placeholder:text-white/40 focus:border-[#FACC15]"
            />
          </div>

          <button
            type="button"
            onClick={selectRandomCategories}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#FACC15] px-7 font-black text-[#321064] transition hover:-translate-y-1"
          >
            <Shuffle className="h-5 w-5" />
            اختيار عشوائي
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
          <span className="font-black">
            الفئات المختارة (يجب اختيار 6)
          </span>

          <span className="rounded-full bg-[#FACC15] px-4 py-1 font-black text-[#321064]">
            {selected.length} / 6
          </span>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 font-bold text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#FACC15]" />
          </div>
        ) : groupedCategories.length === 0 ? (
          <div className="mt-8 rounded-[30px] border border-white/10 bg-white/10 p-12 text-center">
            لا توجد فئات مطابقة.
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {groupedCategories.map(([section, sectionCategories]) => {
              const isCollapsed = collapsedSections.includes(section);

              return (
                <section
                  key={section}
                  className="relative rounded-[36px] border border-white/10 bg-white/[0.07] px-5 pb-8 pt-12 shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section)}
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg font-black text-white/70 transition hover:bg-white/25"
                    aria-label={
                      isCollapsed ? 'إظهار القسم' : 'إخفاء القسم'
                    }
                  >
                    {isCollapsed ? '+' : '−'}
                  </button>

                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="min-w-52 rounded-full border border-[#FACC15]/30 bg-gradient-to-b from-[#FFD83D] to-[#E9A900] px-8 py-3 text-center text-lg font-black text-[#321064] shadow-[0_6px_0_#8A6400]">
                      {section}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                      {sectionCategories.map((category, index) => {
                        const isSelected = selected.includes(category.id);
                        const isUnavailable = category.roundsCount === 0;

                        return (
                          <motion.button
                            key={category.id}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            whileHover={
                              isUnavailable
                                ? undefined
                                : { y: -7, scale: 1.02 }
                            }
                            whileTap={
                              isUnavailable
                                ? undefined
                                : { scale: 0.98 }
                            }
                            className={`group relative overflow-hidden rounded-[26px] border text-right transition ${
                              isSelected
                                ? 'border-[#FACC15] bg-[#FACC15]/10 shadow-[0_15px_45px_rgba(250,204,21,0.18)]'
                                : 'border-white/10 bg-[#241047] hover:border-white/30'
                            } ${
                              isUnavailable
                                ? 'cursor-not-allowed opacity-55'
                                : ''
                            }`}
                          >
                            <div className="relative h-48 overflow-hidden bg-[#D8E8F8]">
                              {category.image_url ? (
                                <img
                                  src={category.image_url}
                                  alt={category.name}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-5xl">
                                  🎯
                                </div>
                              )}

                              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                                <Info className="h-5 w-5" />
                              </span>

                              {isSelected && (
                                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FACC15] text-[#321064] shadow-lg">
                                  <Check className="h-5 w-5" />
                                </span>
                              )}

                              <span className="absolute bottom-3 left-3 rounded-full bg-[#FF7043] px-3 py-1 text-xs font-black text-white shadow-lg">
                                {category.roundsCount > 0
                                  ? `${category.roundsCount} جولة`
                                  : 'بدون جولات'}
                              </span>
                            </div>

                            <div className="bg-gradient-to-b from-[#3B1D68] to-[#2B1250] px-4 py-4">
                              <h3 className="text-center text-lg font-black">
                                {category.name}
                              </h3>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            disabled={selected.length !== 6}
            onClick={continueToTeams}
            className="min-w-72 rounded-2xl bg-[#FACC15] px-8 py-4 text-lg font-black text-[#321064] shadow-[0_6px_0_#8A6400] transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            متابعة لإعداد الفرق
          </button>
        </div>
      </div>
    </main>
  );
}
