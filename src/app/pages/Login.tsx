import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSuccess: (role: 'admin' | 'user' | 'wholesale') => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError('أدخل البريد الإلكتروني وكلمة المرور.');
      return;
    }

    if (!isLogin) {
      if (formData.name.trim().length < 2) {
        setError('أدخل اسمًا صحيحًا.');
        return;
      }

      if (password.length < 6) {
        setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
        return;
      }

      if (password !== formData.confirmPassword) {
        setError('كلمتا المرور غير متطابقتين.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);

        if (!success) {
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          return;
        }

        const role =
          email === 'admin@almaydan.com' ? 'admin' : 'user';

        onSuccess(role);
        return;
      }

      const success = await register(
        formData.name.trim(),
        email,
        password,
      );

      if (!success) {
        setError('تعذر إنشاء الحساب. جرّب بريدًا آخر.');
        return;
      }

      onSuccess('user');
    } catch (error) {
      console.error('Auth error:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setError('');

    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#321064] to-[#17052f] px-5 pb-16 pt-28 text-white"
    >
      <div className="absolute right-[-180px] top-[-180px] h-[450px] w-[450px] rounded-full bg-purple-500/30 blur-[120px]" />

      <div className="absolute bottom-[-180px] left-[-140px] h-[420px] w-[420px] rounded-full bg-yellow-400/15 blur-[120px]" />

      <motion.section
        initial={{ opacity: 0, y: 35, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65 }}
        className="relative z-10 w-full max-w-md rounded-[36px] border border-white/15 bg-white/10 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9"
      >
        <div className="text-center">
          <img
            src="/almaydan-logo.png"
            alt="الميدان يا حميدان"
            className="mx-auto h-24 w-24 rounded-[26px] object-cover shadow-xl"
          />

          <p className="mt-6 text-sm font-bold text-yellow-400">
            الميدان يا حميدان
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/60">
            {isLogin
              ? 'سجّل دخولك للوصول إلى ألعابك وبيانات حسابك.'
              : 'أنشئ حسابك وابدأ تجهيز ميدانك.'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {!isLogin && (
            <Field
              label="الاسم"
              icon={<User className="h-5 w-5" />}
            >
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  updateField('name', event.target.value)
                }
                placeholder="أدخل اسمك"
                maxLength={50}
                autoComplete="name"
                className="h-14 w-full bg-transparent pr-12 pl-4 font-bold text-white outline-none placeholder:text-white/35"
              />
            </Field>
          )}

          <Field
            label="البريد الإلكتروني"
            icon={<Mail className="h-5 w-5" />}
          >
            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                updateField('email', event.target.value)
              }
              placeholder="example@email.com"
              autoComplete="email"
              className="h-14 w-full bg-transparent pr-12 pl-4 text-left font-bold text-white outline-none placeholder:text-white/35"
            />
          </Field>

          <Field
            label="كلمة المرور"
            icon={<Lock className="h-5 w-5" />}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(event) =>
                updateField('password', event.target.value)
              }
              placeholder="أدخل كلمة المرور"
              autoComplete={
                isLogin ? 'current-password' : 'new-password'
              }
              className="h-14 w-full bg-transparent pr-12 pl-12 font-bold text-white outline-none placeholder:text-white/35"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-yellow-400"
              aria-label={
                showPassword
                  ? 'إخفاء كلمة المرور'
                  : 'إظهار كلمة المرور'
              }
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </Field>

          {!isLogin && (
            <Field
              label="تأكيد كلمة المرور"
              icon={<Lock className="h-5 w-5" />}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(event) =>
                  updateField(
                    'confirmPassword',
                    event.target.value,
                  )
                }
                placeholder="أعد كتابة كلمة المرور"
                autoComplete="new-password"
                className="h-14 w-full bg-transparent pr-12 pl-4 font-bold text-white outline-none placeholder:text-white/35"
              />
            </Field>
          )}

          {isLogin && (
            <div className="text-left">
              <button
                type="button"
                className="text-sm font-bold text-yellow-400 transition hover:text-yellow-300"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { y: -3, scale: 1.01 }}
            whileTap={loading ? undefined : { scale: 0.98 }}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 text-lg font-black text-[#321064] shadow-[0_15px_45px_rgba(250,204,21,0.2)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'جاري التحميل...'
              : isLogin
                ? 'تسجيل الدخول'
                : 'إنشاء الحساب'}

            {!loading && <ArrowRight className="h-5 w-5" />}
          </motion.button>
        </form>

        <div className="mt-7 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-white/55">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          </p>

          <button
            type="button"
            onClick={toggleMode}
            className="mt-2 font-black text-yellow-400 transition hover:text-yellow-300"
          >
            {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </div>
      </motion.section>
    </main>
  );
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, icon, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-white/70">
        {label}
      </span>

      <div className="relative rounded-2xl border border-white/15 bg-black/15 transition focus-within:border-yellow-400">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </span>

        {children}
      </div>
    </label>
  );
}
