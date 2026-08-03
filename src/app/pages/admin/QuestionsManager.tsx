import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion } from 'motion/react';
import {
  CircleHelp,
  Edit,
  ImagePlus,
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

interface Question {
  id: string;
  category_id: string;
  points: number;
  question_text: string;
  answer_text: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  categories?: {
    name: string;
  } | null;
}

const pointOptions = [200, 400, 600];

export default function QuestionsManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<Question | null>(null);

  const [categoryId, setCategoryId] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [filterCategory, setFilterCategory] = useState('all');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');

    const [categoriesResponse, questionsResponse] =
      await Promise.all([
        supabase
          .from('categories')
          .select('id, name, image_url')
          .eq('is_active', true)
          .order('created_at', { ascending: false }),

        supabase
          .from('questions')
          .select(`
            id,
            category_id,
            points,
            question_text,
            answer_text,
            image_url,
            is_active,
            created_at,
            categories (
              name
            )
          `)
          .order('created_at', { ascending: false }),
      ]);

    if (categoriesResponse.error) {
      setError(categoriesResponse.error.message);
      setLoading(false);
      return;
    }

    if (questionsResponse.error) {
      setError(questionsResponse.error.message);
      setLoading(false);
      return;
    }

    setCategories(categoriesResponse.data || []);
    setQuestions((questionsResponse.data || []) as Question[]);
    setLoading(false);
  };

  const filteredQuestions = useMemo(() => {
    if (filterCategory === 'all') {
      return questions;
    }

    return questions.filter(
      (question) => question.category_id === filterCategory,
    );
  }, [questions, filterCategory]);

  const resetForm = () => {
    setCategoryId('');
    setPoints(null);
    setQuestionText('');
    setAnswerText('');
    setImageFile(null);
    setImagePreview('');
    setEditingQuestion(null);
    setShowForm(false);
    setError('');
  };

  const openNewQuestionForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('اختر ملف صورة فقط.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب ألا يتجاوز 5 ميجابايت.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      return editingQuestion?.image_url || null;
    }

    const extension =
      imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';

    const filePath =
      `questions/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('game-media')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('game-media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!categoryId) {
      setError('اختر الفئة.');
      return;
    }

    if (!points) {
      setError('اختر قيمة السؤال: 200 أو 400 أو 600.');
      return;
    }

    if (!questionText.trim()) {
      setError('اكتب نص السؤال.');
      return;
    }

    if (!answerText.trim()) {
      setError('اكتب الإجابة الصحيحة.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const imageUrl = await uploadImage();

      const questionData = {
        category_id: categoryId,
        points,
        question_text: questionText.trim(),
        answer_text: answerText.trim(),
        image_url: imageUrl,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      if (editingQuestion) {
        const { error: updateError } = await supabase
          .from('questions')
          .update(questionData)
          .eq('id', editingQuestion.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from('questions')
          .insert(questionData);

        if (insertError) {
          if (insertError.code === '23505') {
            throw new Error(
              'يوجد سؤال بهذه النقاط داخل هذه الفئة بالفعل.',
            );
          }

          throw new Error(insertError.message);
        }
      }

      await loadData();
      resetForm();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'حدث خطأ أثناء حفظ السؤال.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setCategoryId(question.category_id);
    setPoints(question.points);
    setQuestionText(question.question_text);
    setAnswerText(question.answer_text);
    setImagePreview(question.image_url || '');
    setImageFile(null);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (question: Question) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف سؤال ${question.points} نقطة؟`,
    );

    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('id', question.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadData();
  };

  return (
    <section dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">
            إدارة الأسئلة
          </h2>

          <p className="mt-2 text-sm text-white/50">
            اختر الفئة والنقاط ثم أضف السؤال والإجابة والصورة
            الاختيارية.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewQuestionForm}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-5 py-3 font-black text-[#321064]"
        >
          <Plus className="h-5 w-5" />
          إضافة سؤال جديد
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4">
        <label className="block text-sm font-bold text-white/60">
          عرض أسئلة فئة معينة
        </label>

        <select
          value={filterCategory}
          onChange={(event) =>
            setFilterCategory(event.target.value)
          }
          className="mt-3 h-12 w-full rounded-xl border border-white/15 bg-[#2B1250] px-4 font-bold outline-none sm:max-w-sm"
        >
          <option value="all">جميع الفئات</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4">
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="my-8 w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#2B1250] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">
                {editingQuestion
                  ? 'تعديل السؤال'
                  : 'إضافة سؤال جديد'}
              </h3>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-white/10 p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
                {error}
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-white/70">
                اختر الفئة
              </p>

              {categories.length === 0 ? (
                <div className="rounded-2xl bg-orange-500/15 p-4 text-orange-200">
                  لا توجد فئات. أضف الفئات أولًا.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => {
                    const selected =
                      categoryId === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          setCategoryId(category.id)
                        }
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-right transition ${
                          selected
                            ? 'border-[#FACC15] bg-[#FACC15]/15'
                            : 'border-white/10 bg-black/10'
                        }`}
                      >
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10">
                            <CircleHelp className="h-7 w-7" />
                          </div>
                        )}

                        <span className="font-black">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-bold text-white/70">
                اختر نقاط السؤال
              </p>

              <div className="grid grid-cols-3 gap-3">
                {pointOptions.map((point) => (
                  <button
                    key={point}
                    type="button"
                    onClick={() => setPoints(point)}
                    className={`h-16 rounded-2xl text-xl font-black transition ${
                      points === point
                        ? 'bg-[#FACC15] text-[#321064]'
                        : 'border border-white/15 bg-black/15 text-white'
                    }`}
                  >
                    {point}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-white/70">
                السؤال
              </span>

              <textarea
                value={questionText}
                onChange={(event) =>
                  setQuestionText(event.target.value)
                }
                placeholder="مثال: من هو اللاعب الذي يظهر في الصورة؟"
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/15 bg-black/15 p-4 font-bold leading-8 outline-none focus:border-[#FACC15]"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-white/70">
                الإجابة الصحيحة
              </span>

              <input
                value={answerText}
                onChange={(event) =>
                  setAnswerText(event.target.value)
                }
                placeholder="مثال: ليونيل ميسي"
                className="h-14 w-full rounded-2xl border border-white/15 bg-black/15 px-4 font-bold outline-none focus:border-[#FACC15]"
              />
            </label>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-bold text-white/70">
                صورة السؤال — اختيارية
              </span>

              <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-white/20 bg-black/15 transition hover:border-[#FACC15]">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="معاينة صورة السؤال"
                      className="h-64 w-full object-contain"
                    />

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute left-3 top-3 rounded-full bg-red-500 p-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="h-12 w-12 text-[#FACC15]" />

                    <p className="mt-4 font-black">
                      اضغط لرفع صورة للسؤال
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                      يمكنك تركها فارغة
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving || categories.length === 0}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FACC15] font-black text-[#321064] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  حفظ السؤال
                </>
              )}
            </button>
          </motion.form>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#FACC15]" />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[30px] border border-white/10 bg-white/10 p-6 text-center">
          <CircleHelp className="h-14 w-14 text-[#FACC15]" />

          <h3 className="mt-5 text-2xl font-black">
            لا توجد أسئلة بعد
          </h3>

          <p className="mt-3 text-white/50">
            اضغط إضافة سؤال جديد واختر الفئة والنقاط.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredQuestions.map((question) => (
            <article
              key={question.id}
              className="overflow-hidden rounded-[26px] border border-white/10 bg-white/10"
            >
              {question.image_url && (
                <img
                  src={question.image_url}
                  alt={question.question_text}
                  className="h-56 w-full object-contain bg-black/20"
                />
              )}

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#FACC15] px-4 py-1 font-black text-[#321064]">
                    {question.points} نقطة
                  </span>

                  <span className="text-sm font-bold text-white/50">
                    {question.categories?.name || 'فئة'}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-black leading-8">
                  {question.question_text}
                </h3>

                <div className="mt-4 rounded-2xl bg-green-500/10 p-4">
                  <span className="text-xs font-bold text-green-300">
                    الإجابة
                  </span>

                  <p className="mt-1 font-black">
                    {question.answer_text}
                  </p>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(question)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/15 px-4 py-3 font-bold text-blue-300"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(question)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 font-bold text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
