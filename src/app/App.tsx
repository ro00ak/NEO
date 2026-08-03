import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import GameSetup from './pages/GameSetup';
import TeamsSetup from './pages/TeamsSetup';
import HelpersSetup from './pages/HelpersSetup';
import GameBoard from './pages/GameBoard';
import QuestionReady from './pages/QuestionReady';

type Page =
  | 'home'
  | 'play'
  | 'how'
  | 'leaderboard'
  | 'login'
  | 'admin'
  | 'teams'
  | 'helpers'
  | 'board'
  | 'question-ready'
  | 'results'
  | 'question';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero onNavigate={handleNavigate} />;
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
        return (
          <div dir="rtl" className="min-h-screen bg-[#2E1065] px-6 pt-32 text-white">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-5xl font-black text-[#FACC15]">
                السؤال الحالي
              </h1>
              <p className="mt-5 text-xl text-white/75">
                عرض نص السؤال والخيارات للفرق...
              </p>
            </div>
          </div>
        );
      case 'results':
        return (
          <div dir="rtl" className="min-h-screen bg-[#2E1065] px-6 pt-32 text-white">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-5xl font-black text-[#FACC15]">
                النتائج النهائية
              </h1>
              <p className="mt-5 text-xl text-white/75">
                تعرف على الفريق الفائز ومجموع النقاط.
              </p>
            </div>
          </div>
        );
      case 'how':
        return (
          <div dir="rtl" className="min-h-screen bg-[#2E1065] px-6 pt-32 text-white">
            <div className="mx-auto max-w-5xl">
              <h1 className="text-center text-5xl font-black text-[#FACC15]">
                طريقة اللعب
              </h1>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {[
                  'اختر 6 فئات',
                  'أدخل أسماء الفرق',
                  'اختاروا الأسئلة واجمعوا النقاط',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/15 bg-white/10 p-8 text-center"
                  >
                    <span className="text-4xl font-black text-[#FACC15]">
                      {index + 1}
                    </span>

                    <p className="mt-4 text-lg font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <div dir="rtl" className="min-h-screen bg-[#2E1065] px-6 pt-32 text-white">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-5xl font-black text-[#FACC15]">
                التصنيفات
              </h1>

              <p className="mt-5 text-xl text-white/75">
                سيتم إضافة أفضل الفرق واللاعبين هنا لاحقًا.
              </p>
            </div>
          </div>
        );
      case 'login':
        return <Login onSuccess={(role) => {
          if (role === 'admin') setCurrentPage('admin');
          else setCurrentPage('home');
        }} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 transition-colors duration-500">
                <Header
                  onNavigate={handleNavigate}
                  onCartClick={() => handleNavigate('cart')}
                />
                <main>{renderPage()}</main>
                {currentPage === 'home' && <Footer />}
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
