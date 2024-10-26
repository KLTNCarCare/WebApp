import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from 'react-hook-form';
import { PromotionLine } from 'src/api/promotionLine/useGetPromotionLine';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useUpdatePromotionLine } from 'src/api/promotionLine/useUpdatePromotionLine';
import { CreatePromotionLineFn, Detail } from 'src/api/promotionLine/types';
import { useGetCurrentServiceActive } from 'src/api/appointment/useGetAllServiceActive';
import dayjs from 'dayjs';
import snackbarUtils from 'src/lib/snackbarUtils';
import { useQueryClient } from '@tanstack/react-query';

const formatCurrency = (value: number) => {
  return Number(value).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

const parseCurrency = (value: string) => {
  return Number(value.replace(/\D/g, ''));
};

interface EditPromotionLineModalProps {
  open: boolean;
  onClose: () => void;
  promotionLineData: PromotionLine;
  refetch: () => void;
}

const EditPromotionLineModal: React.FC<EditPromotionLineModalProps> = ({
  open,
  onClose,
  promotionLineData,
  refetch,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CreatePromotionLineFn>({
      defaultValues: {
        ...promotionLineData,
        type: promotionLineData.type as 'discount-service' | 'discount-bill',
        detail: promotionLineData.detail.map((detail) => ({
          ...detail,
          bill: detail.bill ?? 0,
          limitDiscount: detail.limitDiscount ?? 0,
          discount: detail.discount ?? 0,
        })),
      },
    });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'detail',
  });

  const type = watch('type');
  const queryClient = useQueryClient();

  const updatePromotionLineMutation = useUpdatePromotionLine({
    onSuccess: () => {
      onClose();
      reset();
      snackbarUtils.success('Cập nhật thành công!');
      queryClient.invalidateQueries(['promotionLines']);
      refetch();
    },
    onError: (error: any) => {
      snackbarUtils.error(`${error.response?.data?.message || error.message}`);
    },
  });

  const { data: services, isLoading: isLoadingServices } =
    useGetCurrentServiceActive('');

  const filterDetails = (details: Detail[], type: string): Detail[] => {
    return details.map((detail) => {
      if (type === 'discount-service') {
        const { bill, limitDiscount, ...filteredDetail } = detail;
        return filteredDetail;
      } else if (type === 'discount-bill') {
        const {
          itemId,
          itemName,
          itemGiftId,
          itemGiftName,
          ...filteredDetail
        } = detail;
        return filteredDetail;
      }
      return detail;
    });
  };

  const onSubmit: SubmitHandler<CreatePromotionLineFn> = (data) => {
    const filteredDetails = filterDetails(data.detail, data.type);
    const updatedLineData = {
      ...data,
      parentId: promotionLineData.parentId,
      detail: filteredDetails,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    updatePromotionLineMutation.mutate({
      id: promotionLineData._id,
      data: updatedLineData,
    });
  };

  const [inputValues, setInputValues] = React.useState(
    promotionLineData.detail.map((detail) => ({
      bill: formatCurrency(detail.bill ?? 0),
      limitDiscount: formatCurrency(detail.limitDiscount ?? 0),
    }))
  );

  const handleFocus = (index: number, field: 'bill' | 'limitDiscount') => {
    setInputValues((prev) =>
      prev.map((val, i) =>
        i === index
          ? { ...val, [field]: parseCurrency(val[field]).toString() }
          : val
      )
    );
  };

  const handleBlur = (
    index: number,
    field: 'bill' | 'limitDiscount',
    value: number
  ) => {
    setInputValues((prev) =>
      prev.map((val, i) =>
        i === index ? { ...val, [field]: formatCurrency(value) } : val
      )
    );
    setValue(`detail.${index}.${field}`, value, { shouldValidate: true });
  };

  const handleChange = (
    index: number,
    field: 'bill' | 'limitDiscount',
    value: string
  ) => {
    setInputValues((prev) =>
      prev.map((val, i) => (i === index ? { ...val, [field]: value } : val))
    );
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value;
    replace([]);
    setValue('type', newType as 'discount-service' | 'discount-bill', {
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{t('promotionLine.editLine')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="code"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t('promotionLine.code')}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t('promotionLine.description')}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('promotionLine.type')}
                select
                fullWidth
                margin="normal"
                onChange={handleTypeChange}
              >
                <MenuItem value="discount-service">
                  {t('promotionLine.discountService')}
                </MenuItem>
                <MenuItem value="discount-bill">
                  {t('promotionLine.discountBill')}
                </MenuItem>
              </TextField>
            )}
          />
          <Controller
            name="startDate"
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('promotion.startDate')}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="filled"
                value={
                  field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
                }
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    field.onChange(date.getTime());
                    setValue('startDate', date.getTime(), {
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
            defaultValue={undefined}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('promotion.endDate')}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="filled"
                value={
                  field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
                }
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    field.onChange(date.getTime());
                    setValue('endDate', date.getTime(), {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            )}
          />
          {type === 'discount-service' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{t('promotionLine.detail')}</Typography>
              {fields &&
                fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                  >
                    <Controller
                      key={index}
                      name={`detail.${index}.code`}
                      control={control}
                      defaultValue={field.code}
                      render={({ field: codeField }) => (
                        <TextField
                          required
                          {...codeField}
                          label={t('promotionLine.details.code')}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.itemName`}
                      control={control}
                      defaultValue={field.itemName}
                      render={({ field: itemNameField }) => (
                        <TextField
                          required
                          {...itemNameField}
                          label={t('promotionLine.itemName')}
                          select
                          fullWidth
                          margin="normal"
                          onChange={(e) => {
                            const selectedService = services?.find(
                              (service) => service.itemName === e.target.value
                            );
                            if (selectedService) {
                              setValue(
                                `detail.${index}.itemId`,
                                selectedService.itemId
                              );
                              itemNameField.onChange(selectedService.itemName);
                            }
                          }}
                        >
                          {isLoadingServices ? (
                            <MenuItem disabled>
                              <CircularProgress size={24} />
                            </MenuItem>
                          ) : (
                            services?.map((service) => (
                              <MenuItem
                                key={service.itemId}
                                value={service.itemName}
                              >
                                {service.itemName}
                              </MenuItem>
                            ))
                          )}
                        </TextField>
                      )}
                    />
                    <Controller
                      name={`detail.${index}.itemGiftName`}
                      control={control}
                      defaultValue={field.itemGiftName}
                      render={({ field: itemGiftNameField }) => (
                        <TextField
                          required
                          {...itemGiftNameField}
                          label={t('promotionLine.itemGiftName')}
                          select
                          fullWidth
                          margin="normal"
                          onChange={(e) => {
                            const selectedService = services?.find(
                              (service) => service.itemName === e.target.value
                            );
                            if (selectedService) {
                              setValue(
                                `detail.${index}.itemGiftId`,
                                selectedService.itemId
                              );
                              itemGiftNameField.onChange(
                                selectedService.itemName
                              );
                            }
                          }}
                        >
                          {isLoadingServices ? (
                            <MenuItem disabled>
                              <CircularProgress size={24} />
                            </MenuItem>
                          ) : (
                            services?.map((service) => (
                              <MenuItem
                                key={service.itemId}
                                value={service.itemName}
                              >
                                {service.itemName}
                              </MenuItem>
                            ))
                          )}
                        </TextField>
                      )}
                    />
                    <Controller
                      name={`detail.${index}.discount`}
                      control={control}
                      defaultValue={field.discount}
                      render={({ field: discountField }) => (
                        <TextField
                          required
                          {...discountField}
                          label={t('promotionLine.discount')}
                          type="number"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <IconButton onClick={() => remove(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  append({
                    code: '',
                    itemId: '',
                    itemName: '',
                    itemGiftId: '',
                    itemGiftName: '',
                    discount: 0,
                  })
                }
                startIcon={<AddIcon />}
              >
                {t('promotionLine.addDetail')}
              </Button>
            </Box>
          )}
          {type === 'discount-bill' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{t('promotionLine.detail')}</Typography>
              {fields &&
                fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                  >
                    <Controller
                      key={index}
                      name={`detail.${index}.code`}
                      control={control}
                      defaultValue={field.code}
                      render={({ field: codeField }) => (
                        <TextField
                          required
                          {...codeField}
                          label={t('promotionLine.details.code')}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.bill`}
                      control={control}
                      defaultValue={field.bill}
                      render={({ field: billField }) => (
                        <TextField
                          required
                          {...billField}
                          label={t('promotionLine.bill')}
                          type="text"
                          fullWidth
                          margin="normal"
                          value={inputValues[index].bill}
                          onFocus={() => handleFocus(index, 'bill')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handleChange(index, 'bill', value);
                            billField.onChange(Number(value));
                          }}
                          onBlur={() => {
                            const parsedValue = parseCurrency(
                              inputValues[index].bill
                            );
                            handleBlur(index, 'bill', parsedValue);
                            billField.onChange(parsedValue);
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.limitDiscount`}
                      control={control}
                      defaultValue={field.limitDiscount}
                      render={({ field: limitDiscountField }) => (
                        <TextField
                          required
                          {...limitDiscountField}
                          label={t('promotionLine.limitDiscount')}
                          type="text"
                          fullWidth
                          margin="normal"
                          value={inputValues[index].limitDiscount}
                          onFocus={() => handleFocus(index, 'limitDiscount')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handleChange(index, 'limitDiscount', value);
                            limitDiscountField.onChange(Number(value));
                          }}
                          onBlur={() => {
                            const parsedValue = parseCurrency(
                              inputValues[index].limitDiscount
                            );
                            handleBlur(index, 'limitDiscount', parsedValue);
                            limitDiscountField.onChange(parsedValue);
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.discount`}
                      control={control}
                      defaultValue={field.discount}
                      render={({ field }) => (
                        <TextField
                          required
                          {...field}
                          label={t('promotionLine.discount')}
                          type="number"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <IconButton onClick={() => remove(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  append({
                    code: '',
                    bill: 0,
                    discount: 0,
                    limitDiscount: 0,
                  })
                }
                startIcon={<AddIcon />}
              >
                {t('promotionLine.addDetail')}
              </Button>
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('dashboard.cancel')}
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          {t('dashboard.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPromotionLineModal;
