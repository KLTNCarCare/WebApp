import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getCookie } from 'src/lib/cookies';

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prevAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      if (location.pathname !== '/signin') {
        navigate('/signin', {
          replace: true,
        });
      }
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
        // Add any additional logic if needed when authentication state changes
      }
    }

    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, setIsAuthenticated, navigate, location.pathname]);

  return children;
};

export default ProtectedRoute;
