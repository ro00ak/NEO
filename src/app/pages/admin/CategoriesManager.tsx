import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
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
  is_active: boolean;
  created_at: string;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setCategories(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setImageFile(null);
    setImagePreview('');
    setEditingCategory(null);
    setShowForm(false);
    setError('');
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
      return editingCategory?.image_url || null;
    }

    const extension =
      imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';

    const filePath = `categories/${crypto.randomUUID()}.${extension}`;

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

    if (!name.trim()) {
      setError('اكتب اسم الفئة.');
      return;
    }

    if (!imageFile && !editingCategory?.image_url) {
      setError('ارفع صورة للفئة.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const imageUrl = await uploadImage();

      if (editingCategory) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({
            name: name.trim(),
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCategory.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert({
            name: name.trim(),
            image_url: imageUrl,
            is_active: true,
          });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      await loadCategories();
      resetForm();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'حدث خطأ أثناء حفظ الفئة.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setImagePreview(category.image_url || '');
    setImageFile(null);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف فئة "${category.name}"؟`,
    );

    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await loadCategories();
  };

  const toggleActive = async (category: Category) => {
    const { error: updateError } = await supabase
      .from('categories')
      .update({
        is_active: !category.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', category.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadCategories();
  };

  return (
    <section dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">إدارة الفئات</h2>
          <p className="mt-2 text-sm text-white/50">
            أضف الفئات التي ستظهر عند بدء اللعبة.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-5 py-3 font-black text-[#321064]"
        >
          <Plus className="h-5 w-5" />
          إضافة فئة جديدة
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
        >
          <motion.form
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[#2B1250] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black">
                {editingCategory
                  ? 'تعديل الفئة'
                  : 'إضافة فئة جديدة'}
              </h3>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-white/10 p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-white/70">
                اسم الفئة
              </span>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثال: كرة القدم"
                className="h-14 w-full rounded-2xl border border-white/15 bg-black/15 px-4 font-bold outline-none focus:border-[#FACC15]"
              />
            </label>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-bold text-white/70">
                صورة الفئة
              </span>

              <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-white/20 bg-black/15 transition hover:border-[#FACC15]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="معاينة صورة الفئة"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus className="h-12 w-12 text-[#FACC15]" />
                    <p className="mt-4 font-black">اضغط لرفع صورة</p>
                    <p className="mt-2 text-sm text-white/40">
                      JPG أو PNG بحد أقصى 5MB
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
              disabled={saving}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FACC15] font-black text-[#321064] disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  حفظ الفئة
                </>
              )}
            </button>
          </motion.form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#FACC15]" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[30px] border border-white/10 bg-white/10 text-center">
          <ImagePlus className="h-14 w-14 text-[#FACC15]" />
          <h3 className="mt-5 text-2xl font-black">
            لا توجد فئات بعد
          </h3>
          <p className="mt-3 text-white/50">
            اضغط إضافة فئة جديدة وابدأ برفع أول صورة.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <motion.article
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10"
            >
              <img
                src={category.image_url || ''}
                alt={category.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black">
                    {category.name}
                  </h3>

                  <button
                    type="button"
                    onClick={() => toggleActive(category)}
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      category.is_active
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {category.is_active ? 'مفعلة' : 'مخفية'}
                  </button>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/15 px-4 py-3 font-bold text-blue-300"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 font-bold text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
