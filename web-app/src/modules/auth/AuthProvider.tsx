import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginArgs } from 'src/api/admin/types';
import { useLogin } from 'src/api/auth/useLogin';
import { getCookie, setCookie, removeCookie } from 'src/lib/cookies';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  accessToken: string | null;
  refreshToken: string | null;
  logOut: () => void;
  signInWithAdmin: (params: LoginArgs) => Promise<any>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard', { replace: true });
    const tokenCookie = getCookie('accessToken');
    if (tokenCookie) {
      setAccessToken(tokenCookie);
      setIsAuthenticated(true);
    }
  }, []);

  const { mutate: signIn, isLoading } = useLogin({});

  const logOut = useCallback(() => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    navigate(`/signin`, { replace: true });
  }, [navigate]);

  const signInWithAdmin = (params: LoginArgs) => {
    return new Promise((resolve, reject) => {
      signIn(params, {
        onSuccess: (res: {
          data: { accessToken: string; refreshToken: string };
        }) => {
          if (res.data.accessToken && res.data.refreshToken) {
            setCookie('accessToken', res.data.accessToken);
            setCookie('refreshToken', res.data.refreshToken);
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setIsAuthenticated(true);
            resolve(res);
          } else {
            reject(new Error('Access token or refresh token is missing'));
          }
        },
        onError: (error: any) => {
          reject(error);
        },
      });
    });
  };

  useEffect(() => {
    const tokenParam = new URLSearchParams(window.location.search).get(
      'accessToken'
    );
    if (tokenParam) {
      removeCookie('accessToken');
      setCookie('accessToken', tokenParam);
      setAccessToken(tokenParam);
      setIsAuthenticated(true);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('accessToken');
      navigate(`${window.location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        accessToken,
        refreshToken,
        logOut,
        signInWithAdmin,
        loading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
