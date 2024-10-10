import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Stack,
  Typography,
  useTheme,
  styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { useInactivePriceCatalog } from 'src/api/priceCatalog/useInactivePriceCatalog';
import { useActivePriceCatalog } from 'src/api/priceCatalog/useActivePriceCatalog';

type StatusToggleProps = {
  _id: string;
  currentStatus: string;
  refetch: () => void;
};
const ToggleButton = styled(Button)<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.palette.success.main
      : props.theme.palette.grey[500]};
  color: ${(props) => props.theme.palette.common.white};
  &:hover {
    transform: scale(0.95);
  }
`;
const StatusToggle = ({ _id, currentStatus, refetch }: StatusToggleProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isOpenToggleDialog, setIsOpenToggleDialog] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const { mutateAsync: setInactive, isLoading: isLoadingInactive } =
    useInactivePriceCatalog({
      onSuccess: () => {
        setIsOpenToggleDialog(false);
        setIsSuccessDialogOpen(true);
      },
    });

  const { mutateAsync: setActive, isLoading: isLoadingActive } =
    useActivePriceCatalog({
      onSuccess: () => {
        setIsOpenToggleDialog(false);
        setIsSuccessDialogOpen(true);
      },
    });

  const handleToggle = async () => {
    try {
      if (currentStatus === 'active') {
        await setInactive({ _id });
      } else {
        await setActive({ _id });
      }
      refetch();
    } catch (error) {}
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch();
  };

  return (
    <>
      <ToggleButton
        isActive={currentStatus === 'active'}
        onClick={() => setIsOpenToggleDialog(true)}
      >
        {currentStatus === 'active'
          ? t('priceCatalog.active')
          : t('priceCatalog.inactive')}
      </ToggleButton>

      <Dialog
        open={isOpenToggleDialog}
        maxWidth="xs"
        onClose={() => setIsOpenToggleDialog(false)}
      >
        <DialogTitle variant="h4">{t('priceCatalog.toggleTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            {t('dashboard.confirmToggle')}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 2,
            button: { width: '50%' },
          }}
        >
          <LoadingButton
            onClick={() => setIsOpenToggleDialog(false)}
            variant="contained"
            color="inherit"
          >
            {t('dashboard.cancel')}
          </LoadingButton>
          <LoadingButton
            onClick={handleToggle}
            autoFocus
            color="primary"
            variant="contained"
            loading={isLoadingInactive || isLoadingActive}
          >
            {t('dashboard.confirm')}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="xs"
        open={isSuccessDialogOpen}
        onClose={handleCloseSuccessDialog}
      >
        <DialogTitle sx={{ p: 2 }}>
          <Stack>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                marginBottom: 1.5,
                bgcolor: 'success.light',
              }}
            >
              <CheckIcon color="success" fontSize="large" />
            </Avatar>
            <Typography variant="h4">
              {t('priceCatalog.toggleSuccessTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>
            {t('priceCatalog.toggleSuccess')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCloseSuccessDialog}
          >
            {t('report.closeNotification')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StatusToggle;
