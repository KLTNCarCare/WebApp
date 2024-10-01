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
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { useUpdateCategory } from 'src/api/category/useUpdateCategory';

const schemaUpdateCategory = yup.object({
  categoryName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
});

type EditCategoryModalProps = {
  categoryData: {
    _id: string;
    categoryName: string;
  };
  refetch: () => void;
  setIsEditCategory: (value: boolean) => void;
};

const EditCategoryModal = ({
  categoryData,
  refetch,
  setIsEditCategory,
}: EditCategoryModalProps) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    control,
  } = useForm({
    resolver: yupResolver(schemaUpdateCategory),
    defaultValues: {
      categoryName: categoryData.categoryName,
    },
    mode: 'onChange',
  });

  const watchedCategoryName = useWatch({
    control,
    name: 'categoryName',
  });

  useEffect(() => {
    setValue('categoryName', categoryData.categoryName);
  }, [categoryData, setValue]);

  useEffect(() => {
    setIsChanged(watchedCategoryName !== categoryData.categoryName);
  }, [watchedCategoryName, categoryData.categoryName]);

  const { mutate: updateCategory } = useUpdateCategory({
    onSuccess: () => {
      refetch();
      setIsSuccessDialogOpen(true);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
    },
  });

  const handleConfirmUpdate: SubmitHandler<any> = (data) => {
    setIsLoading(true);
    updateCategory({ id: categoryData._id, data });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    refetch();
  };

  const handleCloseModal = () => {
    setIsEditCategory(false);
  };

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={true} onClose={handleCloseModal}>
        <DialogTitle>{t('category.editCategory')}</DialogTitle>
        <DialogContent>
          <form
            id="update-category"
            onSubmit={handleSubmit(handleConfirmUpdate)}
          >
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
                  disabled={!isValid || isLoading || !isChanged}
                >
                  {isLoading ? t('category.updating') : t('category.update')}
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
              {t('category.updateDetailsTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>{t('category.updateSuccess')}</DialogContentText>
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

export default EditCategoryModal;
