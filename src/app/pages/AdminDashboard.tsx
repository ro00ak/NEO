import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  CircleHelp,
  Gamepad2,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

type AdminPage =
  | 'dashboard'
  | 'users'
  | 'categories'
  | 'questions'
  | 'games'
  | 'results'
  | 'media'
  | 'settings';

const menuItems = [
  {
    id: 'dashboard' as AdminPage,
    label: 'الرئيسية',
    icon: LayoutDashboard,
  },
  {
    id: 'users' as AdminPage,
    label: 'المستخدمون',
    icon: Users,
  },
  {
    id: 'categories' as AdminPage,
    label: 'الفئات',
    icon: BookOpen,
  },
  {
    id: 'questions' as AdminPage,
    label: 'الأسئلة',
    icon: CircleHelp,
  },
  {
    id: 'games' as AdminPage,
    label: 'الألعاب',
    icon: Gamepad2,
  },
  {
    id: 'results' as AdminPage,
    label: 'النتائج',
    icon: Trophy,
  },
  {
    id: 'media' as AdminPage,
    label: 'الوسائط',
    icon: Image,
  },
  {
    id: 'settings' as AdminPage,
    label: 'الإعدادات',
    icon: Settings,
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [currentPage, setCurrentPage] =
    useState<AdminPage>('dashboard');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageTitle =
    menuItems.find((item) => item.id === currentPage)?.label ||
    'لوحة التحكم';

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#16052f] text-white"
    >
      {/* شريط الجوال */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#210744]/95 px-5 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="rounded-xl bg-white/10 p-3"
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="font-black">{pageTitle}</h1>

        <img
          src="/almaydan-logo.png"
          alt="الميدان يا حميدان"
          className="h-11 w-11 rounded-xl object-cover"
        />
      </header>

      {/* خلفية القائمة في الجوال */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* القائمة الجانبية */}
      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-72 flex-col border-l border-white/10 bg-[#210744] transition-transform duration-300 ${
          isSidebarOpen
            ? 'translate-x-0'
            : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-5">
          <button
            type="button"
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-3 text-right"
          >
            <img
              src="/almaydan-logo.png"
              alt="الميدان يا حميدان"
              className="h-14 w-14 rounded-2xl object-cover"
            />

            <div>
              <p className="text-xs font-bold text-[#FACC15]">
                لوحة إدارة
              </p>

              <h2 className="font-black">
                الميدان يا حميدان
              </h2>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-xl bg-white/10 p-2 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-right font-bold transition ${
                  isActive
                    ? 'bg-[#FACC15] text-[#321064]'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />

                <span className="flex-1">{item.label}</span>

                {isActive && (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-2xl bg-white/5 p-4">
            <p className="text-xs text-white/45">
              مسجل الدخول باسم
            </p>

            <p className="mt-1 truncate font-black">
              {user?.name || 'المسؤول'}
            </p>

            <p className="mt-1 truncate text-xs text-white/45">
              {user?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/15 px-4 py-3 font-black text-red-300 transition hover:bg-red-500/25"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى */}
      <section className="min-h-screen pt-24 lg:mr-72 lg:pt-0">
        <div className="mx-auto max-w-[1500px] p-5 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#FACC15]">
                لوحة تحكم المسؤول
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                {pageTitle}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('categories')}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-5 py-3 font-black text-[#321064] transition hover:-translate-y-1"
            >
              <Plus className="h-5 w-5" />
              إضافة فئة
            </button>
          </div>

          <AdminContent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </section>
    </main>
  );
}

interface AdminContentProps {
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;
}

function AdminContent({
  currentPage,
  setCurrentPage,
}: AdminContentProps) {
  switch (currentPage) {
    case 'dashboard':
      return (
        <DashboardHome setCurrentPage={setCurrentPage} />
      );

    case 'users':
      return (
        <EmptySection
          icon={Users}
          title="إدارة المستخدمين"
          description="ستظهر هنا حسابات العملاء المسجلين في الموقع، وأدوارهم وحالة حساباتهم."
        />
      );

    case 'categories':
      return (
        <EmptySection
          icon={BookOpen}
          title="إدارة الفئات"
          description="من هنا ستضيف الفئات، اسم الفئة، الوصف، الصورة، اللون وحالة التفعيل."
          buttonLabel="إضافة فئة جديدة"
        />
      );

    case 'questions':
      return (
        <EmptySection
          icon={CircleHelp}
          title="إدارة الأسئلة"
          description="من هنا ستضيف السؤال والإجابة والفئة والنقاط والصورة أو الصوت أو الفيديو."
          buttonLabel="إضافة سؤال جديد"
        />
      );

    case 'games':
      return (
        <EmptySection
          icon={Gamepad2}
          title="إدارة الألعاب"
          description="ستظهر هنا الألعاب التي أنشأها المستخدمون، الفرق، النقاط وحالة كل لعبة."
        />
      );

    case 'results':
      return (
        <EmptySection
          icon={Trophy}
          title="نتائج الألعاب"
          description="ستظهر هنا الفرق الفائزة، النتائج النهائية والإحصائيات."
        />
      );

    case 'media':
      return (
        <EmptySection
          icon={Image}
          title="مكتبة الوسائط"
          description="ستدير من هنا صور الفئات وصور الأسئلة وملفات الصوت والفيديو."
          buttonLabel="رفع ملف"
        />
      );

    case 'settings':
      return (
        <EmptySection
          icon={Settings}
          title="إعدادات النظام"
          description="ستتحكم من هنا بعدد الفئات، قيم الأسئلة، مدة المؤقت، وسائل المساعدة وهوية الموقع."
        />
      );

    default:
      return null;
  }
}

interface DashboardHomeProps {
  setCurrentPage: (page: AdminPage) => void;
}

function DashboardHome({
  setCurrentPage,
}: DashboardHomeProps) {
  const stats = [
    {
      label: 'المستخدمون',
      value: '0',
      icon: Users,
      description: 'الحسابات المسجلة',
    },
    {
      label: 'الفئات',
      value: '0',
      icon: BookOpen,
      description: 'الفئات المفعلة',
    },
    {
      label: 'الأسئلة',
      value: '0',
      icon: CircleHelp,
      description: 'إجمالي الأسئلة',
    },
    {
      label: 'الألعاب',
      value: '0',
      icon: Gamepad2,
      description: 'الألعاب المكتملة',
    },
  ];

  const shortcuts = [
    {
      title: 'إضافة فئة',
      description: 'أنشئ فئة جديدة وارفع صورتها.',
      icon: BookOpen,
      page: 'categories' as AdminPage,
    },
    {
      title: 'إضافة سؤال',
      description: 'أضف سؤالًا وإجابة ونقاطًا.',
      icon: CircleHelp,
      page: 'questions' as AdminPage,
    },
    {
      title: 'مشاهدة المستخدمين',
      description: 'راجع حسابات العملاء.',
      icon: Users,
      page: 'users' as AdminPage,
    },
  ];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FACC15] text-[#321064]">
                  <Icon className="h-7 w-7" />
                </div>

                <BarChart3 className="h-5 w-5 text-white/25" />
              </div>

              <strong className="mt-7 block text-4xl font-black">
                {stat.value}
              </strong>

              <h2 className="mt-2 font-black">{stat.label}</h2>

              <p className="mt-1 text-sm text-white/45">
                {stat.description}
              </p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[30px] border border-white/10 bg-white/10 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#FACC15]" />

            <h2 className="text-xl font-black">
              اختصارات الإدارة
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;

              return (
                <button
                  key={shortcut.title}
                  type="button"
                  onClick={() =>
                    setCurrentPage(shortcut.page)
                  }
                  className="rounded-2xl border border-white/10 bg-black/10 p-5 text-right transition hover:border-[#FACC15]/50 hover:bg-white/10"
                >
                  <Icon className="h-7 w-7 text-[#FACC15]" />

                  <h3 className="mt-5 font-black">
                    {shortcut.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {shortcut.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#6D28D9] to-[#321064] p-7">
          <Home className="h-8 w-8 text-[#FACC15]" />

          <h2 className="mt-6 text-2xl font-black">
            الميدان يا حميدان
          </h2>

          <p className="mt-3 leading-8 text-white/60">
            هذه لوحة التحكم الرئيسية. سنربطها في الخطوات
            القادمة مع Supabase لعرض البيانات الحقيقية.
          </p>

          <div className="mt-7 rounded-2xl bg-black/15 p-4">
            <p className="text-sm text-white/50">
              حالة النظام
            </p>

            <div className="mt-2 flex items-center gap-2 font-black text-green-300">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              يعمل بشكل طبيعي
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

interface EmptySectionProps {
  icon: typeof Users;
  title: string;
  description: string;
  buttonLabel?: string;
}

function EmptySection({
  icon: Icon,
  title,
  description,
  buttonLabel,
}: EmptySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[520px] flex-col items-center justify-center rounded-[34px] border border-white/10 bg-white/10 p-8 text-center"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#FACC15] text-[#321064]">
        <Icon className="h-11 w-11" />
      </div>

      <h2 className="mt-7 text-3xl font-black">
        {title}
      </h2>

      <p className="mt-4 max-w-xl leading-8 text-white/55">
        {description}
      </p>

      {buttonLabel && (
        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-6 py-4 font-black text-[#321064] transition hover:-translate-y-1"
        >
          <Plus className="h-5 w-5" />
          {buttonLabel}
        </button>
      )}
    </motion.section>
  );
}
