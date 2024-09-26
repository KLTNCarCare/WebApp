import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getCookie } from 'src/lib/cookies';

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const prevAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      navigate('/signin', {
        replace: true,
      });
      return;
    }

    if (!isAuthenticated && accessToken) {
      setIsAuthenticated(true);
    }

    if (
      prevAuthRef.current !== null &&
      prevAuthRef.current !== isAuthenticated
    ) {
      if (isAuthenticated) {
        navigate('/dashboard', {
          replace: true,
        });
      } else {
        navigate('/signin', {
          replace: true,
        });
      }
    }
    prevAuthRef.current = isAuthenticated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, setIsAuthenticated]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
