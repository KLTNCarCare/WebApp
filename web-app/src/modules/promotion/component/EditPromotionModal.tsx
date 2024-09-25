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
import { useUpdatePromotion } from 'src/api/promotion/useUpdatePromotion';
import { format } from 'date-fns'; // Import format from date-fns

const schemaUpdatePromotion = yup.object({
  promotionName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  description: yup.string().required('Vui lòng nhập mô tả'),
  startDate: yup.date().required('Vui lòng nhập ngày bắt đầu'),
  endDate: yup.date().required('Vui lòng nhập ngày kết thúc'),
});

type EditPromotionModalProps = {
  promotionData: {
    _id: string;
    promotionName: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  refetch: () => void;
  setIsEditPromotion: (value: boolean) => void;
};

const EditPromotionModal = ({
  promotionData,
  refetch,
  setIsEditPromotion,
}: EditPromotionModalProps) => {
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
    resolver: yupResolver(schemaUpdatePromotion),
    defaultValues: {
      promotionName: promotionData.promotionName,
      description: promotionData.description,
      startDate: format(new Date(promotionData.startDate), 'yyyy-MM-dd'), // Format startDate
      endDate: format(new Date(promotionData.endDate), 'yyyy-MM-dd'), // Format endDate
    },
  });

  const { mutate: updatePromotion } = useUpdatePromotion({
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
    setValue('promotionName', promotionData.promotionName);
    setValue('description', promotionData.description);
    setValue(
      'startDate',
      format(new Date(promotionData.startDate), 'yyyy-MM-dd')
    );
    setValue('endDate', format(new Date(promotionData.endDate), 'yyyy-MM-dd')); // Format endDate
  }, [promotionData, setValue]);

  const handleConfirmUpdate: SubmitHandler<any> = (data) => {
    setIsLoading(true);
    updatePromotion({ id: promotionData._id, data });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch();
  };

  const handleCloseModal = () => {
    setIsEditPromotion(false);
  };

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={true} onClose={handleCloseModal}>
        <DialogTitle>{t('promotion.editPromotion')}</DialogTitle>
        <DialogContent>
          <form
            id="update-promotion"
            onSubmit={handleSubmit(handleConfirmUpdate)}
          >
            <Stack spacing={2} sx={{ paddingTop: '10px' }}>
              <TextField
                required
                variant="filled"
                label={t('promotion.promotionName')}
                type="text"
                {...register('promotionName')}
                inputProps={{ inputMode: 'text' }}
                error={!!errors.promotionName}
                helperText={
                  errors.promotionName
                    ? String(errors.promotionName.message)
                    : ''
                }
              />
              <TextField
                required
                fullWidth
                variant="filled"
                label={t('promotion.description')}
                type="text"
                {...register('description')}
                inputProps={{ inputMode: 'text' }}
                error={!!errors.description}
                helperText={
                  errors.description ? String(errors.description.message) : ''
                }
              />
              <TextField
                required
                fullWidth
                variant="filled"
                label={t('promotion.startDate')}
                type="date"
                {...register('startDate')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={
                  errors.startDate ? String(errors.startDate.message) : ''
                }
              />
              <TextField
                required
                fullWidth
                variant="filled"
                label={t('promotion.endDate')}
                type="date"
                {...register('endDate')}
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDate}
                helperText={
                  errors.endDate ? String(errors.endDate.message) : ''
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
                  {isLoading ? t('promotion.updating') : t('promotion.update')}
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
              {t('promotion.updateDetailsTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('promotion.updateSuccess')}</DialogContentText>
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

export default EditPromotionModal;
