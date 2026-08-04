import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '../../utils/supabase';

export type UserRole = 'admin' | 'user';

export interface GameEntitlement {
  packageType:
    | 'none'
    | 'one-game'
    | 'two-games'
    | 'five-games'
    | 'eight-games'
    | 'full-game';
  gamesRemaining: number;
  unlimited: boolean;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface ConsumeGameResult {
  success: boolean;
  code?: 'login_required' | 'no_games' | string;
  message?: string;
  unlimited?: boolean;
  gamesRemaining?: number | null;
}

interface CreatePurchaseResult {
  success: boolean;
  purchaseId?: string;
  error?: string;
}

interface BasicResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: AppUser | null;
  entitlement: GameEntitlement;
  loading: boolean;
  entitlementLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<AppUser | null>;

  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AppUser | null>;

  logout: () => Promise<void>;

  sendPasswordReset: (
    email: string,
  ) => Promise<BasicResult>;

  updatePassword: (
    password: string,
  ) => Promise<BasicResult>;

  refreshEntitlement: () => Promise<void>;

  consumeGame: () => Promise<ConsumeGameResult>;

  createPackagePurchase: (
    packageId: string,
    amountOmr: number,
  ) => Promise<CreatePurchaseResult>;

  isAdmin: boolean;
}

const emptyEntitlement: GameEntitlement = {
  packageType: 'none',
  gamesRemaining: 0,
  unlimited: false,
};

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AppUser | null>(null);

  const [entitlement, setEntitlement] =
    useState<GameEntitlement>(
      emptyEntitlement,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    entitlementLoading,
    setEntitlementLoading,
  ] = useState(false);

  const getProfile = async (
    userId: string,
    email: string,
    metadataName?: string,
  ): Promise<AppUser> => {
    const {
      data: profile,
      error,
    } = await supabase
      .from('profiles')
      .select(
        'id, email, full_name, role',
      )
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error(
        'Profile fetch error:',
        error,
      );
    }

    return {
      id: userId,
      email,
      name:
        profile?.full_name ||
        metadataName ||
        email.split('@')[0] ||
        'مستخدم',
      role:
        profile?.role === 'admin'
          ? 'admin'
          : 'user',
    };
  };

  const getEntitlement = async (
    userId: string,
    role: UserRole,
  ): Promise<GameEntitlement> => {
    if (role === 'admin') {
      return {
        packageType: 'full-game',
        gamesRemaining: 0,
        unlimited: true,
      };
    }

    const {
      data,
      error,
    } = await supabase
      .from('game_entitlements')
      .select(
        'package_type, games_remaining, unlimited',
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error(
        'Entitlement fetch error:',
        error,
      );

      return emptyEntitlement;
    }

    return {
      packageType:
        (data?.package_type as GameEntitlement['packageType']) ||
        'none',

      gamesRemaining: Number(
        data?.games_remaining || 0,
      ),

      unlimited: Boolean(
        data?.unlimited,
      ),
    };
  };

  const loadCurrentUser = async (
    userId: string,
    email: string,
    metadataName?: string,
  ) => {
    const currentUser =
      await getProfile(
        userId,
        email,
        metadataName,
      );

    const currentEntitlement =
      await getEntitlement(
        userId,
        currentUser.role,
      );

    setUser(currentUser);

    setEntitlement(
      currentEntitlement,
    );

    return currentUser;
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!session?.user) {
        setUser(null);

        setEntitlement(
          emptyEntitlement,
        );

        setLoading(false);

        return;
      }

      await loadCurrentUser(
        session.user.id,
        session.user.email || '',
        session.user.user_metadata
          ?.full_name,
      );

      if (isMounted) {
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session?.user) {
            setUser(null);

            setEntitlement(
              emptyEntitlement,
            );

            setLoading(false);

            return;
          }

          window.setTimeout(
            async () => {
              await loadCurrentUser(
                session.user.id,
                session.user.email ||
                  '',
                session.user
                  .user_metadata
                  ?.full_name,
              );

              if (isMounted) {
                setLoading(false);
              }
            },
            0,
          );
        },
      );

    return () => {
      isMounted = false;

      subscription.unsubscribe();
    };
  }, []);

  const refreshEntitlement =
    async () => {
      if (!user) {
        setEntitlement(
          emptyEntitlement,
        );

        return;
      }

      setEntitlementLoading(true);

      try {
        const currentEntitlement =
          await getEntitlement(
            user.id,
            user.role,
          );

        setEntitlement(
          currentEntitlement,
        );
      } finally {
        setEntitlementLoading(false);
      }
    };

  /*
   * إرسال رابط استعادة كلمة المرور
   */
  const sendPasswordReset = async (
    email: string,
  ): Promise<BasicResult> => {
    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (!cleanEmail) {
      return {
        success: false,
        error:
          'أدخل البريد الإلكتروني أولًا.',
      };
    }

    /*
     * نستخدم رابط الموقع الحقيقي مباشرة
     * حتى لا يرجع إلى localhost.
     */
    const redirectTo =
      'https://medanyahmedan.me/?reset-password=1';

    const { error } =
      await supabase.auth
        .resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo,
          },
        );

    if (error) {
      console.error(
        'Password reset error:',
        error,
      );

      return {
        success: false,
        error:
          'تعذر إرسال رابط الاستعادة. حاول مرة أخرى.',
      };
    }

    return {
      success: true,
    };
  };

  /*
   * تحديث كلمة المرور بعد فتح الرابط من البريد
   */
  const updatePassword = async (
    password: string,
  ): Promise<BasicResult> => {
    if (password.length < 6) {
      return {
        success: false,
        error:
          'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
      };
    }

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      console.error(
        'Update password error:',
        error,
      );

      return {
        success: false,
        error:
          'تعذر تحديث كلمة المرور. افتح أحدث رابط وصلك في البريد.',
      };
    }

    return {
      success: true,
    };
  };

  const consumeGame =
    async (): Promise<ConsumeGameResult> => {
      if (!user) {
        return {
          success: false,
          code: 'login_required',
          message:
            'يجب تسجيل الدخول أولًا',
        };
      }

      const {
        data,
        error,
      } = await supabase.rpc(
        'consume_game',
      );

      if (error) {
        console.error(
          'Consume game error:',
          error,
        );

        return {
          success: false,
          message:
            'تعذر بدء اللعبة، حاول مرة أخرى.',
        };
      }

      const result = data as {
        success?: boolean;
        code?: string;
        message?: string;
        unlimited?: boolean;
        games_remaining?:
          | number
          | null;
      };

      if (result.success) {
        setEntitlement(
          (current) => ({
            ...current,

            unlimited:
              result.unlimited ??
              current.unlimited,

            gamesRemaining:
              typeof result.games_remaining ===
              'number'
                ? result.games_remaining
                : current.gamesRemaining,
          }),
        );
      }

      return {
        success: Boolean(
          result.success,
        ),

        code: result.code,

        message: result.message,

        unlimited:
          result.unlimited,

        gamesRemaining:
          result.games_remaining,
      };
    };

  const createPackagePurchase =
    async (
      packageId: string,
      amountOmr: number,
    ): Promise<CreatePurchaseResult> => {
      if (!user) {
        return {
          success: false,
          error:
            'يجب تسجيل الدخول أولًا',
        };
      }

      const {
        data,
        error,
      } = await supabase
        .from('package_purchases')
        .insert({
          user_id: user.id,
          package_id: packageId,
          amount_omr: amountOmr,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        console.error(
          'Create package purchase error:',
          error,
        );

        return {
          success: false,
          error:
            'تعذر إنشاء طلب الشراء.',
        };
      }

      return {
        success: true,
        purchaseId: data.id,
      };
    };

  const login = async (
    email: string,
    password: string,
  ): Promise<AppUser | null> => {
    const {
      data,
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email: email
            .trim()
            .toLowerCase(),

          password,
        });

    if (
      error ||
      !data.user
    ) {
      console.error(
        'Login error:',
        error,
      );

      return null;
    }

    return loadCurrentUser(
      data.user.id,
      data.user.email || '',
      data.user.user_metadata
        ?.full_name,
    );
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<AppUser | null> => {
    const cleanName =
      name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const response =
      await supabase.auth.signUp({
        email: cleanEmail,

        password,

        options: {
          data: {
            full_name:
              cleanName,
          },

          emailRedirectTo:
            'https://medanyahmedan.me',
        },
      });

    if (response.error) {
      throw new Error(
        response.error.message,
      );
    }

    if (!response.data.user) {
      throw new Error(
        'لم يُرجع Supabase مستخدمًا.',
      );
    }

    const newUser: AppUser = {
      id: response.data.user.id,

      email:
        response.data.user.email ||
        cleanEmail,

      name: cleanName,

      role: 'user',
    };

    if (response.data.session) {
      setUser(newUser);

      const currentEntitlement =
        await getEntitlement(
          newUser.id,
          newUser.role,
        );

      setEntitlement(
        currentEntitlement,
      );
    }

    return newUser;
  };

  const logout =
    async (): Promise<void> => {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          'Logout error:',
          error,
        );

        return;
      }

      setUser(null);

      setEntitlement(
        emptyEntitlement,
      );
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        entitlement,
        loading,
        entitlementLoading,
        login,
        register,
        logout,

        sendPasswordReset,
        updatePassword,

        refreshEntitlement,
        consumeGame,
        createPackagePurchase,

        isAdmin:
          user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}
