import { useState } from 'react';
import { ThemeProvider } from 'next-themes';

import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';

import Header from './components/Header';
import Hero from './components/Hero';
import HelpersShowcase from './components/HelpersShowcase';
import Footer from './components/Footer';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

import GameSetup from './pages/GameSetup';
import TeamsSetup from './pages/TeamsSetup';
import HelpersSetup from './pages/HelpersSetup';
import GameBoard from './pages/GameBoard';
import QuestionReady from './pages/QuestionReady';
import Question from './pages/Question';
import Answer from './pages/Answer';

type Page =
  | 'home'
  | 'play'
  | 'teams'
  | 'helpers'
  | 'board'
  | 'question-ready'
  | 'question'
  | 'answer'
  | 'results'
  | 'how'
  | 'leaderboard'
  | 'login'
  | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <HelpersShowcase />
          </>
        );

      case 'play':
        return <GameSetup onNavigate={handleNavigate} />;

      case 'teams':
        return <TeamsSetup onNavigate={handleNavigate} />;

      case 'helpers':
        return <HelpersSetup onNavigate={handleNavigate} />;

      case 'board':
        return <GameBoard onNavigate={handleNavigate} />;

      case 'question-ready':
        return <QuestionReady onNavigate={handleNavigate} />;

      case 'question':
        return <Question onNavigate={handleNavigate} />;

      case 'answer':
        return <Answer onNavigate={handleNavigate} />;

      case 'results':
        return (
          <main
            dir="rtl"
            className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052f] px-6 pb-20 pt-32 text-white"
          >
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-lg font-bold text-white/55">
                انتهت المنافسة
              </p>

              <h1 className="mt-4 text-5xl font-black text-[#FACC15] sm:text-7xl">
                النتائج النهائية
              </h1>

              <p className="mt-5 text-xl text-white/75">
                ستظهر هنا أسماء الفرق، مجموع النقاط، والفريق الفائز.
              </p>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <div className="rounded-[32px] border border-white/15 bg-white/10 p-8">
                  <p className="text-white/55">الفريق الأول</p>

                  <strong className="mt-4 block text-5xl font-black">
                    0
                  </strong>

                  <span className="mt-2 block text-sm text-white/45">
                    نقطة
                  </span>
                </div>

                <div className="rounded-[32px] border border-white/15 bg-white/10 p-8">
                  <p className="text-white/55">الفريق الثاني</p>

                  <strong className="mt-4 block text-5xl font-black">
                    0
                  </strong>

                  <span className="mt-2 block text-sm text-white/45">
                    نقطة
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="mt-10 rounded-2xl bg-[#FACC15] px-9 py-4 text-lg font-black text-[#321064] transition hover:-translate-y-1"
              >
                العودة للرئيسية
              </button>
            </div>
          </main>
        );

      case 'how':
        return (
          <main
            dir="rtl"
            id="how-it-works"
            className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052f] px-6 pb-20 pt-32 text-white"
          >
            <div className="mx-auto max-w-6xl">
              <div className="text-center">
                <p className="text-lg font-bold text-white/55">
                  خطوات بسيطة
                </p>

                <h1 className="mt-4 text-5xl font-black text-[#FACC15] sm:text-7xl">
                  طريقة اللعب
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
                  جهز الفرق، اختر الفئات، ثم ابدأ المنافسة واجمع أعلى
                  عدد من النقاط.
                </p>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: 'اختر الفئات',
                    description: 'اختر الفئات التي تريد اللعب بها.',
                  },
                  {
                    title: 'جهز الفرق',
                    description: 'أدخل أسماء الفرق واختر ألوانها.',
                  },
                  {
                    title: 'اختر السؤال',
                    description: 'اختر قيمة السؤال من لوحة اللعب.',
                  },
                  {
                    title: 'اجمع النقاط',
                    description: 'الفريق صاحب أعلى نقاط يفوز.',
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/15 bg-white/10 p-7 text-center"
                  >
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FACC15] text-2xl font-black text-[#321064]">
                      {index + 1}
                    </span>

                    <h2 className="mt-5 text-xl font-black">
                      {item.title}
                    </h2>

                    <p className="mt-3 leading-7 text-white/60">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => handleNavigate('play')}
                  className="rounded-2xl bg-[#FACC15] px-9 py-4 text-lg font-black text-[#321064] transition hover:-translate-y-1"
                >
                  ابدأ اللعب
                </button>
              </div>
            </div>
          </main>
        );

      case 'leaderboard':
        return (
          <main
            dir="rtl"
            className="min-h-screen bg-gradient-to-b from-[#321064] to-[#17052f] px-6 pb-20 pt-32 text-white"
          >
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-lg font-bold text-white/55">
                الأفضل في الميدان
              </p>

              <h1 className="mt-4 text-5xl font-black text-[#FACC15] sm:text-7xl">
                التصنيفات
              </h1>

              <p className="mt-5 text-xl text-white/70">
                ستظهر هنا أفضل الفرق واللاعبين بعد ربط قاعدة البيانات.
              </p>

              <div className="mt-12 rounded-[32px] border border-white/15 bg-white/10 p-10">
                <p className="text-lg font-bold text-white/45">
                  لا توجد نتائج حتى الآن
                </p>
              </div>
            </div>
          </main>
        );

      case 'login':
        return (
          <Login
            onSuccess={(role) => {
              if (role === 'admin') {
                setCurrentPage('admin');
              } else {
                setCurrentPage('home');
              }
            }}
          />
        );

      case 'admin':
        return <AdminDashboard />;

      default:
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <HelpersShowcase />
          </>
        );
    }
  };

  const showHeader = ![
    'board',
    'question-ready',
    'question',
    'answer',
  ].includes(currentPage);

  const showFooter = currentPage === 'home';

  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
            >
              <div className="min-h-screen bg-[#2E1065]">
                {showHeader && (
                  <Header onNavigate={handleNavigate} />
                )}

                {renderPage()}

                {showFooter && <Footer />}
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
