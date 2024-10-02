import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Paper,
  LinearProgress,
  Button,
  Chip,
  TextField,
  Slider,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridToolbarContainer,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import {
  PromotionManagement,
  PromotionResponse,
} from 'src/api/promotion/useGetPromotion';
import {
  PromotionLine,
  useGetPromotionLines,
} from 'src/api/promotion/useGetPromotionLine';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { Add, Edit, Delete, Cancel, Save } from '@mui/icons-material';
import { createPromotionLineFn } from 'src/api/promotionLine/useCreatePromotionLine';
import { updatePromotionLineFn } from 'src/api/promotionLine/useUpdatePromotionLine';
import { useDeletePromotionLine } from 'src/api/promotionLine/useDeletePromotionLine';
import { DatePicker } from '@mui/x-date-pickers';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import { format, parseISO, isValid } from 'date-fns';

interface PromotionDetailModalProps {
  open: boolean;
  onClose: () => void;
  promotionData: PromotionManagement;
  refetch: () => void;
  dataPromotion: any;
  isLoadingPromotion: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  promotionLineData: PromotionLine[] | undefined;
  isLoadingPromotionLine: boolean;
  refetchPromotionLine: () => void;
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: PromotionLine[]) => PromotionLine[]) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  promotionData: PromotionManagement;
  refetch: () => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, promotionData, refetch } = props;

  const handleClick = () => {
    const id = 'new';
    setRows((oldRows) => [
      ...oldRows,
      {
        _id: id,
        description: '',
        startDate: '',
        endDate: '',
        itemId: '',
        itemGiftId: '',
        discount: 0,
        limitDiscount: 0,
        isNew: true,
        lineId: '',
        parentId: promotionData._id,
        type: 'discount-bill',
        status: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
    }));
    refetch();
  };

  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        {t('promotionLine.addItem')}
      </Button>
    </GridToolbarContainer>
  );
}

const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({
  open,
  onClose,
  promotionData,
  refetch,
  dataPromotion,
  isLoadingPromotion,
  paginationModel,
  setPaginationModel,
  promotionLineData,
  isLoadingPromotionLine,
  refetchPromotionLine,
}) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<PromotionLine[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  useEffect(() => {
    if (promotionLineData) {
      setRows(promotionLineData);
    }
  }, [promotionLineData]);
  const { mutate: deletePromotionLine } = useDeletePromotionLine({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (promotionData.items) {
      setRows(promotionData.items);
    }
  }, [promotionData.items]);

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
    const rowToDelete = rows.find((row) => row._id === id);
    if (rowToDelete) {
      deletePromotionLine({ _id: rowToDelete._id });
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    console.log('New Row Values:', {
      description: newRow.description,
      startDate: newRow.startDate,
      endDate: newRow.endDate,
      itemId: newRow.itemId,
      itemGiftId: newRow.itemGiftId,
      discount: newRow.discount,
      limitDiscount: newRow.limitDiscount,
    });

    let updatedRow: any;

    if (newRow.isNew) {
      const createdPromotionLine = await createPromotionLineFn({
        parentId: promotionData._id,
        description: newRow.description,
        startDate: newRow.startDate,
        endDate: newRow.endDate,
        type: newRow.type,
        itemId: newRow.itemId,
        itemGiftId: newRow.itemGiftId,
        discount: newRow.discount,
        limitDiscount: newRow.limitDiscount,
      });
      updatedRow = { ...createdPromotionLine, isNew: false };
    } else {
      const updatedPromotionLine = await updatePromotionLineFn({
        id: newRow._id,
        description: newRow.description,
        startDate: newRow.startDate,
        endDate: newRow.endDate,
        itemId: newRow.itemId,
        itemGiftId: newRow.itemGiftId,
        discount: newRow.discount,
        limitDiscount: newRow.limitDiscount,
      });
      updatedRow = { ...updatedPromotionLine, isNew: false };
    }

    setRows((prevRows) =>
      prevRows.map((row) => (row._id === newRow._id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };
  const itemColumns: GridColDef[] = [
    {
      field: 'description',
      headerName: t('promotionLine.description'),
      minWidth: 300,
      flex: 1,
      editable: true,
      cellClassName: (params) =>
        params.row.isNew ? 'highlight-cell' : 'wrap-cell',
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'startDate',
      headerName: t('promotionLine.startDate'),
      maxWidth: 150,
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <DatePicker
          value={params.value ? parseISO(params.value) : null}
          onChange={(newValue) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: newValue ? newValue.toISOString() : null,
            });
          }}
          renderInput={(props) => <TextField {...props} />}
        />
      ),
      valueGetter: (params: GridValueGetterParams) => {
        const date = parseISO(params.row.startDate);
        return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
      },
    },
    {
      field: 'endDate',
      headerName: t('promotionLine.endDate'),
      maxWidth: 150,
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <DatePicker
          value={params.value ? parseISO(params.value) : null}
          onChange={(newValue) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: newValue ? newValue.toISOString() : null,
            });
          }}
          renderInput={(props) => <TextField {...props} />}
        />
      ),
      valueGetter: (params: GridValueGetterParams) => {
        const date = parseISO(params.row.endDate);
        return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
      },
    },
    {
      field: 'itemId',
      headerName: t('promotionLine.itemId'),
      maxWidth: 110,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => params.row.itemId || '',
    },
    {
      field: 'itemGiftId',
      headerName: t('promotionLine.itemGiftId'),
      maxWidth: 110,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.itemGiftId || '',
    },
    {
      field: 'discount',
      headerName: t('promotionLine.discount'),
      maxWidth: 155,
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Box sx={{ padding: '0 10px', width: '100%' }}>
          <Slider
            value={params.value || 0}
            onChange={(event, newValue) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue,
              });
            }}
            step={1}
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </Box>
      ),
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.discount || 0} %`,
    },
    {
      field: 'limitDiscount',
      headerName: t('promotionLine.limitDiscount'),
      maxWidth: 150,
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <TextField
          value={params.value || ''}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, '');
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: value ? parseInt(value, 10) : '',
            });
          }}
          InputProps={{
            startAdornment: 'VND ',
          }}
        />
      ),
      valueGetter: (params: GridValueGetterParams) =>
        formatCurrency(params.row.limitDiscount || 0),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="h2">{t('promotion.promotionDetails')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">{t('promotion.header')}</Typography>
          <List>
            {promotionData && (
              <>
                {promotionData._id && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.promotionId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {promotionData.promotionId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.promotionName && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.promotionName')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {promotionData.promotionName}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.status && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.status')} />
                      <Chip
                        label={
                          promotionData.status === 'active'
                            ? t('promotion.active')
                            : t('promotion.inactive')
                        }
                        color={
                          promotionData.status === 'active'
                            ? 'success'
                            : 'default'
                        }
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.startDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.startDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(promotionData.startDate).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.endDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.endDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(promotionData.endDate).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
              </>
            )}
          </List>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h4">{t('promotion.items')}</Typography>
          <Paper sx={{ height: 400, width: '100%' }}>
            {isLoadingPromotion ? (
              <LinearProgress />
            ) : (
              <DataGrid
                rows={rows}
                columns={itemColumns}
                rowHeight={90}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                pagination
                paginationModel={{
                  pageSize: paginationModel.pageSize,
                  page: paginationModel.page,
                }}
                onPaginationModelChange={(model) => setPaginationModel(model)}
                disableRowSelectionOnClick
                autoHeight
                getRowId={(row) => row._id}
                sx={{
                  '& .MuiDataGrid-cell': {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  },
                }}
                slots={{
                  toolbar: EditToolbar,
                  noRowsOverlay: () => (
                    <EmptyScreen titleEmpty={t('dashboard.noDataAvailable')} />
                  ),
                }}
                slotProps={{
                  toolbar: {
                    setRows,
                    setRowModesModel,
                    promotionData,
                    refetch,
                  },
                }}
              />
            )}
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDetailModal;
