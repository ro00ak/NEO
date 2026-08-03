import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Sparkles, Users } from 'lucide-react';

interface TeamsSetupProps {
  onNavigate: (page: string) => void;
}

const teamColors = [
  '#FACC15',
  '#22C55E',
  '#3B82F6',
  '#EF4444',
  '#F97316',
  '#EC4899',
];

export default function TeamsSetup({ onNavigate }: TeamsSetupProps) {
  const [firstTeamName, setFirstTeamName] = useState('الفريق الأول');
  const [secondTeamName, setSecondTeamName] = useState('الفريق الثاني');

  const [firstTeamColor, setFirstTeamColor] = useState(teamColors[0]);
  const [secondTeamColor, setSecondTeamColor] = useState(teamColors[2]);

  const canContinue =
    firstTeamName.trim().length >= 2 &&
    secondTeamName.trim().length >= 2 &&
    firstTeamName.trim() !== secondTeamName.trim();

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#321064] to-[#1d073d] px-5 pb-20 pt-32 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            الخطوة الثانية
          </span>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            جهّز الفرق
          </h1>

          <p className="mt-4 text-lg text-white/70">
            اختر أسماء الفرق وألوانها قبل بداية المنافسة
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <TeamCard
            title="الفريق الأول"
            name={firstTeamName}
            setName={setFirstTeamName}
            selectedColor={firstTeamColor}
            setSelectedColor={setFirstTeamColor}
          />

          <TeamCard
            title="الفريق الثاني"
            name={secondTeamName}
            setName={setSecondTeamName}
            selectedColor={secondTeamColor}
            setSelectedColor={setSecondTeamColor}
          />
        </div>

        {firstTeamName.trim() === secondTeamName.trim() &&
          firstTeamName.trim().length > 0 && (
            <p className="mt-6 text-center font-bold text-red-300">
              يجب أن يكون اسم كل فريق مختلفًا
            </p>
          )}

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate('play')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black transition hover:bg-white/15"
          >
            رجوع
          </button>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => onNavigate('helpers')}
            className="inline-flex min-w-64 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-black text-[#321064] transition enabled:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            متابعة لوسائل المساعدة
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

interface TeamCardProps {
  title: string;
  name: string;
  setName: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
}

function TeamCard({
  title,
  name,
  setName,
  selectedColor,
  setSelectedColor,
}: TeamCardProps) {
  return (
    <motion.section
      whileHover={{ y: -5 }}
      className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-[#321064]"
          style={{ backgroundColor: selectedColor }}
        >
          <Shield className="h-7 w-7" />
        </div>

        <div>
          <p className="text-sm text-white/55">إعدادات</p>
          <h2 className="text-2xl font-black">{title}</h2>
        </div>
      </div>

      <label className="mt-8 block text-sm font-bold text-white/70">
        اسم الفريق
      </label>

      <div className="relative mt-3">
        <Users className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />

        <input
          type="text"
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
          className="h-14 w-full rounded-2xl border border-white/15 bg-black/15 pr-12 pl-4 text-lg font-bold outline-none transition focus:border-yellow-400"
        />
      </div>

      <p className="mt-2 text-left text-xs text-white/40">
        {name.length} / 24
      </p>

      <p className="mt-7 text-sm font-bold text-white/70">
        لون الفريق
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {teamColors.map((color) => {
          const isSelected = color === selectedColor;

          return (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`h-12 w-12 rounded-2xl border-4 transition ${
                isSelected
                  ? 'scale-110 border-white'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`اختيار اللون ${color}`}
            />
          );
        })}
      </div>

      <div
        className="mt-8 rounded-2xl p-5 text-center font-black text-[#321064]"
        style={{ backgroundColor: selectedColor }}
      >
        {name || title}
      </div>
    </motion.section>
  );
}
