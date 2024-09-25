import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { CreatePromotionFn } from 'src/api/promotion/types';
import { useCreatePromotion } from 'src/api/promotion/useCreatePromotion';

const schemaCreatePromotion = yup.object({
  promotionName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  description: yup.string().required('Vui lòng nhập mô tả'),
  startDate: yup.date().required('Vui lòng nhập ngày bắt đầu'),
  endDate: yup.date().required('Vui lòng nhập ngày kết thúc'),
});

type CreatePromotionProps = {
  refetch?: () => void;
  setIsAddPromotion?: (value: boolean) => void;
};

function CreatePromotionModal({
  refetch,
  setIsAddPromotion,
}: CreatePromotionProps) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<CreatePromotionFn>({
    defaultValues: {
      promotionName: '',
      description: '',
      startDate: '',
      endDate: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schemaCreatePromotion),
  });

  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const { mutate: createPromotion, isLoading: loadingCreatePromotion } =
    useCreatePromotion();

  const handleCreatePromotion: SubmitHandler<CreatePromotionFn> = (data) => {
    createPromotion(data, {
      onSuccess() {
        setIsRegisterSuccess(true);
      },
    });
  };

  const handleCloseAlert = () => {
    setIsRegisterSuccess(false);
    reset();
    if (refetch) refetch();
    if (setIsAddPromotion) setIsAddPromotion(false);
  };

  return (
    <>
      <form
        id="create-promotion"
        onSubmit={handleSubmit(handleCreatePromotion)}
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
              errors.promotionName ? String(errors.promotionName.message) : ''
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
            helperText={errors.endDate ? String(errors.endDate.message) : ''}
          />
          <Button
            variant="contained"
            size="medium"
            fullWidth
            type="submit"
            disabled={!isValid || loadingCreatePromotion}
          >
            {loadingCreatePromotion ? 'Loading...' : t('promotion.addNew')}
          </Button>
        </Stack>
      </form>
      <Dialog maxWidth="xs" open={isRegisterSuccess} onClose={handleCloseAlert}>
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
            <Typography variant="h4">{t('promotion.addNew')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('promotion.createSuccess')}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button fullWidth variant="contained" onClick={handleCloseAlert}>
            {t('report.closeNotification')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreatePromotionModal;
