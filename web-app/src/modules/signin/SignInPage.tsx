import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLogin } from 'src/api/auth/useLogin';
import { setCookie, getCookie } from 'src/lib/cookies';
import { useAuth } from '../auth/AuthProvider';
import snackbarUtils from 'src/lib/snackbarUtils';

interface SignInFormValues {
  username: string;
  password: string;
}

const schemaSignin = yup
  .object({
    username: yup
      .string()
      .matches(/^\d{10}$/, 'Số điện thoại phải gồm 10 số')
      .required('Vui lòng nhập số điện thoại'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
  })
  .required();

export function SignInPage() {
  const [errorSignin, setErrorSignin] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { mutateAsync: login } = useLogin({
    onSuccess: (success) => {
      snackbarUtils.success(success);
    },
    onError(error) {
      snackbarUtils.error(error);
    },
  });

  const { handleSubmit, control } = useForm<SignInFormValues>({
    resolver: yupResolver(schemaSignin),
  });

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (isAuthenticated || accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const signIn: SubmitHandler<SignInFormValues> = async (value) => {
    setLoadingLogin(true);
    setErrorSignin('');
    try {
      const response: any = await login({
        username: value.username,
        password: value.password,
      });

      if (response.data) {
        const { accessToken, refreshToken, ...userData } = response.data;

        if (accessToken && refreshToken) {
          setCookie('accessToken', accessToken);
          setCookie('refreshToken', refreshToken);

          localStorage.setItem('userData', JSON.stringify(userData));

          const expirationTime = 3600 * 1000;
          setTimeout(() => {
            localStorage.removeItem('userData');
          }, expirationTime);

          setIsAuthenticated(true);
          navigate('/dashboard');
        } else {
          setErrorSignin('Access token or refresh token is missing');
        }
      } else {
        setErrorSignin('Thông tin đăng nhập không hợp lệ');
      }
    } catch (error) {
      setErrorSignin('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <Box
      className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      sx={{
        backgroundImage: `url(${require('../../assets/images/loginImage.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            px: 3,
            py: 4,
            minHeight: 330,
            borderRadius: 2,
            boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.08)',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'grey.200',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            marginTop: '17vh',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <img
              src={require('../../assets/icons/AKAuto.svg').default}
              alt="AKAuto Logo"
              style={{ width: '150px', height: 'auto' }}
            />
          </Box>
          <Typography variant="h2" color="primary.dark" align="center" my={1}>
            Welcome back!
          </Typography>
          <Box
            pt={3}
            component="form"
            sx={{ width: '100%' }}
            onSubmit={handleSubmit(signIn)}
          >
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  autoComplete="username"
                  autoFocus
                  label="Nhập số điện thoại"
                  variant="filled"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  autoComplete="current-password"
                  type="password"
                  label="Nhập mật khẩu"
                  variant="filled"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ''}
                />
              )}
            />

            <LoadingButton
              loading={loadingLogin}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Đăng nhập
            </LoadingButton>
            {errorSignin && (
              <Typography
                paragraph
                mt={2}
                variant="body2"
                align="left"
                height={40}
                color="red"
              >
                {errorSignin}
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
