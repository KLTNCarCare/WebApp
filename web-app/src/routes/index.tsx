import { Outlet, RouteObject, useRoutes } from 'react-router-dom';
import Container from 'src/components/layouts/Container';
import { publicUrl } from 'src/lib/constants';
import { AuthProvider } from 'src/modules/auth/AuthProvider';
import ProtectedRoute from 'src/modules/auth/ProtectedRoute';
import AccountPage from 'src/pages/AccountPage';
import DashboardPage from 'src/pages/DashBoard';
import PromotionPage from 'src/pages/PromotionPage';
import SignInPage from 'src/pages/SignIn';

const routes: RouteObject[] = [
  {
    path: publicUrl,
    element: <Outlet />,
    children: [
      {
        path: `${publicUrl}/dashboard`,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${publicUrl}/account-management`,
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${publicUrl}/promotion`,
        element: (
          <ProtectedRoute>
            <PromotionPage />
          </ProtectedRoute>
        ),
      },
      { path: `${publicUrl}/signin`, element: <SignInPage /> },
    ],
  },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return (
    <Container>
      <AuthProvider>{element}</AuthProvider>
    </Container>
  );
};

export default routes;
