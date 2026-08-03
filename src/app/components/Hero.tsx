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
      className="relative min-h-[760px] overflow-hidden bg-[linear-gradient(180deg,#35116D_0%,#291052_52%,#210A43_100%)] pt-24 text-white sm:min-h-screen"
    >
      {/* خلفية خفيفة */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(124,58,237,0.10),transparent_38%,rgba(250,204,21,0.04))]" />

      {/* النقاط المتحركة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, index) => (
          <motion.span
            key={index}
            animate={{
              y: [0, -16, 0],
              opacity: [0.18, 0.55, 0.18],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 3.5 + (index % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.18,
            }}
            className="absolute h-2 w-2 rounded-full bg-[#FACC15]"
            style={{
              right: `${7 + ((index * 17) % 86)}%`,
              top: `${10 + ((index * 19) % 76)}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1280px] items-center gap-7 px-5 pb-16 pt-20 sm:px-7 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-12 lg:pt-12">
        {/* النص */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
          className="order-2 text-center lg:order-1 lg:text-right"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-[#FACC15]" />

            <span className="text-sm font-bold sm:text-base">
              لعبة أسئلة وتحديات جماعية
            </span>
          </div>

          <h1 className="mb-7 text-[42px] font-black leading-[1.22] sm:text-6xl lg:text-7xl">
            ادخل الميدان

            <span className="mt-1 block text-[#FACC15]">
              واثبت معلوماتك
            </span>
          </h1>

          <div className="mx-auto grid max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-2 lg:mx-0">
            <motion.button
              type="button"
              onClick={() => onNavigate('play')}
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#FACC15] px-6 text-lg font-black text-[#2E1065] shadow-[0_6px_0_#906900]"
            >
              <CirclePlay className="h-6 w-6" />
              ابدأ اللعبة
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => onNavigate('how')}
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/[0.07] px-6 text-lg font-bold text-white"
            >
              <Trophy className="h-6 w-6 text-[#FACC15]" />
              طريقة اللعب
            </motion.button>
          </div>

          <div className="mt-7 hidden flex-wrap justify-center gap-2.5 text-sm sm:flex lg:justify-start">
            {[
              'فريقان أو أكثر',
              'فئات متنوعة',
              'أسئلة وتحديات',
              'نقاط ونتائج',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 bg-black/10 px-4 py-2 text-white/75"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* اللوجو المتحرك */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          className="order-1 flex justify-center lg:order-2"
        >
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex w-full max-w-[470px] items-center justify-center sm:max-w-[520px]"
          >
            <img
              src="/almaydan-logo.png?v=21"
              alt="الميدان يا حميدان"
              width={680}
              height={480}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="relative z-10 h-auto w-[88%] object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.32)] sm:w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
