import { Box, Paper } from '@mui/material';
import { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import NavigationBar from './NavigationBar';
import SidebarDashboard from 'src/modules/dashboard/component/SidebarDashboard';

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  isCollapse: boolean;
  setIsCollapse: (value: boolean) => void;
};

// MobileLayout.jsx
const MobileAdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ pb: 8 }}>
      {children}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          boxShadow: '0px -4px 16px rgba(0, 0, 0, 0.12)',
        }}
      >
        <NavigationBar />
      </Paper>
    </Box>
  );
};

// DesktopLayout.jsx
const DesktopAdminLayout = ({
  children,
  isCollapse,
  setIsCollapse,
}: AdminLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <SidebarDashboard isCollapse={isCollapse} setIsCollapse={setIsCollapse} />
      <Box
        component="main"
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// UserLayout.jsx
const AdminLayout = ({
  children,
  title,
  isCollapse,
  setIsCollapse,
}: AdminLayoutProps) => {
  return (
    <>
      {isMobile ? (
        <MobileAdminLayout>{children}</MobileAdminLayout>
      ) : (
        <DesktopAdminLayout
          isCollapse={isCollapse}
          setIsCollapse={setIsCollapse}
        >
          {children}
        </DesktopAdminLayout>
      )}
    </>
  );
};

export default AdminLayout;
