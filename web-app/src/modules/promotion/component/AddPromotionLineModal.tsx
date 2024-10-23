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
import { useCreatePromotionLine } from 'src/api/promotionLine/useCreatePromotionLine';
import { CreatePromotionLineFn, Detail } from 'src/api/promotionLine/types';
import dayjs from 'dayjs';

interface AddPromotionLineModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newLine: PromotionLine) => void;
  promotionId: string;
}

const AddPromotionLineModal: React.FC<AddPromotionLineModalProps> = ({
  open,
  onClose,
  onAdd,
  promotionId,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, reset, setValue } =
    useForm<CreatePromotionLineFn>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detail',
  });
  const type = watch('type');

  const createPromotionLineMutation = useCreatePromotionLine({
    onSuccess: (newLine) => {
      onAdd(newLine);
      onClose();
      reset();
    },
  });

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
    const newLineData = {
      ...data,
      parentId: promotionId,
      detail: filteredDetails,
      startDate: new Date(data.startDate).getTime(),
      endDate: new Date(data.endDate).getTime(),
    };
    createPromotionLineMutation.mutate(newLineData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('promotionLine.addNewLine')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            defaultValue="discount-service"
            render={({ field }) => (
              <TextField
                {...field}
                label={t('promotionLine.type')}
                select
                fullWidth
                margin="normal"
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
                      name={`detail.${index}.itemId`}
                      control={control}
                      defaultValue={field.itemId}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.itemId')}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.itemName`}
                      control={control}
                      defaultValue={field.itemName}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.itemName')}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.itemGiftId`}
                      control={control}
                      defaultValue={field.itemGiftId}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.itemGiftId')}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.itemGiftName`}
                      control={control}
                      defaultValue={field.itemGiftName}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.itemGiftName')}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.discount`}
                      control={control}
                      defaultValue={field.discount}
                      render={({ field }) => (
                        <TextField
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
                      name={`detail.${index}.bill`}
                      control={control}
                      defaultValue={field.bill}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.bill')}
                          type="number"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.discount`}
                      control={control}
                      defaultValue={field.discount}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.discount')}
                          type="number"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`detail.${index}.limitDiscount`}
                      control={control}
                      defaultValue={field.limitDiscount}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('promotionLine.limitDiscount')}
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

export default AddPromotionLineModal;
