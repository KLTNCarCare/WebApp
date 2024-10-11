import { Outlet, RouteObject, useRoutes } from 'react-router-dom';
import Container from 'src/components/layouts/Container';
import { publicUrl } from 'src/lib/constants';
import { AuthProvider } from 'src/modules/auth/AuthProvider';
import ProtectedRoute from 'src/modules/auth/ProtectedRoute';
import AccountPage from 'src/pages/AccountPage';
import CategoryPage from 'src/pages/CategoryPage';
import DashboardPage from 'src/pages/DashBoard';
import InvoicePage from 'src/pages/Invoice';
import PriceCatalogPage from 'src/pages/PriceCatalog';
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
      {
        path: `${publicUrl}/category`,
        element: (
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${publicUrl}/price-catalog`,
        element: (
          <ProtectedRoute>
            <PriceCatalogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${publicUrl}/invoice`,
        element: (
          <ProtectedRoute>
            <InvoicePage />
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
