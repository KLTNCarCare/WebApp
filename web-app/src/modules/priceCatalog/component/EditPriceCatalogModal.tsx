import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Avatar,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUpdatePriceCatalog } from 'src/api/priceCatalog/useUpdatePriceCatalog';
import { format } from 'date-fns';

const schemaUpdatePriceCatalog = yup.object({
  endDate: yup
    .date()
    .required('Vui lòng nhập ngày kết thúc')
    .min(new Date(), 'Ngày kết thúc không được bé hơn ngày hiện tại'),
});

type EditPriceCatalogModalProps = {
  priceCatalogData: {
    _id: string;
    endDate: string;
  };
  refetch: () => void;
  setIsEditPriceCatalog: (value: boolean) => void;
};

const EditPriceCatalogModal = ({
  priceCatalogData,
  refetch,
  setIsEditPriceCatalog,
}: EditPriceCatalogModalProps) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schemaUpdatePriceCatalog),
    defaultValues: {
      endDate: format(new Date(priceCatalogData.endDate), 'yyyy-MM-dd'),
    },
    mode: 'onChange',
  });

  const { mutate: updatePriceCatalog } = useUpdatePriceCatalog({
    onSuccess: () => {
      refetch();
      setIsSuccessDialogOpen(true);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setValue(
      'endDate',
      format(new Date(priceCatalogData.endDate), 'yyyy-MM-dd')
    );
  }, [priceCatalogData, setValue]);

  const handleConfirmUpdate: SubmitHandler<any> = (data) => {
    setIsLoading(true);
    updatePriceCatalog({ id: priceCatalogData._id, data });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch();
  };

  const handleCloseModal = () => {
    setIsEditPriceCatalog(false);
  };

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={true} onClose={handleCloseModal}>
        <DialogTitle>{t('priceCatalog.editPriceCatalog')}</DialogTitle>
        <DialogContent>
          <form
            id="update-priceCatalog"
            onSubmit={handleSubmit(handleConfirmUpdate)}
          >
            <Stack spacing={2} sx={{ paddingTop: '10px' }}>
              <TextField
                required
                fullWidth
                variant="filled"
                label={t('priceCatalog.endDate')}
                type="date"
                {...register('endDate')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={
                  errors.endDate ? t(errors.endDate.message || '') : ''
                }
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={handleCloseModal}
                >
                  {t('dashboard.close')}
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  type="submit"
                  disabled={!isValid || isLoading}
                >
                  {isLoading
                    ? t('priceCatalog.updating')
                    : t('priceCatalog.update')}
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
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
              {t('priceCatalog.updateDetailsTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>
            {t('priceCatalog.updateSuccess')}
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

export default EditPriceCatalogModal;
