import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { muiTheme } from './themes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import { SnackbarUtilsConfigurator } from './lib/snackbarUtils';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';
import { ToastContainer } from 'react-toastify';

function App() {
  const [queryClientState] = useState(() => queryClient);
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider theme={muiTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              autoHideDuration={5000}
              preventDuplicate
            >
              <SnackbarUtilsConfigurator />
              <QueryClientProvider client={queryClientState}>
                {/* <AuthProvider> */}
                <ToastContainer />
                <AppRoutes />
                {/* </AuthProvider> */}
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
              </QueryClientProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
