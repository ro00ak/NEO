import {
  CalendarDays,
  Gamepad2,
  LogOut,
  Mail,
  ShieldCheck,
  Trophy,
  UserRound,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

interface AccountProps {
  onNavigate: (page: string) => void;
}

export default function Account({
  onNavigate,
}: AccountProps) {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  if (!user) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-[#321064] to-[#1D073D] px-5 pb-20 pt-36 text-white"
      >
        <div className="mx-auto max-w-4xl rounded-[30px] border border-white/10 bg-white/10 p-10 text-center">
          <UserRound className="mx-auto h-14 w-14 text-[#FACC15]" />

          <h1 className="mt-5 text-3xl font-black">
            سجل الدخول أولًا
          </h1>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="mt-6 rounded-2xl bg-[#FACC15] px-8 py-4 font-black text-[#321064]"
          >
            تسجيل الدخول
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#1D073D] px-5 pb-20 pt-36 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-right">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-[#FACC15] bg-[#FACC15]/15">
              <UserRound className="h-12 w-12 text-[#FACC15]" />
            </div>

            <div>
              <p className="text-sm font-bold text-white/50">
                مرحبًا بك
              </p>

              <h1 className="mt-2 text-4xl font-black text-[#FACC15]">
                {user.name}
              </h1>

              <p className="mt-2 text-white/60">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={Mail}
              label="البريد الإلكتروني"
              value={user.email}
            />

            <InfoCard
              icon={ShieldCheck}
              label="نوع الحساب"
              value={isAdmin ? 'مدير' : 'مستخدم'}
            />

            <InfoCard
              icon={Gamepad2}
              label="الألعاب"
              value="0"
            />

            <InfoCard
              icon={Trophy}
              label="مرات الفوز"
              value="0"
            />
          </div>

          <div className="mt-8 rounded-[26px] border border-white/10 bg-black/15 p-5">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-[#FACC15]" />

              <div>
                <h2 className="font-black">
                  نشاط الحساب
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  ستظهر هنا الألعاب السابقة والنتائج عند ربط نظام النتائج.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate('play')}
              className="flex-1 rounded-2xl bg-[#FACC15] px-6 py-4 font-black text-[#321064]"
            >
              ابدأ لعبة جديدة
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/15 px-6 py-4 font-black text-red-200"
            >
              <LogOut className="h-5 w-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

interface InfoCardProps {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/15 p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FACC15]/15 text-[#FACC15]">
        <Icon className="h-6 w-6" />
      </div>

      <p className="mt-4 text-sm text-white/45">
        {label}
      </p>

      <p className="mt-2 truncate font-black">
        {value}
      </p>
    </div>
  );
}
