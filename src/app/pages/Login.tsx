import {
  type FormEvent,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSuccess: (
    role: 'admin' | 'user' | 'wholesale',
  ) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emptyForm: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Login({
  onSuccess,
}: LoginProps) {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] =
    useState(false);
  const [formData, setFormData] =
    useState<FormData>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailInputRef =
    useRef<HTMLInputElement | null>(null);

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) return;

    setError('');

    const cleanName = formData.name.trim();
    const email = formData.email
      .trim()
      .toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError(
        'أدخل البريد الإلكتروني وكلمة المرور.',
      );
      return;
    }

    if (!isLogin) {
      if (cleanName.length < 2) {
        setError('أدخل اسمًا صحيحًا.');
        return;
      }

      if (password.length < 6) {
        setError(
          'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
        );
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
        const currentUser = await login(
          email,
          password,
        );

        if (!currentUser) {
          setError(
            'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
          );
          return;
        }

        onSuccess(
          currentUser.role === 'admin'
            ? 'admin'
            : 'user',
        );
        return;
      }

      const newUser = await register(
        cleanName,
        email,
        password,
      );

      if (!newUser) {
        setError(
          'تعذر إنشاء الحساب. جرّب بريدًا آخر.',
        );
        return;
      }

      onSuccess('user');
    } catch (caughtError) {
      console.error('Auth error:', caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (loading) return;

    setIsLogin((current) => !current);
    setShowPassword(false);
    setError('');
    setFormData(emptyForm);

    window.requestAnimationFrame(() => {
      emailInputRef.current?.focus({
        preventScroll: true,
      });
    });
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#321064_0%,#241048_55%,#17052F_100%)] px-4 pb-12 pt-28 text-white sm:px-5 sm:pb-16"
    >
      <section className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#28104B] p-5 shadow-[0_14px_38px_rgba(0,0,0,0.24)] sm:rounded-[36px] sm:p-9">
        <div className="text-center">
          <img
            src="/almaydan-logo.png?v=8"
            alt="الميدان يا حميدان"
            width={220}
            height={112}
            loading="eager"
            decoding="async"
            className="mx-auto h-24 w-auto object-contain sm:h-28"
          />

          <h1 className="mt-5 text-3xl font-black">
            {isLogin
              ? 'تسجيل الدخول'
              : 'إنشاء حساب جديد'}
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/60">
            {isLogin
              ? 'سجّل دخولك للوصول إلى ألعابك وبيانات حسابك.'
              : 'أنشئ حسابك وابدأ تجهيز ميدانك.'}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {!isLogin && (
            <Field
              label="الاسم"
              icon={<User className="h-5 w-5" />}
            >
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  updateField(
                    'name',
                    event.target.value,
                  )
                }
                placeholder="أدخل اسمك"
                maxLength={50}
                autoComplete="name"
                enterKeyHint="next"
                disabled={loading}
                className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-4 text-base font-bold text-white outline-none placeholder:text-white/35 disabled:opacity-60"
              />
            </Field>
          )}

          <Field
            label="البريد الإلكتروني"
            icon={<Mail className="h-5 w-5" />}
          >
            <input
              ref={emailInputRef}
              type="email"
              inputMode="email"
              value={formData.email}
              onChange={(event) =>
                updateField(
                  'email',
                  event.target.value,
                )
              }
              placeholder="example@email.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="next"
              disabled={loading}
              className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-4 text-left text-base font-bold text-white outline-none placeholder:text-white/35 disabled:opacity-60"
            />
          </Field>

          <Field
            label="كلمة المرور"
            icon={<Lock className="h-5 w-5" />}
          >
            <input
              type={
                showPassword ? 'text' : 'password'
              }
              value={formData.password}
              onChange={(event) =>
                updateField(
                  'password',
                  event.target.value,
                )
              }
              placeholder="أدخل كلمة المرور"
              autoComplete={
                isLogin
                  ? 'current-password'
                  : 'new-password'
              }
              enterKeyHint={
                isLogin ? 'go' : 'next'
              }
              disabled={loading}
              className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-12 text-base font-bold text-white outline-none placeholder:text-white/35 disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              disabled={loading}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-xl text-white/45 active:bg-white/10 disabled:opacity-50"
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
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={formData.confirmPassword}
                onChange={(event) =>
                  updateField(
                    'confirmPassword',
                    event.target.value,
                  )
                }
                placeholder="أعد كتابة كلمة المرور"
                autoComplete="new-password"
                enterKeyHint="go"
                disabled={loading}
                className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-4 text-base font-bold text-white outline-none placeholder:text-white/35 disabled:opacity-60"
              />
            </Field>
          )}

          {isLogin && (
            <div className="text-left">
              <button
                type="button"
                className="touch-manipulation rounded-lg px-1 py-2 text-sm font-bold text-yellow-400 active:bg-white/5"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full touch-manipulation items-center justify-center gap-3 rounded-2xl bg-yellow-400 text-lg font-black text-[#321064] shadow-[0_5px_0_#8A6400] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                {isLogin
                  ? 'تسجيل الدخول'
                  : 'إنشاء الحساب'}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-5 text-center">
          <p className="text-sm text-white/55">
            {isLogin
              ? 'ليس لديك حساب؟'
              : 'لديك حساب بالفعل؟'}
          </p>

          <button
            type="button"
            onClick={toggleMode}
            disabled={loading}
            className="mt-1 min-h-11 touch-manipulation rounded-xl px-4 font-black text-yellow-400 active:bg-white/5 disabled:opacity-50"
          >
            {isLogin
              ? 'إنشاء حساب جديد'
              : 'تسجيل الدخول'}
          </button>
        </div>
      </section>
    </main>
  );
}

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({
  label,
  icon,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-white/70">
        {label}
      </span>

      <div className="relative rounded-2xl border border-white/15 bg-[#190A33] focus-within:border-yellow-400">
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </span>

        {children}
      </div>
    </label>
  );
}
