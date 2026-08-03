import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion } from 'motion/react';
import {
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Edit,
  ImagePlus,
  Layers3,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

import { supabase } from '../../../utils/supabase';

interface Category {
  id: string;
  name: string;
  image_url: string | null;
}

interface RoundQuestion {
  id: string;
  round_id: string;
  category_id: string;
  points: 200 | 400 | 600;
  slot_number: 1 | 2;
  question_text: string;
  answer_text: string;
  image_url: string | null;
  is_active: boolean;
}

interface QuestionRound {
  id: string;
  category_id: string;
  round_number: number;
  title: string | null;
  is_active: boolean;
  created_at: string;
  categories?: {
    name: string;
    image_url: string | null;
  } | null;
  questions?: RoundQuestion[];
}

interface QuestionDraft {
  key: string;
  points: 200 | 400 | 600;
  slotNumber: 1 | 2;
  questionText: string;
  answerText: string;
  imageFile: File | null;
  imagePreview: string;
  existingImageUrl: string | null;
  existingQuestionId: string | null;
}

const createEmptyDrafts = (): QuestionDraft[] => [
  { key: '200-1', points: 200, slotNumber: 1, questionText: '', answerText: '', imageFile: null, imagePreview: '', existingImageUrl: null, existingQuestionId: null },
  { key: '200-2', points: 200, slotNumber: 2, questionText: '', answerText: '', imageFile: null, imagePreview: '', existingImageUrl: null, existingQuestionId: null },
  { key: '400-1', points: 400, slotNumber: 1, questionText: '', answerText: '', imageFile: null, imagePreview: '', existingImageUrl: null, existingQuestionId: null },
  { key: '400-2', points: 400, slotNumber: 2, questionText: '', answerText: '', imageFile: null, imagePreview: '', existingImageUrl: null, existingQuestionId: null },
  { key: '600-1', points: 600, slotNumber: 1, questionText: '', answerText: '', imageFile: null, imagePreview: '', existingImageUrl: null, existingQuestionId: null },
  { key: '600-2', points: 600, slotNumber: 2, questionText: '', answerText: '', imageFile: null, imagePreview: '', existingImageUrl: null, existingQuestionId: null },
];

export default function QuestionsManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rounds, setRounds] = useState<QuestionRound[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedRoundId, setExpandedRoundId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRound, setEditingRound] = useState<QuestionRound | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [roundTitle, setRoundTitle] = useState('');
  const [drafts, setDrafts] = useState<QuestionDraft[]>(createEmptyDrafts());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    const [categoriesResponse, roundsResponse] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, image_url')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('question_rounds')
        .select(`
          id,
          category_id,
          round_number,
          title,
          is_active,
          created_at,
          categories (name, image_url),
          questions (
            id,
            round_id,
            category_id,
            points,
            slot_number,
            question_text,
            answer_text,
            image_url,
            is_active
          )
        `)
        .order('round_number', { ascending: true }),
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

    setCategories(categoriesResponse.data || []);
    setRounds((roundsResponse.data || []) as QuestionRound[]);
    setLoading(false);
  };

  const filteredRounds = useMemo(() => {
    if (filterCategory === 'all') return rounds;
    return rounds.filter((round) => round.category_id === filterCategory);
  }, [rounds, filterCategory]);

  const groupedRounds = useMemo(() => {
    const groups = new Map<string, { categoryId: string; categoryName: string; categoryImage: string | null; rounds: QuestionRound[] }>();

    filteredRounds.forEach((round) => {
      const existing = groups.get(round.category_id);
      if (existing) {
        existing.rounds.push(round);
        return;
      }

      groups.set(round.category_id, {
        categoryId: round.category_id,
        categoryName: round.categories?.name || 'فئة',
        categoryImage: round.categories?.image_url || null,
        rounds: [round],
      });
    });

    return Array.from(groups.values());
  }, [filteredRounds]);

  const nextRoundNumber = useMemo(() => {
    if (!categoryId) return 1;
    const categoryRounds = rounds.filter((round) => round.category_id === categoryId);
    if (categoryRounds.length === 0) return 1;
    return Math.max(...categoryRounds.map((round) => round.round_number)) + 1;
  }, [categoryId, rounds]);

  const resetForm = () => {
    drafts.forEach((draft) => {
      if (draft.imagePreview && draft.imageFile && draft.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(draft.imagePreview);
      }
    });

    setCategoryId('');
    setRoundTitle('');
    setDrafts(createEmptyDrafts());
    setEditingRound(null);
    setShowForm(false);
    setError('');
  };

  const openNewRoundForm = () => {
    resetForm();
    setShowForm(true);
  };

  const updateDraft = (key: string, updates: Partial<QuestionDraft>) => {
    setDrafts((current) => current.map((draft) => draft.key === key ? { ...draft, ...updates } : draft));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>, draftKey: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('اختر ملف صورة فقط.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب ألا يتجاوز 5 ميجابايت.');
      return;
    }

    const currentDraft = drafts.find((draft) => draft.key === draftKey);
    if (currentDraft?.imagePreview && currentDraft.imageFile && currentDraft.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(currentDraft.imagePreview);
    }

    updateDraft(draftKey, {
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
    setError('');
  };

  const removeDraftImage = (draftKey: string) => {
    const currentDraft = drafts.find((draft) => draft.key === draftKey);
    if (currentDraft?.imagePreview && currentDraft.imageFile && currentDraft.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(currentDraft.imagePreview);
    }

    updateDraft(draftKey, {
      imageFile: null,
      imagePreview: '',
      existingImageUrl: null,
    });
  };

  const uploadQuestionImage = async (draft: QuestionDraft): Promise<string | null> => {
    if (!draft.imageFile) return draft.existingImageUrl;

    const extension = draft.imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `questions/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('game-media')
      .upload(filePath, draft.imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from('game-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const validateRound = (): string | null => {
    if (!categoryId) return 'اختر الفئة أولًا.';

    for (const draft of drafts) {
      if (!draft.questionText.trim()) {
        return `اكتب سؤال ${draft.points} رقم ${draft.slotNumber}.`;
      }
      if (!draft.answerText.trim()) {
        return `اكتب إجابة سؤال ${draft.points} رقم ${draft.slotNumber}.`;
      }
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateRound();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      let roundId = editingRound?.id || '';

      if (editingRound) {
        const { error: roundUpdateError } = await supabase
          .from('question_rounds')
          .update({
            category_id: categoryId,
            title: roundTitle.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRound.id);

        if (roundUpdateError) throw new Error(roundUpdateError.message);
      } else {
        const { data: createdRound, error: roundInsertError } = await supabase
          .from('question_rounds')
          .insert({
            category_id: categoryId,
            round_number: nextRoundNumber,
            title: roundTitle.trim() || null,
            is_active: true,
          })
          .select('id')
          .single();

        if (roundInsertError || !createdRound) {
          throw new Error(roundInsertError?.message || 'تعذر إنشاء الجولة.');
        }

        roundId = createdRound.id;
      }

      for (const draft of drafts) {
        const imageUrl = await uploadQuestionImage(draft);
        const questionData = {
          round_id: roundId,
          category_id: categoryId,
          points: draft.points,
          slot_number: draft.slotNumber,
          question_text: draft.questionText.trim(),
          answer_text: draft.answerText.trim(),
          image_url: imageUrl,
          is_active: true,
          updated_at: new Date().toISOString(),
        };

        if (draft.existingQuestionId) {
          const { error: updateError } = await supabase
            .from('questions')
            .update(questionData)
            .eq('id', draft.existingQuestionId);

          if (updateError) throw new Error(updateError.message);
        } else {
          const { error: insertError } = await supabase
            .from('questions')
            .insert(questionData);

          if (insertError) throw new Error(insertError.message);
        }
      }

      await loadData();
      resetForm();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'حدث خطأ أثناء حفظ الجولة.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditRound = (round: QuestionRound) => {
    const roundQuestions = [...(round.questions || [])].sort(
      (first, second) => first.points - second.points || first.slot_number - second.slot_number,
    );

    const preparedDrafts = createEmptyDrafts().map((draft) => {
      const matchingQuestion = roundQuestions.find(
        (question) => question.points === draft.points && question.slot_number === draft.slotNumber,
      );

      if (!matchingQuestion) return draft;

      return {
        ...draft,
        questionText: matchingQuestion.question_text,
        answerText: matchingQuestion.answer_text,
        imagePreview: matchingQuestion.image_url || '',
        existingImageUrl: matchingQuestion.image_url,
        existingQuestionId: matchingQuestion.id,
      };
    });

    setEditingRound(round);
    setCategoryId(round.category_id);
    setRoundTitle(round.title || '');
    setDrafts(preparedDrafts);
    setShowForm(true);
    setError('');
  };

  const handleDeleteRound = async (round: QuestionRound) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف الجولة رقم ${round.round_number} وجميع أسئلتها؟`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from('question_rounds')
      .delete()
      .eq('id', round.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (expandedRoundId === round.id) setExpandedRoundId(null);
    await loadData();
  };

  const toggleRoundActive = async (round: QuestionRound) => {
    const { error: updateError } = await supabase
      .from('question_rounds')
      .update({
        is_active: !round.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', round.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadData();
  };

  const sortedQuestions = (round: QuestionRound) =>
    [...(round.questions || [])].sort(
      (first, second) => first.points - second.points || first.slot_number - second.slot_number,
    );

  return (
    <section dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">إدارة جولات الأسئلة</h2>
          <p className="mt-2 text-sm text-white/50">
            كل جولة تتكون من سؤالين 200، سؤالين 400، وسؤالين 600.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewRoundForm}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-5 py-3 font-black text-[#321064]"
        >
          <Plus className="h-5 w-5" />
          إضافة جولة جديدة
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4">
        <label className="block text-sm font-bold text-white/60">عرض جولات فئة معينة</label>
        <select
          value={filterCategory}
          onChange={(event) => setFilterCategory(event.target.value)}
          className="mt-3 h-12 w-full rounded-xl border border-white/15 bg-[#2B1250] px-4 font-bold outline-none sm:max-w-sm"
        >
          <option value="all">جميع الفئات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-4">
          <motion.form
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="mx-auto my-8 w-full max-w-6xl rounded-[32px] border border-white/10 bg-[#2B1250] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">
                  {editingRound ? `تعديل الجولة رقم ${editingRound.round_number}` : 'إضافة جولة جديدة'}
                </h3>
                <p className="mt-2 text-sm text-white/45">يجب تعبئة الأسئلة الستة والإجابات قبل الحفظ.</p>
              </div>

              <button type="button" onClick={resetForm} className="rounded-xl bg-white/10 p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
                {error}
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-white/70">اختر الفئة</p>

              {categories.length === 0 ? (
                <div className="rounded-2xl bg-orange-500/15 p-4 text-orange-200">لا توجد فئات. أضف الفئات أولًا.</div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const selected = categoryId === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        disabled={Boolean(editingRound)}
                        onClick={() => setCategoryId(category.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-right transition disabled:cursor-not-allowed disabled:opacity-70 ${
                          selected ? 'border-[#FACC15] bg-[#FACC15]/15' : 'border-white/10 bg-black/10'
                        }`}
                      >
                        {category.image_url ? (
                          <img src={category.image_url} alt={category.name} className="h-16 w-16 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10">
                            <CircleHelp className="h-7 w-7" />
                          </div>
                        )}

                        <div>
                          <span className="block font-black">{category.name}</span>
                          {selected && !editingRound && (
                            <span className="mt-1 block text-xs text-[#FACC15]">الجولة القادمة: {nextRoundNumber}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-white/70">اسم الجولة — اختياري</span>
              <input
                value={roundTitle}
                onChange={(event) => setRoundTitle(event.target.value)}
                placeholder="مثال: نجوم كأس العالم"
                className="h-14 w-full rounded-2xl border border-white/15 bg-black/15 px-4 font-bold outline-none focus:border-[#FACC15]"
              />
            </label>

            <div className="mt-8 space-y-8">
              {[200, 400, 600].map((pointValue) => (
                <section key={pointValue} className="rounded-[28px] border border-white/10 bg-black/10 p-4 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h4 className="text-xl font-black">أسئلة {pointValue} نقطة</h4>
                    <span className="rounded-full bg-[#FACC15] px-4 py-1 font-black text-[#321064]">سؤالان</span>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {drafts
                      .filter((draft) => draft.points === pointValue)
                      .map((draft) => (
                        <QuestionEditorCard
                          key={draft.key}
                          draft={draft}
                          updateDraft={updateDraft}
                          handleImageChange={handleImageChange}
                          removeDraftImage={removeDraftImage}
                        />
                      ))}
                  </div>
                </section>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="mt-8 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[#FACC15] text-lg font-black text-[#321064] disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="h-5 w-5 animate-spin" />جاري حفظ الجولة...</>
              ) : (
                <><Save className="h-5 w-5" />حفظ الجولة كاملة</>
              )}
            </button>
          </motion.form>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#FACC15]" />
        </div>
      ) : rounds.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[30px] border border-white/10 bg-white/10 p-6 text-center">
          <Layers3 className="h-14 w-14 text-[#FACC15]" />
          <h3 className="mt-5 text-2xl font-black">لا توجد جولات بعد</h3>
          <p className="mt-3 text-white/50">اضغط إضافة جولة جديدة وأضف الأسئلة الستة.</p>
        </div>
      ) : groupedRounds.length === 0 ? (
        <div className="rounded-[30px] border border-white/10 bg-white/10 p-12 text-center">لا توجد جولات لهذه الفئة.</div>
      ) : (
        <div className="space-y-7">
          {groupedRounds.map((group) => (
            <section key={group.categoryId} className="overflow-hidden rounded-[30px] border border-white/10 bg-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
                <div className="flex items-center gap-4">
                  {group.categoryImage ? (
                    <img src={group.categoryImage} alt={group.categoryName} className="h-16 w-16 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                      <Layers3 className="h-7 w-7 text-[#FACC15]" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black">{group.categoryName}</h3>
                    <p className="mt-1 text-sm text-white/45">{group.rounds.length} جولة — {group.rounds.length * 6} سؤال</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {group.rounds.map((round) => {
                  const isExpanded = expandedRoundId === round.id;
                  const roundQuestions = sortedQuestions(round);

                  return (
                    <article key={round.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/10">
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <button
                          type="button"
                          onClick={() => setExpandedRoundId(isExpanded ? null : round.id)}
                          className="flex flex-1 items-center gap-3 text-right"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FACC15] font-black text-[#321064]">
                            {round.round_number}
                          </span>

                          <div>
                            <h4 className="font-black">الجولة رقم {round.round_number}</h4>
                            <p className="mt-1 text-xs text-white/45">{round.title || 'بدون اسم إضافي'} — {roundQuestions.length}/6 أسئلة</p>
                          </div>

                          <span className="mr-auto">{isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleRoundActive(round)}
                          className={`rounded-full px-3 py-1 text-xs font-black ${round.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                        >
                          {round.is_active ? 'مفعلة' : 'مخفية'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditRound(round)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-500/15 px-4 py-2 font-bold text-blue-300"
                        >
                          <Edit className="h-4 w-4" />تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRound(round)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2 font-bold text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />حذف
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-white/10 p-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            {roundQuestions.map((question) => (
                              <article key={question.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                {question.image_url && (
                                  <img src={question.image_url} alt={question.question_text} className="h-48 w-full bg-black/20 object-contain" />
                                )}

                                <div className="p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="rounded-full bg-[#FACC15] px-3 py-1 text-sm font-black text-[#321064]">{question.points}</span>
                                    <span className="text-xs text-white/45">السؤال {question.slot_number}</span>
                                  </div>

                                  <h5 className="mt-4 font-black leading-7">{question.question_text}</h5>

                                  <div className="mt-4 rounded-xl bg-green-500/10 p-3">
                                    <span className="text-xs font-bold text-green-300">الإجابة</span>
                                    <p className="mt-1 font-black">{question.answer_text}</p>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

interface QuestionEditorCardProps {
  draft: QuestionDraft;
  updateDraft: (key: string, updates: Partial<QuestionDraft>) => void;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>, draftKey: string) => void;
  removeDraftImage: (draftKey: string) => void;
}

function QuestionEditorCard({ draft, updateDraft, handleImageChange, removeDraftImage }: QuestionEditorCardProps) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h5 className="font-black">السؤال {draft.slotNumber}</h5>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white/60">{draft.points} نقطة</span>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-white/65">نص السؤال</span>
        <textarea
          value={draft.questionText}
          onChange={(event) => updateDraft(draft.key, { questionText: event.target.value })}
          placeholder="اكتب السؤال هنا..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-white/15 bg-black/15 p-4 font-bold leading-7 outline-none focus:border-[#FACC15]"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-white/65">الإجابة الصحيحة</span>
        <input
          value={draft.answerText}
          onChange={(event) => updateDraft(draft.key, { answerText: event.target.value })}
          placeholder="اكتب الإجابة..."
          className="h-12 w-full rounded-2xl border border-white/15 bg-black/15 px-4 font-bold outline-none focus:border-[#FACC15]"
        />
      </label>

      <div className="mt-4">
        <span className="mb-2 block text-sm font-bold text-white/65">صورة السؤال — اختيارية</span>

        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-black/10 transition hover:border-[#FACC15]">
          {draft.imagePreview ? (
            <div className="relative w-full">
              <img src={draft.imagePreview} alt="معاينة صورة السؤال" className="h-48 w-full object-contain" />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  removeDraftImage(draft.key);
                }}
                className="absolute left-3 top-3 rounded-full bg-red-500 p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <ImagePlus className="h-10 w-10 text-[#FACC15]" />
              <p className="mt-3 font-black">رفع صورة</p>
              <p className="mt-1 text-xs text-white/40">يمكنك تركها فارغة</p>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(event, draft.key)}
            className="hidden"
          />
        </label>
      </div>
    </article>
  );
}
