import { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { Navigate, useLocation } from 'react-router-dom';

type ContauinerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContauinerProps) {
  const { pathname } = useLocation();
  if (isMobile && ['/dashboard', '/'].includes(pathname))
    return <Navigate to="/" />;
  return <>{children}</>;
}
