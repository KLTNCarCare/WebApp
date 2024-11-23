import React, { useState, useCallback } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { useChangePassword } from 'src/api/auth/useChangePassword';
import { useSendOtp } from 'src/api/auth/useSendOtp';
import { RecaptchaVerifier } from 'src/api/auth/firebaseConfig';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { removeCookie } from 'src/lib/cookies';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
}));

const AccountCurrent: React.FC = () => {
  const { t } = useTranslation();
  const userData = localStorage.getItem('userData');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const [open, setOpen] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const { mutate: changePassword } = useChangePassword({
    onSuccess: () => {
      setSuccess(t('staff.passwordChangedSuccessfully'));
      setTimeout(() => {
        handleCloseChangePassword();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        removeCookie('accessToken');
        removeCookie('refreshToken');
        window.location.href = '/signin';
      }, 2000);
    },
    onError: () => {
      setError(t('staff.passwordChangeFailed'));
    },
  });

  const { mutate: sendOtp } = useSendOtp({
    onSuccess: () => {
      setOtpSent(true);
      setSuccess(t('staff.otpSentSuccessfully'));
    },
    onError: () => {
      setError(t('staff.otpSendFailed'));
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setError('');
    setSuccess('');
    setOtpSent(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError(t('staff.passwordsDoNotMatch'));
      return;
    }

    changePassword({
      phoneNumber: parsedUserData.phone,
      oldPass: oldPassword,
      newPass: newPassword,
      otp,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    removeCookie('accessToken');
    removeCookie('refreshToken');
    window.location.href = '/signin';
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.startsWith('0')) {
      return '+84' + phoneNumber.slice(1);
    }
    return phoneNumber;
  };

  if (!parsedUserData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {t('staff.noUserData')}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <IconButton onClick={handleClickOpen} color="inherit">
        <AccountCircleIcon />
      </IconButton>

      <StyledDialog open={open} onClose={handleClose}>
        <StyledDialogTitle>{t('staff.currentStaff')}</StyledDialogTitle>
        <StyledDialogContent>
          <Typography variant="body1">
            <strong>{t('staff.name')}:</strong> {parsedUserData.name}
          </Typography>
          <Typography variant="body1">
            <strong>{t('staff.email')}:</strong> {parsedUserData.email}
          </Typography>
          <Typography variant="body1">
            <strong>{t('staff.phone')}:</strong> {parsedUserData.phone}
          </Typography>
          <Typography variant="body1">
            <strong>{t('staff.address')}:</strong> {parsedUserData.address}
          </Typography>
          <Typography variant="body1">
            <strong>{t('staff.dob')}:</strong>{' '}
            {parsedUserData.dob
              ? new Date(parsedUserData.dob).toLocaleDateString()
              : ''}
          </Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={handleOpenChangePassword} color="primary">
            {t('staff.changePassword')}
          </Button>
          <Button onClick={handleClose} color="primary">
            {t('dashboard.close')}
          </Button>
          <Button
            onClick={handleLogout}
            color="secondary"
            variant="contained"
            sx={{
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            {t('dashboard.logout')}
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      <StyledDialog
        open={openChangePassword}
        onClose={handleCloseChangePassword}
      >
        <StyledDialogTitle>{t('staff.changePassword')}</StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            label={t('staff.oldPassword')}
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label={t('staff.newPassword')}
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label={t('staff.confirmPassword')}
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Box display="flex" alignItems="center">
            <TextField
              label={t('staff.otp')}
              type="text"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <SendOtpButton
              sendOtp={sendOtp}
              parsedUserData={parsedUserData}
              formatPhoneNumber={formatPhoneNumber}
            />
          </Box>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="body2" color="success">
              {success}
            </Typography>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={handleCloseChangePassword} color="primary">
            {t('dashboard.cancel')}
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            {t('dashboard.save')}
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </div>
  );
};

const SendOtpButton: React.FC<{
  sendOtp: any;
  parsedUserData: any;
  formatPhoneNumber: (phoneNumber: string) => string;
}> = ({ sendOtp, parsedUserData, formatPhoneNumber }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSendOtp = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('send_otp');
    const phoneNumber = formatPhoneNumber(parsedUserData.phone);
    sendOtp({ phoneNumber, recaptchaToken: token });
  }, [executeRecaptcha, sendOtp, parsedUserData, formatPhoneNumber]);

  return (
    <Button onClick={handleSendOtp} color="primary" sx={{ ml: 2 }}>
      {useTranslation().t('staff.sendOtp')}
    </Button>
  );
};

export default AccountCurrent;
