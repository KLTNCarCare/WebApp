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
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { CreateCategoryFn } from 'src/api/category/types';
import { useCreateCategory } from 'src/api/category/useCreateCategory';

const schemaCreateCategory = yup.object({
  categoryName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  categoryType: yup.string().required('Vui lòng nhập loại khuyến mãi'),
});

type CreateCategoryProps = {
  refetch?: () => void;
  setIsAddCategory?: (value: boolean) => void;
};

function CreateCategoryModal({
  refetch,
  setIsAddCategory,
}: CreateCategoryProps) {
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<CreateCategoryFn>({
    defaultValues: {
      categoryName: '',
      categoryType: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schemaCreateCategory),
  });

  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const { mutate: createCategory, isLoading: loadingCreateCategory } =
    useCreateCategory();

  const handleCreateCategory: SubmitHandler<CreateCategoryFn> = (data) => {
    createCategory(data, {
      onSuccess() {
        setIsRegisterSuccess(true);
      },
    });
  };

  const handleCloseAlert = () => {
    setIsRegisterSuccess(false);
    reset();
    if (refetch) refetch();
    if (setIsAddCategory) setIsAddCategory(false);
  };

  return (
    <>
      <form id="create-category" onSubmit={handleSubmit(handleCreateCategory)}>
        <Stack spacing={2} sx={{ paddingTop: '10px' }}>
          <TextField
            required
            variant="filled"
            label={t('category.categoryName')}
            type="text"
            {...register('categoryName')}
            inputProps={{ inputMode: 'text' }}
            error={!!errors.categoryName}
            helperText={
              errors.categoryName ? String(errors.categoryName.message) : ''
            }
          />
          <FormControl fullWidth variant="filled" error={!!errors.categoryType}>
            <InputLabel>{t('category.categoryType')}</InputLabel>
            <Controller
              name="categoryType"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} native={false}>
                  <MenuItem value="product">{t('category.product')}</MenuItem>
                  <MenuItem value="service">{t('category.service')}</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>
              {errors.categoryType ? String(errors.categoryType.message) : ''}
            </FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            size="medium"
            fullWidth
            type="submit"
            disabled={!isValid || loadingCreateCategory}
          >
            {loadingCreateCategory ? 'Loading...' : t('category.addNew')}
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
            <Typography variant="h4">{t('category.addNew')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('category.createSuccess')}</DialogContentText>
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

export default CreateCategoryModal;
