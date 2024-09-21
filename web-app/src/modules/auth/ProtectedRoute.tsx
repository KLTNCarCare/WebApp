import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getCookie } from 'src/lib/cookies'; // Giả sử bạn có hàm này để lấy token từ cookie

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const prevAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    const accessToken = getCookie('accessToken'); // Lấy token từ cookie

    if (!accessToken) {
      // Nếu không có token, điều hướng đến trang đăng nhập
      navigate('/signin', {
        replace: true,
      });
      return;
    }

    if (!isAuthenticated && accessToken) {
      // Nếu có token nhưng chưa xác thực, cập nhật trạng thái xác thực
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
