import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion } from 'motion/react';
import {
  Edit,
  FolderPlus,
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
  section_name: string;
  is_active: boolean;
  created_at: string;
}

const defaultSections = [
  'أجدد الفئات',
  'عام',
  'إسلامي',
  'دول',
  'حروف',
  'كلمات',
  'تفكير',
  'بنات',
  'فن خليجي',
  'مسرح',
  'فن عربي',
  'أغاني',
  'فن أجنبي',
  'فن تركي',
  'كرة قدم',
  'رياضة',
  'أنيمي',
  'ألعاب',
  'السعودية',
  'عمان',
  'الكويت',
  'قطر',
  'الإمارات',
  'البحرين',
];

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [name, setName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [customSection, setCustomSection] = useState('');
  const [useCustomSection, setUseCustomSection] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [filterSection, setFilterSection] = useState('all');
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
      .select(
        'id, name, image_url, section_name, is_active, created_at',
      )
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setCategories((data || []) as Category[]);
    setLoading(false);
  };

  const sectionOptions = useMemo(() => {
    const savedSections = categories
      .map((category) => category.section_name)
      .filter(Boolean);

    return Array.from(
      new Set([...defaultSections, ...savedSections]),
    );
  }, [categories]);

  const filteredCategories = useMemo(() => {
    if (filterSection === 'all') {
      return categories;
    }

    return categories.filter(
      (category) => category.section_name === filterSection,
    );
  }, [categories, filterSection]);

  const groupedCategories = useMemo(() => {
    const groups = new Map<string, Category[]>();

    filteredCategories.forEach((category) => {
      const section = category.section_name || 'غير مصنف';
      const current = groups.get(section) || [];
      current.push(category);
      groups.set(section, current);
    });

    return Array.from(groups.entries());
  }, [filteredCategories]);

  const resetForm = () => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setName('');
    setSectionName('');
    setCustomSection('');
    setUseCustomSection(false);
    setImageFile(null);
    setImagePreview('');
    setEditingCategory(null);
    setShowForm(false);
    setError('');
  };

  const openNewCategoryForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
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

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
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

    const filePath =
      `categories/${crypto.randomUUID()}.${extension}`;

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

    const cleanName = name.trim();
    const selectedSection = useCustomSection
      ? customSection.trim()
      : sectionName.trim();

    if (!cleanName) {
      setError('اكتب اسم الفئة.');
      return;
    }

    if (!selectedSection) {
      setError('اختر القسم أو أضف قسمًا جديدًا.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const imageUrl = await uploadImage();

      const categoryData = {
        name: cleanName,
        section_name: selectedSection,
        image_url: imageUrl,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      if (editingCategory) {
        const { error: updateError } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert(categoryData);

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
    setSectionName(category.section_name);
    setUseCustomSection(
      !defaultSections.includes(category.section_name),
    );
    setCustomSection(
      defaultSections.includes(category.section_name)
        ? ''
        : category.section_name,
    );
    setImageFile(null);
    setImagePreview(category.image_url || '');
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف فئة "${category.name}"؟ سيتم حذف جولات وأسئلة الفئة المرتبطة بها.`,
    );

    if (!confirmed) return;

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
            أضف الفئة وصورتها، ثم اختر القسم الذي ستظهر تحته في صفحة اللعب.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewCategoryForm}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-5 py-3 font-black text-[#321064]"
        >
          <Plus className="h-5 w-5" />
          إضافة فئة جديدة
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </div>
      )}

      <div className="mb-7 rounded-2xl border border-white/10 bg-white/10 p-4">
        <label className="block text-sm font-bold text-white/60">
          عرض فئات قسم معين
        </label>

        <select
          value={filterSection}
          onChange={(event) => setFilterSection(event.target.value)}
          className="mt-3 h-12 w-full rounded-xl border border-white/15 bg-[#2B1250] px-4 font-bold outline-none sm:max-w-sm"
        >
          <option value="all">جميع الأقسام</option>
          {sectionOptions.map((section) => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <motion.form
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="my-8 w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#2B1250] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">
                  {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </h3>
                <p className="mt-2 text-sm text-white/45">
                  اكتب الاسم، اختر القسم، ثم ارفع صورة الفئة.
                </p>
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

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-bold text-white/70">اسم الفئة</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثال: كأس العالم 2026"
                className="h-14 w-full rounded-2xl border border-white/15 bg-black/15 px-4 font-bold outline-none focus:border-[#FACC15]"
              />
            </label>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-bold text-white/70">
                القسم الذي تظهر تحته الفئة
              </span>

              {!useCustomSection ? (
                <>
                  <select
                    value={sectionName}
                    onChange={(event) => setSectionName(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/15 bg-[#241044] px-4 font-bold outline-none focus:border-[#FACC15]"
                  >
                    <option value="">اختر القسم</option>
                    {sectionOptions.map((section) => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomSection(true);
                      setSectionName('');
                    }}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#FACC15]/30 bg-[#FACC15]/10 px-4 py-3 text-sm font-black text-[#FACC15]"
                  >
                    <FolderPlus className="h-4 w-4" />
                    إضافة قسم جديد من عندي
                  </button>
                </>
              ) : (
                <>
                  <input
                    value={customSection}
                    onChange={(event) => setCustomSection(event.target.value)}
                    placeholder="اكتب اسم القسم الجديد"
                    className="h-14 w-full rounded-2xl border border-[#FACC15] bg-black/15 px-4 font-bold outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomSection(false);
                      setCustomSection('');
                    }}
                    className="mt-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black"
                  >
                    الرجوع إلى الأقسام الجاهزة
                  </button>
                </>
              )}
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-bold text-white/70">صورة الفئة</span>
              <label className="flex min-h-60 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-white/20 bg-black/15 transition hover:border-[#FACC15]">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img src={imagePreview} alt="معاينة صورة الفئة" className="h-72 w-full object-contain" />
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
                    <p className="mt-4 font-black">اضغط لرفع صورة الفئة</p>
                    <p className="mt-2 text-sm text-white/40">JPG أو PNG بحد أقصى 5MB</p>
                  </>
                )}

                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
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
                  حفظ الفئة
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
      ) : categories.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[30px] border border-white/10 bg-white/10 p-6 text-center">
          <FolderPlus className="h-14 w-14 text-[#FACC15]" />
          <h3 className="mt-5 text-2xl font-black">لا توجد فئات بعد</h3>
          <p className="mt-3 text-white/50">اضغط إضافة فئة جديدة واختر القسم المناسب.</p>
        </div>
      ) : groupedCategories.length === 0 ? (
        <div className="rounded-[30px] border border-white/10 bg-white/10 p-12 text-center">
          لا توجد فئات داخل هذا القسم.
        </div>
      ) : (
        <div className="space-y-8">
          {groupedCategories.map(([section, sectionCategories]) => (
            <section key={section} className="rounded-[30px] border border-white/10 bg-white/10 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">{section}</h3>
                  <p className="mt-1 text-sm text-white/45">{sectionCategories.length} فئة</p>
                </div>
                <span className="rounded-full bg-[#FACC15] px-4 py-1 font-black text-[#321064]">
                  {sectionCategories.length}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sectionCategories.map((category) => (
                  <article key={category.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-black/15">
                    {category.image_url ? (
                      <img src={category.image_url} alt={category.name} className="h-52 w-full bg-black/10 object-contain" />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-white/5">
                        <ImagePlus className="h-12 w-12 text-white/30" />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-black">{category.name}</h4>
                          <p className="mt-1 text-xs text-white/45">{category.section_name}</p>
                        </div>

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

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/15 px-3 py-3 font-bold text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                          تعديل
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-3 font-bold text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
