import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '../../utils/supabase';

export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
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
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async (
    userId: string,
    email: string,
    metadataName?: string,
  ): Promise<AppUser> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Profile fetch error:', error);
    }

    return {
      id: userId,
      email,
      name:
        profile?.full_name ||
        metadataName ||
        email.split('@')[0] ||
        'مستخدم',
      role: profile?.role === 'admin' ? 'admin' : 'user',
    };
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
        setLoading(false);
        return;
      }

      const currentUser = await getProfile(
        session.user.id,
        session.user.email || '',
        session.user.user_metadata?.full_name,
      );

      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        const currentUser = await getProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.full_name,
        );

        setUser(currentUser);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<AppUser | null> => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error || !data.user) {
      console.error('Login error:', error);
      return null;
    }

    const currentUser = await getProfile(
      data.user.id,
      data.user.email || '',
      data.user.user_metadata?.full_name,
    );

    setUser(currentUser);

    return currentUser;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<AppUser | null> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
      },
    });

    if (error || !data.user) {
      console.error('Registration error:', error);
      return null;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: data.user.id,
          email: cleanEmail,
          full_name: cleanName,
          role: 'user',
        },
        {
          onConflict: 'id',
        },
      );

    if (profileError) {
      console.error(
        'Profile creation error:',
        profileError,
      );

      return null;
    }

    const newUser: AppUser = {
      id: data.user.id,
      email: cleanEmail,
      name: cleanName,
      role: 'user',
    };

    if (data.session) {
      setUser(newUser);
    }

    return newUser;
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return;
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}
