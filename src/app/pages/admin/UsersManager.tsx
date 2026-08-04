import {
  CalendarDays,
  Check,
  Crown,
  Gamepad2,
  Loader2,
  Mail,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '../../../utils/supabase';

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string;
  user_role: string;
  created_at: string;
  package_type: string;
  games_remaining: number;
  unlimited: boolean;
}

export default function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] =
    useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    const { data, error: usersError } =
      await supabase.rpc('admin_list_users');

    if (usersError) {
      console.error(
        'Admin users error:',
        usersError,
      );

      setError(
        'تعذر تحميل المستخدمين. تأكد أن حسابك يحمل صلاحية admin.',
      );

      setUsers([]);
      setLoading(false);
      return;
    }

    setUsers(
      (data || []).map((item: AdminUser) => ({
        ...item,
        games_remaining: Number(
          item.games_remaining || 0,
        ),
        unlimited: Boolean(item.unlimited),
      })),
    );

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const cleanSearch = search
      .trim()
      .toLowerCase();

    if (!cleanSearch) {
      return users;
    }

    return users.filter((item) => {
      return (
        item.full_name
          .toLowerCase()
          .includes(cleanSearch) ||
        item.email
          .toLowerCase()
          .includes(cleanSearch)
      );
    });
  }, [search, users]);

  const runUserAction = async (
    userId: string,
    action: () => Promise<{
      error: unknown;
    }>,
    successMessage: string,
  ) => {
    setActionUserId(userId);
    setError('');
    setMessage('');

    const result = await action();

    setActionUserId(null);

    if (result.error) {
      console.error(
        'User action error:',
        result.error,
      );

      setError(
        'تعذر تنفيذ العملية. حاول مرة أخرى.',
      );

      return;
    }

    setMessage(successMessage);
    await loadUsers();
  };

  const addGames = async (
    userId: string,
    amount: number,
  ) => {
    await runUserAction(
      userId,
      async () => {
        const { error } = await supabase.rpc(
          'admin_add_user_games',
          {
            p_user_id: userId,
            p_games: amount,
          },
        );

        return { error };
      },
      `تمت إضافة ${amount} ألعاب بنجاح.`,
    );
  };

  const setGames = async (
    userId: string,
    currentGames: number,
  ) => {
    const answer = window.prompt(
      'اكتب عدد الألعاب الجديد:',
      String(currentGames),
    );

    if (answer === null) {
      return;
    }

    const newGames = Number(answer);

    if (
      !Number.isInteger(newGames) ||
      newGames < 0
    ) {
      setError(
        'اكتب عددًا صحيحًا يساوي صفرًا أو أكثر.',
      );
      return;
    }

    await runUserAction(
      userId,
      async () => {
        const { error } = await supabase.rpc(
          'admin_set_user_games',
          {
            p_user_id: userId,
            p_games: newGames,
          },
        );

        return { error };
      },
      `تم تغيير الرصيد إلى ${newGames} ألعاب.`,
    );
  };

  const toggleGold = async (
    userId: string,
    enabled: boolean,
  ) => {
    await runUserAction(
      userId,
      async () => {
        const { error } = await supabase.rpc(
          'admin_set_gold_package',
          {
            p_user_id: userId,
            p_enabled: enabled,
          },
        );

        return { error };
      },
      enabled
        ? 'تم منح الباقة الذهبية.'
        : 'تم إلغاء الباقة الذهبية.',
    );
  };

  const getPackageLabel = (
    item: AdminUser,
  ) => {
    if (item.user_role === 'admin') {
      return 'مدير';
    }

    if (item.unlimited) {
      return 'الباقة الذهبية';
    }

    if (item.games_remaining === 0) {
      return 'بدون رصيد';
    }

    if (item.games_remaining === 1) {
      return 'متبقي لعبة واحدة';
    }

    if (item.games_remaining === 2) {
      return 'متبقي لعبتان';
    }

    return `متبقي ${item.games_remaining} ألعاب`;
  };

  return (
    <section dir="rtl">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FACC15] text-[#321064]">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-black">
                المستخدمون المسجلون
              </h2>

              <p className="mt-1 text-sm text-white/45">
                العدد: {users.length}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-5 font-black transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-5 w-5 ${
              loading ? 'animate-spin' : ''
            }`}
          />

          تحديث
        </button>
      </div>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="ابحث بالاسم أو البريد الإلكتروني..."
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] pr-12 pl-5 text-white outline-none placeholder:text-white/30 focus:border-[#FACC15]/50"
        />
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/15 px-5 py-4 font-bold text-red-100">
          <X className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {message && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green-400/30 bg-green-500/15 px-5 py-4 font-bold text-green-100">
          <Check className="h-5 w-5 shrink-0" />
          {message}
        </div>
      )}

      {loading ? (
        <div className="mt-6 flex min-h-[420px] items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.05]">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#FACC15]" />

            <p className="mt-4 font-bold text-white/55">
              جاري تحميل المستخدمين...
            </p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="mt-6 flex min-h-[420px] flex-col items-center justify-center rounded-[30px] border border-white/10 bg-white/[0.05] p-8 text-center">
          <Users className="h-16 w-16 text-[#FACC15]" />

          <h3 className="mt-5 text-2xl font-black">
            لا يوجد مستخدمون
          </h3>

          <p className="mt-3 text-white/45">
            لم يتم العثور على حسابات مطابقة.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {filteredUsers.map((item) => {
            const isWorking =
              actionUserId === item.user_id;

            const isAdmin =
              item.user_role === 'admin';

            return (
              <article
                key={item.user_id}
                className={`relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(0,0,0,0.16)] ${
                  item.unlimited || isAdmin
                    ? 'border-[#FACC15]/35 bg-gradient-to-br from-[#4A350D]/50 to-white/[0.06]'
                    : 'border-white/10 bg-white/[0.06]'
                }`}
              >
                {isWorking && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#16052f]/75">
                    <Loader2 className="h-9 w-9 animate-spin text-[#FACC15]" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
                      item.unlimited || isAdmin
                        ? 'bg-[#FACC15] text-[#321064]'
                        : 'bg-white/10 text-[#FACC15]'
                    }`}
                  >
                    {item.unlimited || isAdmin ? (
                      <Crown className="h-8 w-8" />
                    ) : (
                      <UserRound className="h-8 w-8" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-xl font-black">
                        {item.full_name}
                      </h3>

                      {isAdmin && (
                        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-black text-purple-200">
                          مدير
                        </span>
                      )}

                      {item.unlimited &&
                        !isAdmin && (
                          <span className="rounded-full bg-[#FACC15] px-3 py-1 text-[10px] font-black text-[#321064]">
                            ذهبية
                          </span>
                        )}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                      <Mail className="h-4 w-4 shrink-0" />

                      <span className="truncate">
                        {item.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <Gamepad2 className="h-5 w-5 text-[#FACC15]" />

                    <p className="mt-3 text-xs text-white/40">
                      حالة الباقة
                    </p>

                    <p
                      className={`mt-1 font-black ${
                        item.unlimited || isAdmin
                          ? 'text-[#FACC15]'
                          : ''
                      }`}
                    >
                      {getPackageLabel(item)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <CalendarDays className="h-5 w-5 text-[#FACC15]" />

                    <p className="mt-3 text-xs text-white/40">
                      تاريخ التسجيل
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {new Intl.DateTimeFormat(
                        'ar-OM',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        },
                      ).format(
                        new Date(item.created_at),
                      )}
                    </p>
                  </div>
                </div>

                {!isAdmin && (
                  <div className="mt-5 border-t border-white/10 pt-5">
                    <p className="mb-3 text-xs font-bold text-white/40">
                      إدارة الرصيد
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addGames(
                            item.user_id,
                            1,
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-green-400/25 bg-green-500/15 px-2 text-xs font-black text-green-200"
                      >
                        <Plus className="h-4 w-4" />
                        لعبة
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addGames(
                            item.user_id,
                            5,
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-blue-400/25 bg-blue-500/15 px-2 text-xs font-black text-blue-200"
                      >
                        <Plus className="h-4 w-4" />
                        5 ألعاب
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setGames(
                            item.user_id,
                            item.games_remaining,
                          )
                        }
                        className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/[0.07] px-2 text-xs font-black"
                      >
                        <Minus className="h-4 w-4" />
                        تحديد
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleGold(
                          item.user_id,
                          !item.unlimited,
                        )
                      }
                      className={`mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl font-black ${
                        item.unlimited
                          ? 'border border-red-400/25 bg-red-500/15 text-red-200'
                          : 'bg-gradient-to-b from-[#FFE06A] to-[#D99A00] text-[#321064] shadow-[0_4px_0_#825C00]'
                      }`}
                    >
                      {item.unlimited ? (
                        <>
                          <X className="h-5 w-5" />
                          إلغاء الباقة الذهبية
                        </>
                      ) : (
                        <>
                          <Crown className="h-5 w-5" />
                          منح الباقة الذهبية
                        </>
                      )}
                    </button>
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-5 flex items-center gap-2 rounded-2xl border border-purple-400/20 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-200">
                    <ShieldCheck className="h-5 w-5" />
                    حساب إداري بصلاحيات كاملة
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
