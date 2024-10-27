import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
  Autocomplete,
  Avatar,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import * as yup from 'yup';
import { UpdatePriceCatalogFn } from 'src/api/priceCatalog/types';
import { useUpdatePriceCatalog } from 'src/api/priceCatalog/useUpdatePriceCatalog';
import { useUpdateEndatePriceCatalog } from 'src/api/priceCatalog/useUpdateEndatePriceCatalog';
import { useGetCurrentServiceActive } from 'src/api/appointment/useGetAllServiceActive';
import useDebounce from 'src/lib/hooks/useDebounce';
import snackbarUtils from 'src/lib/snackbarUtils';

interface EditPriceCatalogModalProps {
  open: boolean;
  onClose: () => void;
  priceCatalogData: {
    _id: string;
    endDate: string;
    priceName: string;
    startDate: string;
    items: Array<{
      itemId: string;
      itemName: string;
      price: number;
    }>;
    status: 'active' | 'inactive' | 'expires';
  };
  refetch: () => void;
  setIsEditPriceCatalog: (value: boolean) => void;
}

const schemaInactive = yup.object({
  priceName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  startDate: yup
    .date()
    .required('Vui lòng nhập ngày bắt đầu')
    .min(new Date(), 'Ngày bắt đầu phải sau ngày hiện tại'),
  endDate: yup
    .date()
    .required('Vui lòng nhập ngày kết thúc')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu')
    .test(
      'is-greater-than-today',
      'Ngày kết thúc phải sau ngày hiện tại',
      function (value) {
        return value > new Date();
      }
    ),
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

const schemaActive = yup.object({
  endDate: yup.date().required('Vui lòng nhập ngày kết thúc'),
});

const EditPriceCatalogModal = ({
  open,
  onClose,
  priceCatalogData,
  refetch,
  setIsEditPriceCatalog,
}: EditPriceCatalogModalProps) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearchText = useDebounce(searchText, 500);

  const schema =
    priceCatalogData.status === 'active' ? schemaActive : schemaInactive;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<UpdatePriceCatalogFn>({
    resolver: yupResolver(schema),
    defaultValues: {
      endDate: format(new Date(priceCatalogData.endDate), 'yyyy-MM-dd'),
      priceName: priceCatalogData.priceName,
      startDate: format(new Date(priceCatalogData.startDate), 'yyyy-MM-dd'),
      items: priceCatalogData.items,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { data: currentItems } =
    useGetCurrentServiceActive(debouncedSearchText);

  const { mutate: updateEndatePriceCatalog } = useUpdateEndatePriceCatalog({
    onSuccess: (data) => {
      refetch();
      setIsSuccessDialogOpen(true);
      setIsLoading(false);
      snackbarUtils.success('Cập nhật thành công!');
      onClose();
    },
    onError: (error) => {
      setIsLoading(false);
      snackbarUtils.error(
        error.response?.data?.message || t('priceCatalog.updateError')
      );
    },
  });

  const { mutate: updatePriceCatalog } = useUpdatePriceCatalog({
    onSuccess: (success) => {
      refetch();
      setIsSuccessDialogOpen(true);
      setIsLoading(false);
      onClose();
      snackbarUtils.success(success);
    },
    onError(error) {
      snackbarUtils.error(error);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setValue(
      'endDate',
      format(new Date(priceCatalogData.endDate), 'yyyy-MM-dd')
    );
  }, [priceCatalogData, setValue]);

  const handleConfirmUpdate = (data: UpdatePriceCatalogFn) => {
    setIsLoading(true);
    if (priceCatalogData.status === 'active') {
      updateEndatePriceCatalog({
        id: priceCatalogData._id,
        data: { id: priceCatalogData._id, endDate: data.endDate },
      });
    } else if (priceCatalogData.status === 'inactive') {
      updatePriceCatalog({ id: priceCatalogData._id, data });
    }
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    setIsEditPriceCatalog(false);
    onClose();
  };

  const handleCloseModal = () => {
    setIsEditPriceCatalog(false);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return Number(value).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const [inputValues, setInputValues] = useState(
    priceCatalogData.items.map((item) => formatCurrency(item.price))
  );

  const handleFocus = (idx: number) => {
    setInputValues((prev) =>
      prev.map((val, i) =>
        i === idx ? watch(`items.${idx}.price`).toString() : val
      )
    );
  };

  const handleBlur = (idx: number, field: { value: number }) => {
    const formattedValue = formatCurrency(field.value);
    setInputValues((prev) =>
      prev.map((val, i) => (i === idx ? formattedValue : val))
    );
  };

  const handleAddItem = () => {
    append({ itemId: '', itemName: '', price: 0 });
    setInputValues((prev) => [...prev, formatCurrency(0)]);
  };

  const selectedItems = watch('items').map((item) => item.itemId);

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={open} onClose={handleCloseModal}>
        <DialogTitle>{t('priceCatalog.editPriceCatalog')}</DialogTitle>
        <DialogContent>
          {priceCatalogData.status === 'active' ? (
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
                    disabled={!isValid || !isDirty || isLoading}
                  >
                    {isLoading
                      ? t('priceCatalog.updating')
                      : t('priceCatalog.update')}
                  </Button>
                </Stack>
              </Stack>
            </form>
          ) : priceCatalogData.status === 'inactive' ? (
            <form
              id="update-priceCatalog"
              onSubmit={handleSubmit(handleConfirmUpdate)}
            >
              <Stack spacing={2} sx={{ paddingTop: '10px' }}>
                <TextField
                  required
                  fullWidth
                  variant="filled"
                  label={t('priceCatalog.priceName')}
                  {...register('priceName')}
                  error={!!errors.priceName}
                  helperText={
                    errors.priceName ? t(errors.priceName.message || '') : ''
                  }
                />
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
                    errors.startDate ? t(errors.startDate.message || '') : ''
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
                  helperText={
                    errors.endDate ? t(errors.endDate.message || '') : ''
                  }
                />
                <Typography variant="h6">{t('priceCatalog.items')}</Typography>
                {fields.map((item, index) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Autocomplete
                      fullWidth
                      options={
                        currentItems?.filter(
                          (currentItem) =>
                            !selectedItems.includes(currentItem.itemId)
                        ) || []
                      }
                      getOptionLabel={(option) => option.itemName}
                      defaultValue={{
                        itemId: item.itemId,
                        itemName: item.itemName,
                        price: item.price,
                        categoryId: '',
                        categoryName: '',
                        duration: 0,
                      }}
                      onInputChange={(event, newInputValue) => {
                        setSearchText(newInputValue);
                      }}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setValue(`items.${index}.itemId`, newValue.itemId);
                          setValue(
                            `items.${index}.itemName`,
                            newValue.itemName
                          );
                          setValue(`items.${index}.price`, newValue.price);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          label={t('priceCatalog.itemName')}
                          error={!!errors.items?.[index]?.itemName}
                          helperText={
                            errors.items?.[index]?.itemName
                              ? t(errors.items[index]?.itemName?.message || '')
                              : ''
                          }
                        />
                      )}
                    />
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          variant="filled"
                          label={t('priceCatalog.price')}
                          type="text"
                          value={inputValues[index]}
                          onFocus={() => handleFocus(index)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setInputValues((prev) =>
                              prev.map((val, i) => (i === index ? value : val))
                            );
                            field.onChange(Number(value));
                          }}
                          onBlur={() => handleBlur(index, field)}
                          error={!!errors.items?.[index]?.price}
                          helperText={
                            errors.items?.[index]?.price
                              ? t(errors.items[index]?.price?.message || '')
                              : ''
                          }
                        />
                      )}
                    />
                    <IconButton onClick={() => remove(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                >
                  {t('priceCatalog.addItem')}
                </Button>
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
                    disabled={!isValid || !isDirty || isLoading}
                  >
                    {isLoading
                      ? t('priceCatalog.updating')
                      : t('priceCatalog.update')}
                  </Button>
                </Stack>
              </Stack>
            </form>
          ) : (
            <div>{t('priceCatalog.cannotUpdate')}</div>
          )}
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
      </Dialog>
    </>
  );
};

export default EditPriceCatalogModal;
