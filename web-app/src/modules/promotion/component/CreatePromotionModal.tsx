import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
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
import dayjs from 'dayjs';
import snackbarUtils from 'src/lib/snackbarUtils';

const schemaCreatePromotion = yup.object({
  promotionName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  startDate: yup
    .number()
    .required('Vui lòng nhập ngày bắt đầu')
    .positive('Ngày bắt đầu phải lớn hơn 0')
    .test('is-after-now', 'Ngày bắt đầu phải sau ngày hiện tại', (value) => {
      return value > Date.now();
    }),
  endDate: yup
    .number()
    .required('Vui lòng nhập ngày kết thúc')
    .positive('Ngày kết thúc phải lớn hơn 0')
    .test(
      'is-after-startDate',
      'Ngày kết thúc phải sau ngày bắt đầu',
      function (value) {
        const { startDate } = this.parent;
        return value > startDate;
      }
    )
    .test('is-after-now', 'Ngày kết thúc phải sau ngày hiện tại', (value) => {
      return value > Date.now();
    }),
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
    control,
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
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
    const processedData = {
      ...data,
      startDate: dayjs(data.startDate).startOf('day').toISOString(),
      endDate: dayjs(data.endDate).endOf('day').toISOString(),
    };
    createPromotion(processedData, {
      onSuccess() {
        setIsRegisterSuccess(true);
        snackbarUtils.success(t('promotion.createSuccess'));
      },
      onError(error) {
        const message =
          error.response?.data?.message || t('promotion.createError');
        snackbarUtils.error(message);
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
      <Dialog maxWidth="md" fullWidth open={true} onClose={handleCloseAlert}>
        <DialogTitle sx={{ p: 2 }}>
          <Stack>
            <Typography variant="h4">{t('promotion.addNew')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
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
                  errors.promotionName
                    ? String(errors.promotionName.message)
                    : ''
                }
              />
              <TextField
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
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('promotion.startDate')}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    fullWidth
                    variant="filled"
                    value={
                      field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
                    }
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (date instanceof Date && !isNaN(date.getTime())) {
                        field.onChange(date.getTime());
                        setValue('startDate', date.getTime().toString(), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('promotion.endDate')}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                    fullWidth
                    variant="filled"
                    value={
                      field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
                    }
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      if (date instanceof Date && !isNaN(date.getTime())) {
                        field.onChange(date.getTime());
                        setValue('endDate', date.getTime().toString(), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                )}
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
        </DialogContent>
      </Dialog>
      <Dialog
        maxWidth="md"
        fullWidth
        open={isRegisterSuccess}
        onClose={handleCloseAlert}
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
