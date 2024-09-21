import { Outlet, RouteObject, useRoutes } from 'react-router-dom';
import Container from 'src/components/layouts/Container';
import { publicUrl } from 'src/lib/constants';
import { AuthProvider } from 'src/modules/auth/AuthProvider';
import ProtectedRoute from 'src/modules/auth/ProtectedRoute';
import DashboardPage from 'src/pages/DashBoard';
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
