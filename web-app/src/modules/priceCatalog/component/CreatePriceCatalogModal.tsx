import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  FieldArrayWithId,
} from 'react-hook-form';
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
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CheckIcon } from '../../../assets/icons/CheckCircle.svg';
import { CreatePriceCatalogFn } from 'src/api/priceCatalog/types';
import { useCreatePriceCatalog } from 'src/api/priceCatalog/useCreatePriceCatalog';
import { useGetListCategory } from 'src/api/category/useGetCategory';
import { useGetServiceByCategory } from 'src/api/category/useGetServiceByCategory';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

interface Item extends FieldArrayWithId<CreatePriceCatalogFn, 'items', 'id'> {
  isNew?: boolean;
}

interface EditToolbarProps {
  setRows: React.Dispatch<React.SetStateAction<Item[]>>;
  setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
}

function EditToolbar({ setRows, setRowModesModel }: EditToolbarProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [
      ...oldRows,
      { id, itemId: '', itemName: '', price: 0, isNew: true, _id: id },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'itemId' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        {t('priceCatalog.addItem')}
      </Button>
    </GridToolbarContainer>
  );
}

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
      startDate: 0,
      endDate: 0,
      items: [],
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: services } = useGetServiceByCategory(selectedCategory || '', {
    enabled: !!selectedCategory,
  });

  const handleCategoryChange = (id: GridRowId, value: string) => {
    setSelectedCategory(value);
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, itemId: value, itemName: '' } : row
      )
    );
  };

  const handleServiceChange = (id: GridRowId, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, itemName: value } : row))
    );
  };

  const handleCreatePriceCatalog: SubmitHandler<CreatePriceCatalogFn> = (
    data
  ) => {
    const startDate = data.startDate;
    const endDate = data.endDate;

    const payload = {
      ...data,
      startDate: startDate ? Math.abs(Number(startDate)) : 0,
      endDate: endDate ? Math.abs(Number(endDate)) : 0,
    };

    createPriceCatalog(payload, {
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

  const [rows, setRows] = useState<Item[]>(fields);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    setValue('items', rows);
  }, [rows, setValue]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === newRow.id ? { ...row, ...updatedRow } : row
      )
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'itemId',
      headerName: t('priceCatalog.selectCategory'),
      width: 200,
      editable: true,
      renderCell: (params) => {
        const category = categories?.data.find(
          (category) => category._id === params.value
        );
        return category ? category.categoryName : '';
      },
      renderEditCell: (params) => (
        <FormControl fullWidth variant="filled">
          <InputLabel>{t('priceCatalog.selectCategory')}</InputLabel>
          <Select
            value={params.value}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'itemId',
                value: e.target.value,
              });
              handleCategoryChange(params.id, e.target.value);
            }}
          >
            {categories?.data.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'itemName',
      headerName: t('priceCatalog.selectService'),
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <FormControl fullWidth variant="filled">
          <InputLabel>{t('priceCatalog.selectService')}</InputLabel>
          <Select
            value={params.value}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: 'itemName',
                value: e.target.value,
              });
              handleServiceChange(params.id, e.target.value);
            }}
            disabled={!params.row.itemId}
          >
            {services?.map((service) => (
              <MenuItem key={service._id} value={service.serviceName}>
                {service.serviceName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: 'price',
      headerName: t('priceCatalog.enterPrice'),
      width: 150,
      editable: true,
      // Định dạng tiền tệ cho hiển thị
      renderCell: (params) => {
        if (params.value != null) {
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(params.value);
        }
        return '';
      },
      // Chuyển đổi giá trị nhập vào thành số
      valueParser: (value) => {
        const parsedValue = parseFloat(value);
        return isNaN(parsedValue) ? 0 : parsedValue;
      },
      // Hiển thị placeholder với hướng dẫn
      renderEditCell: (params) => (
        <TextField
          fullWidth
          variant="filled"
          type="number"
          value={params.value}
          onChange={(e) => {
            const value = e.target.value;
            params.api.setEditCellValue({
              id: params.id,
              field: 'price',
              value: value,
            });
          }}
          placeholder={t('priceCatalog.enterPricePlaceholder')}
          InputProps={{
            inputProps: {
              min: 0,
              step: 'any',
            },
          }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];
  return (
    <>
      <Dialog maxWidth="md" fullWidth open={true} onClose={handleCloseAlert}>
        <DialogTitle sx={{ p: 2 }}>
          <Stack>
            <Typography variant="h4">{t('priceCatalog.addNew')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 2 }}>
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
              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  onRowEditStop={handleRowEditStop}
                  processRowUpdate={processRowUpdate}
                  autoHeight
                  getRowId={(row) => row.id}
                  components={{
                    Toolbar: EditToolbar,
                  }}
                  componentsProps={{
                    toolbar: { setRows, setRowModesModel },
                  }}
                />
              </Box>
              <DateTimePicker
                label={t('priceCatalog.startDate')}
                value={
                  watch('startDate')
                    ? dayjs.unix(Math.abs(watch('startDate'))).toDate()
                    : null
                }
                onChange={(date) => {
                  setValue(
                    'startDate',
                    date ? Math.abs(dayjs(date).unix()) : 0,
                    {
                      shouldValidate: true,
                    }
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    fullWidth
                    variant="filled"
                  />
                )}
                ampm={false}
                inputFormat="DD/MM/YYYY HH:mm"
                mask="__/__/____ __:__"
              />

              <DateTimePicker
                label={t('priceCatalog.endDate')}
                value={
                  watch('endDate')
                    ? dayjs.unix(Math.abs(watch('endDate'))).toDate()
                    : null
                }
                onChange={(date) => {
                  setValue('endDate', date ? Math.abs(dayjs(date).unix()) : 0, {
                    shouldValidate: true,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                    fullWidth
                    variant="filled"
                  />
                )}
                ampm={false}
                inputFormat="DD/MM/YYYY HH:mm"
                mask="__/__/____ __:__"
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
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreatePriceCatalogModal;
