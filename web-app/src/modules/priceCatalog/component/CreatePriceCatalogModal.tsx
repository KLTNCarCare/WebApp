import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { CreatePriceCatalogFn } from 'src/api/priceCatalog/types';
import { useCreatePriceCatalog } from 'src/api/priceCatalog/useCreatePriceCatalog';
import { useGetListCategory } from 'src/api/category/useGetCategory';
import { useGetServiceByCategory } from 'src/api/category/useGetServiceByCategory';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const schemaCreatePriceCatalog = yup.object({
  priceName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  startDate: yup.date().required('Vui lòng nhập ngày bắt đầu'),
  endDate: yup.date().required('Vui lòng nhập ngày kết thúc'),
  items: yup
    .array()
    .of(
      yup.object({
        itemId: yup.string().required('Vui lòng chọn dịch vụ'),
        itemName: yup.string().required('Vui lòng nhập tên dịch vụ'),
        price: yup
          .number()
          .required('Vui lòng nhập giá dịch vụ')
          .positive('Giá dịch vụ phải lớn hơn 0'),
      })
    )
    .required('Vui lòng nhập danh sách dịch vụ'),
});

type CreatePriceCatalogProps = {
  refetch?: () => void;
  setIsAddPriceCatalog?: (value: boolean) => void;
};

function CreatePriceCatalogModal({
  refetch,
  setIsAddPriceCatalog,
}: CreatePriceCatalogProps) {
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<CreatePriceCatalogFn>({
    defaultValues: {
      priceName: '',
      startDate: '',
      endDate: '',
      items: [{ itemId: '', itemName: '', price: 0 }],
    },
    mode: 'onChange',
    resolver: yupResolver(schemaCreatePriceCatalog),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const { mutate: createPriceCatalog, isLoading: loadingCreatePriceCatalog } =
    useCreatePriceCatalog();

  const { data: categories } = useGetListCategory({ page: 1, limit: 10 });
  const selectedCategory = watch(`items.${0}.itemId`);
  const { data: services } = useGetServiceByCategory(selectedCategory, {
    enabled: !!selectedCategory,
  });

  useEffect(() => {
    if (services) {
      setValue(
        `items.${0}.itemName`,
        services.find((service) => service._id === selectedCategory)
          ?.serviceName || ''
      );
    }
  }, [services, selectedCategory, setValue]);

  const handleCreatePriceCatalog: SubmitHandler<CreatePriceCatalogFn> = (
    data
  ) => {
    createPriceCatalog(data, {
      onSuccess() {
        setIsRegisterSuccess(true);
      },
    });
  };

  const handleCloseAlert = () => {
    setIsRegisterSuccess(false);
    reset();
    if (refetch) refetch();
    if (setIsAddPriceCatalog) setIsAddPriceCatalog(false);
  };

  return (
    <>
      <form
        id="create-priceCatalog"
        onSubmit={handleSubmit(handleCreatePriceCatalog)}
      >
        <Stack spacing={2} sx={{ paddingTop: '10px' }}>
          <TextField
            required
            variant="filled"
            label={t('priceCatalog.priceName')}
            type="text"
            {...register('priceName')}
            inputProps={{ inputMode: 'text' }}
            error={!!errors.priceName}
            helperText={
              errors.priceName ? String(errors.priceName.message) : ''
            }
          />
          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 1 }}
            >
              <Typography variant="h6">{t('priceCatalog.items')}</Typography>
              <FormControl fullWidth variant="filled" sx={{ mt: 2 }}>
                <InputLabel>{t('priceCatalog.selectCategory')}</InputLabel>
                <Select
                  {...register(`items.${index}.itemId`)}
                  label={t('priceCatalog.selectCategory')}
                  defaultValue=""
                  error={!!errors.items?.[index]?.itemId}
                >
                  {categories?.data.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="error">
                  {errors.items?.[index]?.itemId &&
                    String(errors.items?.[index]?.itemId?.message ?? '')}
                </Typography>
              </FormControl>
              <FormControl fullWidth variant="filled" sx={{ mt: 2 }}>
                <InputLabel>{t('priceCatalog.selectService')}</InputLabel>
                <Select
                  {...register(`items.${index}.itemName`)}
                  label={t('priceCatalog.selectService')}
                  defaultValue=""
                  error={!!errors.items?.[index]?.itemName}
                  disabled={!selectedCategory}
                >
                  {services?.map((service) => (
                    <MenuItem key={service._id} value={service.serviceName}>
                      {service.serviceName}
                    </MenuItem>
                  ))}
                </Select>
                <Typography color="error">
                  {errors.items?.[index]?.itemName &&
                    String(errors.items?.[index]?.itemName?.message ?? '')}
                </Typography>
              </FormControl>
              <TextField
                required
                fullWidth
                variant="filled"
                label={t('priceCatalog.enterPrice')}
                type="number"
                {...register(`items.${index}.price`)}
                inputProps={{ inputMode: 'numeric' }}
                error={!!errors.items?.[index]?.price}
                helperText={
                  errors.items?.[index]?.price
                    ? String(errors.items?.[index]?.price?.message ?? '')
                    : ''
                }
                sx={{ mt: 2 }}
              />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <IconButton
                  color="error"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              append({ _id: '', itemId: '', itemName: '', price: 0 })
            }
            sx={{ mt: 2 }}
          >
            {t('priceCatalog.addItem')}
          </Button>
          <TextField
            required
            fullWidth
            variant="filled"
            label={t('priceCatalog.startDate')}
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
            label={t('priceCatalog.endDate')}
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
            disabled={!isValid || loadingCreatePriceCatalog}
          >
            {loadingCreatePriceCatalog
              ? 'Loading...'
              : t('priceCatalog.addNew')}
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
            <Typography variant="h4">{t('priceCatalog.addNew')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText>
            {t('priceCatalog.createSuccess')}
          </DialogContentText>
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

export default CreatePriceCatalogModal;
