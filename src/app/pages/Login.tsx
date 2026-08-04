import {
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  CheckCircle2,
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
  const {
    login,
    register,
    sendPasswordReset,
    updatePassword,
  } = useAuth();

  const resetMode = useMemo(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    return params.get('reset-password') === '1';
  }, []);

  const [mode, setMode] = useState<
    'login' | 'register' | 'forgot' | 'reset'
  >(resetMode ? 'reset' : 'login');

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState<FormData>(emptyForm);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] =
    useState('');
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

  const changeMode = (
    nextMode: 'login' | 'register' | 'forgot',
  ) => {
    if (loading) {
      return;
    }

    setMode(nextMode);
    setShowPassword(false);
    setError('');
    setSuccessMessage('');
    setFormData(emptyForm);

    window.requestAnimationFrame(() => {
      emailInputRef.current?.focus({
        preventScroll: true,
      });
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError('');
    setSuccessMessage('');

    const cleanName = formData.name.trim();

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    if (mode === 'forgot') {
      if (!email) {
        setError(
          'أدخل البريد الإلكتروني أولًا.',
        );
        return;
      }

      setLoading(true);

      const result =
        await sendPasswordReset(email);

      setLoading(false);

      if (!result.success) {
        setError(
          result.error ||
            'تعذر إرسال رابط الاستعادة.',
        );
        return;
      }

      setSuccessMessage(
        'تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني. افحص البريد الوارد والرسائل غير المرغوبة.',
      );

      return;
    }

    if (mode === 'reset') {
      if (!password) {
        setError(
          'أدخل كلمة المرور الجديدة.',
        );
        return;
      }

      if (password.length < 6) {
        setError(
          'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
        );
        return;
      }

      if (
        password !==
        formData.confirmPassword
      ) {
        setError(
          'كلمتا المرور غير متطابقتين.',
        );
        return;
      }

      setLoading(true);

      const result =
        await updatePassword(password);

      setLoading(false);

      if (!result.success) {
        setError(
          result.error ||
            'تعذر تحديث كلمة المرور.',
        );
        return;
      }

      window.history.replaceState(
        {},
        '',
        window.location.pathname,
      );

      setSuccessMessage(
        'تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.',
      );

      setFormData(emptyForm);
      setMode('login');

      return;
    }

    if (!email || !password) {
      setError(
        'أدخل البريد الإلكتروني وكلمة المرور.',
      );
      return;
    }

    if (mode === 'register') {
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

      if (
        password !==
        formData.confirmPassword
      ) {
        setError(
          'كلمتا المرور غير متطابقتين.',
        );
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
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
      console.error(
        'Auth error:',
        caughtError,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'حدث خطأ غير متوقع. حاول مرة أخرى.',
      );
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === 'login'
      ? 'تسجيل الدخول'
      : mode === 'register'
        ? 'إنشاء حساب جديد'
        : mode === 'forgot'
          ? 'استعادة كلمة المرور'
          : 'كلمة مرور جديدة';

  const description =
    mode === 'login'
      ? 'سجّل دخولك للوصول إلى ألعابك وبيانات حسابك.'
      : mode === 'register'
        ? 'أنشئ حسابك وابدأ تجهيز ميدانك.'
        : mode === 'forgot'
          ? 'أدخل بريدك وسنرسل لك رابط تغيير كلمة المرور.'
          : 'أدخل كلمة المرور الجديدة لحسابك.';

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
            {title}
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/60">
            {description}
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

        {successMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-400/25 bg-green-500/15 px-4 py-3 text-sm font-bold leading-6 text-green-100">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {mode === 'register' && (
            <Field
              label="الاسم"
              icon={
                <User className="h-5 w-5" />
              }
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
                disabled={loading}
                className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-4 text-base font-bold text-white outline-none placeholder:text-white/35"
              />
            </Field>
          )}

          {mode !== 'reset' && (
            <Field
              label="البريد الإلكتروني"
              icon={
                <Mail className="h-5 w-5" />
              }
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
                disabled={loading}
                className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-4 text-left text-base font-bold text-white outline-none placeholder:text-white/35"
              />
            </Field>
          )}

          {mode !== 'forgot' && (
            <Field
              label={
                mode === 'reset'
                  ? 'كلمة المرور الجديدة'
                  : 'كلمة المرور'
              }
              icon={
                <Lock className="h-5 w-5" />
              }
            >
              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={formData.password}
                onChange={(event) =>
                  updateField(
                    'password',
                    event.target.value,
                  )
                }
                placeholder={
                  mode === 'reset'
                    ? 'أدخل كلمة المرور الجديدة'
                    : 'أدخل كلمة المرور'
                }
                autoComplete={
                  mode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                disabled={loading}
                className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-12 text-base font-bold text-white outline-none placeholder:text-white/35"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-white/45"
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
          )}

          {(mode === 'register' ||
            mode === 'reset') && (
            <Field
              label="تأكيد كلمة المرور"
              icon={
                <Lock className="h-5 w-5" />
              }
            >
              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={
                  formData.confirmPassword
                }
                onChange={(event) =>
                  updateField(
                    'confirmPassword',
                    event.target.value,
                  )
                }
                placeholder="أعد كتابة كلمة المرور"
                autoComplete="new-password"
                disabled={loading}
                className="h-14 w-full touch-manipulation bg-transparent pr-12 pl-4 text-base font-bold text-white outline-none placeholder:text-white/35"
              />
            </Field>
          )}

          {mode === 'login' && (
            <div className="text-left">
              <button
                type="button"
                onClick={() =>
                  changeMode('forgot')
                }
                className="min-h-11 touch-manipulation rounded-lg px-1 py-2 text-sm font-bold text-yellow-400"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full touch-manipulation items-center justify-center gap-3 rounded-2xl bg-yellow-400 text-lg font-black text-[#321064] shadow-[0_5px_0_#8A6400] active:translate-y-0.5 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                {mode === 'login'
                  ? 'تسجيل الدخول'
                  : mode === 'register'
                    ? 'إنشاء الحساب'
                    : mode === 'forgot'
                      ? 'إرسال رابط الاستعادة'
                      : 'حفظ كلمة المرور'}

                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {mode !== 'reset' && (
          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            {mode === 'login' ? (
              <>
                <p className="text-sm text-white/55">
                  ليس لديك حساب؟
                </p>

                <button
                  type="button"
                  onClick={() =>
                    changeMode('register')
                  }
                  className="mt-1 min-h-11 rounded-xl px-4 font-black text-yellow-400"
                >
                  إنشاء حساب جديد
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  changeMode('login')
                }
                className="min-h-11 rounded-xl px-4 font-black text-yellow-400"
              >
                العودة إلى تسجيل الدخول
              </button>
            )}
          </div>
        )}
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
