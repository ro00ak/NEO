import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Swords,
} from 'lucide-react';

interface HelpersSetupProps {
  onNavigate: (page: string) => void;
}

const helpers = [
  {
    id: 'two-answers',
    name: 'إجابتان',
    description: 'تساعدك في تضييق خيارات الإجابة.',
    icon: CircleHelp,
  },
  {
    id: 'phone',
    name: 'اتصال بصديق',
    description: 'يتم إيقاف المؤقت مؤقتًا للاتصال بصديق.',
    icon: Phone,
  },
  {
    id: 'replace',
    name: 'تبديل السؤال',
    description: 'استبدل السؤال بسؤال آخر من نفس الفئة.',
    icon: RefreshCw,
  },
  {
    id: 'second-chance',
    name: 'فرصة ثانية',
    description: 'محاولة إضافية بعد الإجابة الخاطئة.',
    icon: ShieldCheck,
  },
  {
    id: 'steal',
    name: 'سرقة السؤال',
    description: 'انتزع فرصة الإجابة من الفريق المنافس.',
    icon: Swords,
  },
];

export default function HelpersSetup({
  onNavigate,
}: HelpersSetupProps) {
  const [teamOneHelpers, setTeamOneHelpers] = useState<string[]>([]);
  const [teamTwoHelpers, setTeamTwoHelpers] = useState<string[]>([]);

  const toggleHelper = (
    helperId: string,
    selected: string[],
    setSelected: (value: string[]) => void,
  ) => {
    if (selected.includes(helperId)) {
      setSelected(selected.filter((id) => id !== helperId));
      return;
    }

    if (selected.length >= 3) {
      return;
    }

    setSelected([...selected, helperId]);
  };

  const canContinue =
    teamOneHelpers.length === 3 && teamTwoHelpers.length === 3;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#1d073d] px-5 pb-20 pt-32 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            الخطوة الثالثة
          </span>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            وسائل المساعدة
          </h1>

          <p className="mt-4 text-lg text-white/70">
            اختر 3 وسائل مساعدة لكل فريق
          </p>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-2">
          <TeamHelpers
            title="الفريق الأول"
            selected={teamOneHelpers}
            onToggle={(helperId) =>
              toggleHelper(
                helperId,
                teamOneHelpers,
                setTeamOneHelpers,
              )
            }
          />

          <TeamHelpers
            title="الفريق الثاني"
            selected={teamTwoHelpers}
            onToggle={(helperId) =>
              toggleHelper(
                helperId,
                teamTwoHelpers,
                setTeamTwoHelpers,
              )
            }
          />
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate('teams')}
            className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black transition hover:bg-white/15"
          >
            رجوع
          </button>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => onNavigate('board')}
            className="inline-flex min-w-64 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-black text-[#321064] transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ابدأ الميدان
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

interface TeamHelpersProps {
  title: string;
  selected: string[];
  onToggle: (helperId: string) => void;
}

function TeamHelpers({
  title,
  selected,
  onToggle,
}: TeamHelpersProps) {
  return (
    <section className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">{title}</h2>

        <span className="rounded-full bg-yellow-400 px-4 py-1 font-black text-[#321064]">
          {selected.length} / 3
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        {helpers.map((helper) => {
          const Icon = helper.icon;
          const isSelected = selected.includes(helper.id);

          return (
            <motion.button
              key={helper.id}
              type="button"
              onClick={() => onToggle(helper.id)}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-4 rounded-2xl border p-5 text-right transition ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-400/15'
                  : 'border-white/10 bg-black/10 hover:border-white/30'
              }`}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                  isSelected
                    ? 'bg-yellow-400 text-[#321064]'
                    : 'bg-white/10 text-white'
                }`}
              >
                <Icon className="h-7 w-7" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-black">
                  {helper.name}
                </h3>

                <p className="mt-1 text-sm leading-6 text-white/60">
                  {helper.description}
                </p>
              </div>

              {isSelected && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-[#321064]">
                  <Check className="h-5 w-5" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
