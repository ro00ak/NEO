import { motion } from 'motion/react';
import {
  ArrowLeft,
  CirclePlay,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({
  onNavigate,
}: HeroProps) {
  return (
    <section
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#2E1065] pt-24 text-white"
    >
      {/* الخلفية */}
      <div className="absolute inset-0">
        <div className="absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#7C3AED]/40 blur-[100px]" />

        <div className="absolute bottom-[-220px] left-[-150px] h-[520px] w-[520px] rounded-full bg-[#EAB308]/20 blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A855F7]/20 blur-[130px]" />
      </div>

      {/* الزخارف */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(14)].map((_, index) => (
          <motion.span
            key={index}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 12, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 4 + (index % 4),
              repeat: Infinity,
              delay: index * 0.2,
            }}
            className="absolute h-3 w-3 rotate-45 rounded-sm bg-[#FACC15]"
            style={{
              right: `${5 + ((index * 13) % 90)}%`,
              top: `${8 + ((index * 17) % 80)}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-[1400px] items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-12">
        {/* النص */}
        <motion.div
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="order-2 text-center lg:order-1 lg:text-right"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-xl">
            <Sparkles className="h-5 w-5 text-[#FACC15]" />

            <span className="font-bold">
              لعبة أسئلة وتحديات جماعية
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            ادخل الميدان

            <span className="mt-2 block text-[#FACC15]">
              واثبت معلوماتك
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-9 text-white/75 sm:text-xl lg:mx-0">
            اختر الفئات، كوّن الفرق، وابدأ التحدي مع
            أصحابك في تجربة مليئة بالأسئلة والحماس
            والمنافسة.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <motion.button
              type="button"
              onClick={() => onNavigate('play')}
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#FACC15] px-8 py-4 text-lg font-black text-[#2E1065] shadow-[0_15px_40px_rgba(250,204,21,0.25)]"
            >
              <CirclePlay className="h-6 w-6" />

              ابدأ اللعبة

              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-xl hover:bg-white/15"
            >
              <Trophy className="h-6 w-6 text-[#FACC15]" />

              طريقة اللعب
            </motion.button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm lg:justify-start">
            {[
              'فريقان أو أكثر',
              'فئات متنوعة',
              'أسئلة وتحديات',
              'نقاط ونتائج',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-black/15 px-4 py-2 text-white/80"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* اللوجو */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
            rotate: 4,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            type: 'spring',
            stiffness: 90,
          }}
          className="order-1 flex justify-center lg:order-2"
        >
          <motion.div
            animate={{
              y: [0, -14, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-full max-w-[560px]"
          >
            <div className="absolute inset-10 rounded-[50px] bg-[#A855F7]/40 blur-[70px]" />

            <div className="relative overflow-hidden rounded-[48px] border border-white/20 bg-gradient-to-br from-[#7C3AED] via-[#5B21B6] to-[#2E1065] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <img
                src="/almaydan-logo"
                alt="الميدان يا حميدان"
                className="aspect-square w-full rounded-[36px] object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
