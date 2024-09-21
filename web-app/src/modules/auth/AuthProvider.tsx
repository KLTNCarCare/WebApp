import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginArgs } from 'src/api/admin/types';
import { useLogin } from 'src/api/auth/useLogin';
import { DefaultQueryError } from 'src/api/type';
import { getCookie } from 'src/lib/cookies';
import {
  ACCESS_TOKEN_KEY,
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  storeAccessToken,
  storeRefreshToken,
} from 'src/lib/token';

export interface AuthContextProps {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  logOut: () => void;
  signInWithAdmin: (param: LoginArgs) => Promise<unknown>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  logOut: () => {},
  signInWithAdmin: () => new Promise(() => {}),
  loading: false,
});

export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get(ACCESS_TOKEN_KEY);
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshToken()
  );

  const tokenCookie = getCookie(ACCESS_TOKEN_KEY);

  const isAuthenticated = useMemo(
    () => !!accessToken && !!tokenCookie,
    [accessToken, tokenCookie]
  );

  const { mutate: signIn, isLoading } = useLogin({});

  const logOut = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
    setAccessToken(null);
    setRefreshToken(null);
    navigate(`/signin`, { replace: true });
  }, [navigate]);
  const signInWithAdmin = (params: LoginArgs) => {
    return new Promise((resolve, reject) => {
      signIn(params, {
        onSuccess: (res: {
          data: { accessToken: string; refreshToken: string };
        }) => {
          console.log('Login successful:', res);
          console.log('Access Token:', res.data.accessToken);
          console.log('Refresh Token:', res.data.refreshToken);

          if (res.data.accessToken && res.data.refreshToken) {
            storeAccessToken(res.data.accessToken);
            storeRefreshToken(res.data.refreshToken);
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            resolve(res);
          } else {
            console.error('Access token or refresh token is missing');
            reject(new Error('Access token or refresh token is missing'));
          }
        },
        onError: (e: DefaultQueryError) => {
          console.error('Login error:', e);
          reject(e);
        },
      });
    });
  };
  useEffect(() => {
    if (tokenParam) {
      removeAccessToken();
      storeAccessToken(tokenParam);
      setAccessToken(tokenParam);
      searchParams.delete(ACCESS_TOKEN_KEY);
      navigate(`${pathname}?${searchParams.toString()}`, { replace: true });
    }
  }, [tokenParam, pathname, navigate, searchParams]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
