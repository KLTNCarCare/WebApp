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
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import * as yup from 'yup';
import { UpdatePromotionLineFn } from 'src/api/promotionLine/types';
import { useUpdatePromotionLine } from 'src/api/promotionLine/useUpdatePromotionLine';
import { useGetCurrentServiceActive } from 'src/api/appointment/useGetAllServiceActive';
import useDebounce from 'src/lib/hooks/useDebounce';
import snackbarUtils from 'src/lib/snackbarUtils';
interface Detail {
  _id: string;
  code: string;
  status: string;
  description: string;
  itemId?: string;
  itemName?: string;
  discount: number;
  bill?: number;
  limitDiscount?: number;
}

interface EditPromotionLineModalProps {
  open: boolean;
  onClose: () => void;
  promotionLineData: {
    _id: string;
    description: string;
    startDate: string;
    endDate: string;
    type: 'discount-service' | 'discount-bill';
    status: 'active' | 'inactive' | 'expired';
    detail: Detail[];
  };
  refetch: () => void;
}

const schemaInactive = yup.object({
  description: yup.string().required('Vui lòng nhập mô tả'),
  startDate: yup
    .date()
    .required('Vui lòng nhập ngày bắt đầu')
    .min(new Date(), 'Ngày bắt đầu phải sau ngày hiện tại'),
  endDate: yup
    .date()
    .required('Vui lòng nhập ngày kết thúc')
    .min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});

const schemaActive = yup.object({
  endDate: yup.date().required('Vui lòng nhập ngày kết thúc'),
});

const EditPromotionLineModal = ({
  open,
  onClose,
  promotionLineData,
  refetch,
}: EditPromotionLineModalProps) => {
  const { t } = useTranslation();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearchText = useDebounce(searchText, 500);

  const schema =
    promotionLineData.status === 'active' ? schemaActive : schemaInactive;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<UpdatePromotionLineFn>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: promotionLineData.description,
      startDate: format(new Date(promotionLineData.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(promotionLineData.endDate), 'yyyy-MM-dd'),
      detail: promotionLineData.detail.map((item) => ({
        ...item,
        itemId: item.itemId ?? undefined,
      })),
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detail' as const,
  });

  const { data: currentItems } =
    useGetCurrentServiceActive(debouncedSearchText);

  const { mutate: updatePromotionLine } = useUpdatePromotionLine({
    onSuccess: (data) => {
      refetch();
      setIsSuccessDialogOpen(true);
      setIsLoading(false);
      snackbarUtils.success('Update successful');
      onClose();
    },
    onError: (error) => {
      setIsLoading(false);
      snackbarUtils.error(
        error.response?.data?.message || t('promotionLine.updateError')
      );
    },
  });

  useEffect(() => {
    setValue(
      'endDate',
      format(new Date(promotionLineData.endDate), 'yyyy-MM-dd')
    );
  }, [promotionLineData, setValue]);

  const handleConfirmUpdate = (data: UpdatePromotionLineFn) => {
    setIsLoading(true);
    const { id, ...restData } = data;
    updatePromotionLine({ id: promotionLineData._id, ...restData });
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    onClose();
  };

  const handleCloseModal = () => {
    onClose();
  };

  const formatCurrency = (value: number) => {
    return Number(value).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const [inputValues, setInputValues] = useState(
    promotionLineData.detail.map((item) => formatCurrency(item.discount))
  );

  const handleFocus = (idx: number) => {
    setInputValues((prev) =>
      prev.map((val, i) =>
        i === idx ? watch(`detail.${idx}.discount` as const)?.toString() : val
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
    append({ itemId: '', itemName: '', discount: 0 });
    setInputValues((prev) => [...prev, formatCurrency(0)]);
  };

  const selectedItems = (watch('detail') || [])
    .filter((item: unknown) => !!(item as Detail).itemId)
    .map((item) => (item as Detail).itemId as string);

  return (
    <>
      <Dialog maxWidth="md" fullWidth open={open} onClose={handleCloseModal}>
        <DialogTitle>{t('promotionLine.editPromotionLine')}</DialogTitle>
        <DialogContent>
          {promotionLineData.status === 'active' ? (
            <form
              id="update-promotionLine"
              onSubmit={handleSubmit(handleConfirmUpdate)}
            >
              <Stack spacing={2} sx={{ paddingTop: '10px' }}>
                <TextField
                  required
                  fullWidth
                  variant="filled"
                  label={t('promotionLine.endDate')}
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
                      ? t('promotionLine.updating')
                      : t('promotionLine.update')}
                  </Button>
                </Stack>
              </Stack>
            </form>
          ) : promotionLineData.status === 'inactive' ? (
            <form
              id="update-promotionLine"
              onSubmit={handleSubmit(handleConfirmUpdate)}
            >
              <Stack spacing={2} sx={{ paddingTop: '10px' }}>
                <TextField
                  required
                  fullWidth
                  variant="filled"
                  label={t('promotionLine.description')}
                  {...register('description')}
                  error={!!errors.description}
                  helperText={
                    errors.description
                      ? t(errors.description.message || '')
                      : ''
                  }
                />
                <TextField
                  required
                  fullWidth
                  variant="filled"
                  label={t('promotionLine.startDate')}
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
                  label={t('promotionLine.endDate')}
                  type="date"
                  {...register('endDate')}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={
                    errors.endDate ? t(errors.endDate.message || '') : ''
                  }
                />
                <Typography variant="h6">
                  {t('promotionLine.detail')}
                </Typography>
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
                      getOptionLabel={(option) => option.itemName || ''}
                      defaultValue={{
                        itemId: item.itemId,
                        itemName: item.itemName,
                        categoryId: '', // Provide appropriate default values
                        categoryName: '', // Provide appropriate default values
                        price: 0, // Provide appropriate default values
                        duration: 0, // Provide appropriate default values
                      }}
                      onInputChange={(event, newInputValue) => {
                        setSearchText(newInputValue);
                      }}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setValue(`detail.${index}.itemId`, newValue.itemId);
                          setValue(
                            `detail.${index}.itemName`,
                            newValue.itemName
                          );
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          label={t('promotionLine.itemName')}
                          error={!!errors.detail?.[index]?.itemName}
                          helperText={
                            errors.detail?.[index]?.itemName
                              ? t(errors.detail[index]?.itemName?.message || '')
                              : ''
                          }
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.discount`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          variant="filled"
                          label={t('promotionLine.discount')}
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
                          onBlur={() =>
                            handleBlur(index, { value: field.value ?? 0 })
                          }
                          error={!!errors.detail?.[index]?.discount}
                          helperText={
                            errors.detail?.[index]?.discount
                              ? t(errors.detail[index]?.discount?.message || '')
                              : ''
                          }
                        />
                      )}
                    />
                    {promotionLineData.type === 'discount-bill' && (
                      <>
                        <Controller
                          name={`detail.${index}.bill`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              fullWidth
                              variant="filled"
                              label={t('promotionLine.bill')}
                              type="text"
                              value={inputValues[index]}
                              onFocus={() => handleFocus(index)}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setInputValues((prev) =>
                                  prev.map((val, i) =>
                                    i === index ? value : val
                                  )
                                );
                                field.onChange(Number(value));
                              }}
                              onBlur={() =>
                                handleBlur(index, { value: field.value ?? 0 })
                              }
                              error={!!errors.detail?.[index]?.bill}
                              helperText={
                                errors.detail?.[index]?.bill
                                  ? t(errors.detail[index]?.bill?.message || '')
                                  : ''
                              }
                            />
                          )}
                        />
                        <Controller
                          name={`detail.${index}.limitDiscount`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              fullWidth
                              variant="filled"
                              label={t('promotionLine.limitDiscount')}
                              type="text"
                              value={inputValues[index]}
                              onFocus={() => handleFocus(index)}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setInputValues((prev) =>
                                  prev.map((val, i) =>
                                    i === index ? value : val
                                  )
                                );
                                field.onChange(Number(value));
                              }}
                              onBlur={() =>
                                handleBlur(index, { value: field.value ?? 0 })
                              }
                              error={!!errors.detail?.[index]?.limitDiscount}
                              helperText={
                                errors.detail?.[index]?.limitDiscount
                                  ? t(
                                      errors.detail[index]?.limitDiscount
                                        ?.message || ''
                                    )
                                  : ''
                              }
                            />
                          )}
                        />
                      </>
                    )}
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
                  {t('promotionLine.addDetail')}
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
                      ? t('promotionLine.updating')
                      : t('promotionLine.update')}
                  </Button>
                </Stack>
              </Stack>
            </form>
          ) : (
            <div>{t('promotionLine.cannotUpdate')}</div>
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
              {t('promotionLine.updateDetailsTitle')}
            </Typography>
          </Stack>
        </DialogTitle>
      </Dialog>
    </>
  );
};

export default EditPromotionLineModal;
