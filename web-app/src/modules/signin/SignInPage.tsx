import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Paper, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLogin } from 'src/api/auth/useLogin';
import { storeAccessToken, storeRefreshToken } from 'src/lib/token'; // Đảm bảo import các hàm lưu token

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
  const { mutateAsync: login } = useLogin();

  const { handleSubmit, register } = useForm<SignInFormValues>({
    resolver: yupResolver(schemaSignin),
  });

  const signIn: SubmitHandler<SignInFormValues> = async (value) => {
    setLoadingLogin(true);
    setErrorSignin('');
    try {
      const response = await login({
        username: value.username,
        password: value.password,
      });

      if (response.data) {
        const { accessToken, refreshToken } = response.data; // Lấy token từ phản hồi

        if (accessToken && refreshToken) {
          storeAccessToken(accessToken); // Lưu access token
          storeRefreshToken(refreshToken); // Lưu refresh token
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
    <Box className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            marginTop: '20vh',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <img
              src={require('../../assets/images/loginImage.jpg')}
              alt="Illustration"
              style={{ width: '100%', height: 'auto', paddingRight: 20 }}
            />
          </Box>
          <Box sx={{ flex: 1, width: '100%' }}>
            <Typography variant="h1" color="primary.dark" align="center" my={2}>
              {process.env.REACT_APP_NAME}
            </Typography>
            <Typography variant="h2" color="primary.dark" align="center" my={2}>
              Welcome back!
            </Typography>
            <Box
              pt={3}
              component="form"
              sx={{ width: '100%' }}
              onSubmit={handleSubmit(signIn)}
            >
              <TextField
                autoComplete="username"
                autoFocus
                label="Nhập số điện thoại"
                variant="filled"
                fullWidth
                {...register('username')}
              />
              <TextField
                autoComplete="current-password"
                type="password"
                label="Nhập mật khẩu"
                variant="filled"
                fullWidth
                {...register('password')}
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
            <Box pt={3} sx={{ width: '100%' }}>
              <Typography
                variant="body2"
                align="center"
                style={{ cursor: 'pointer' }}
              >
                <Link to="/">Quay lại cửa hàng</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
