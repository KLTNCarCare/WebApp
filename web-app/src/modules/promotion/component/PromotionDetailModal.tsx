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
  Select,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowId,
  MuiBaseEvent,
  MuiEvent,
} from '@mui/x-data-grid';
import MaterialReactTable from 'material-react-table';
import { useTranslation } from 'react-i18next';
import {
  PromotionManagement,
  PromotionResponse,
} from 'src/api/promotion/useGetPromotion';
import {
  Detail,
  PromotionLine,
  useGetPromotionLines,
} from 'src/api/promotionLine/useGetPromotionLine';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { Add, Edit, Delete, Cancel, Save } from '@mui/icons-material';
import { createPromotionLineFn } from 'src/api/promotionLine/useCreatePromotionLine';
import { updatePromotionLineFn } from 'src/api/promotionLine/useUpdatePromotionLine';
import { useDeletePromotionLine } from 'src/api/promotionLine/useDeletePromotionLine';
import { DatePicker } from '@mui/x-date-pickers';
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
  setRowModesModel: (newModel: (oldModel: any) => any) => void;
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
        detail: [
          {
            itemId: null,
            itemGiftId: null,
            bill: 0,
            discount: 0,
            limitDiscount: 0,
            status: '',
            _id: '',
          },
        ],
        status: '',
        isNew: true,
        lineId: '',
        parentId: promotionData._id,
        type: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: 'edit', fieldToFocus: 'description' },
    }));
    refetch();
  };

  const { t } = useTranslation();

  return (
    <Box>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        {t('promotionLine.addItem')}
      </Button>
    </Box>
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
  const [rowModesModel, setRowModesModel] = useState<{ [key: string]: any }>(
    {}
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Detail[] | null>(null);

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

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [String(id)]: { mode: 'edit' } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [String(id)]: { mode: 'view' } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const rowToDelete = rows.find((row) => row._id === String(id));
    if (rowToDelete) {
      deletePromotionLine({ _id: rowToDelete._id });
      setRows(rows.filter((row) => row._id !== String(id)));
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [String(id)]: { mode: 'view', ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === String(id));
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== String(id)));
    }
  };

  const processRowUpdate = async (newRow: PromotionLine) => {
    let updatedRow: any;

    if (newRow.isNew) {
      try {
        const response = await createPromotionLineFn({
          parentId: newRow.parentId,
          description: newRow.description,
          startDate: newRow.startDate,
          endDate: newRow.endDate,
          type: newRow.type,
        });
        updatedRow = { ...newRow, isNew: false, _id: response.data._id };
      } catch (error) {
        console.error('Error creating new promotion line:', error);
        return newRow;
      }
    } else {
      try {
        await updatePromotionLineFn({
          id: newRow._id,
          description: newRow.description,
          startDate: newRow.startDate,
          endDate: newRow.endDate,
        });
        updatedRow = { ...newRow, isNew: false };
      } catch (error) {
        console.error('Error updating promotion line:', error);
        return newRow;
      }
    }

    setRows((prevRows) =>
      prevRows.map((row) => (row._id === newRow._id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: any) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop = (params: any, event: MuiEvent<MuiBaseEvent>) => {
    event.defaultMuiPrevented = true;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const columns: GridColDef[] = [
    {
      field: 'lineId',
      headerName: t('promotionLine.lineId'),
      maxWidth: 100,
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
      field: 'type',
      headerName: t('promotionLine.type'),
      maxWidth: 150,
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
          {params.value === 'discount-bill'
            ? t('promotionLine.discountBill')
            : params.value === 'discount-service'
            ? t('promotionLine.discountService')
            : params.value}
        </Box>
      ),
      renderEditCell: (params) => (
        <Select
          value={params.value}
          onChange={(event) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: event.target.value,
            });
          }}
          fullWidth
        >
          <MenuItem value="discount-bill">
            {t('promotionLine.discountBill')}
          </MenuItem>
          <MenuItem value="discount-service">
            {t('promotionLine.discountService')}
          </MenuItem>
        </Select>
      ),
    },
    {
      field: 'startDate',
      headerName: t('promotionLine.startDate'),
      maxWidth: 150,
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderCellParams) => (
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
      valueGetter: (params) => {
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
      renderEditCell: (params: GridRenderCellParams) => (
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
      valueGetter: (params) => {
        const date = parseISO(params.row.endDate);
        return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
      },
    },
    {
      field: 'detail',
      headerName: t('promotionLine.detail'),
      maxWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSelectedDetail(params.row.detail)}
        >
          {t('promotionLine.viewDetail')}
        </Button>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === 'edit';

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

  const detailColumns: GridColDef[] = [
    {
      field: 'itemId',
      headerName: t('promotionLine.itemId'),
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'itemGiftId',
      headerName: t('promotionLine.itemGiftId'),
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'bill',
      headerName: t('promotionLine.bill'),
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => formatCurrency(params.row.bill),
    },
    {
      field: 'discount',
      headerName: t('promotionLine.discount'),
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => `${params.row.discount}%`,
    },
    {
      field: 'limitDiscount',
      headerName: t('promotionLine.limitDiscount'),
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => formatCurrency(params.row.limitDiscount),
    },
    {
      field: 'status',
      headerName: t('promotionLine.status'),
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={
            params.value === 'active'
              ? t('promotion.active')
              : t('promotion.inactive')
          }
          color={params.value === 'active' ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === 'edit';
        return [
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            // onClick={handleDeleteDetailClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="h2">
          {selectedDetail
            ? t('promotionLine.detail')
            : t('promotion.promotionDetails')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {selectedDetail ? (
          <Box>
            <Button variant="contained" onClick={() => setSelectedDetail(null)}>
              {t('promotionLine.back')}
            </Button>
            <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
              <DataGrid
                rows={selectedDetail}
                columns={detailColumns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5 },
                  },
                }}
                autoHeight
                getRowId={(row) => row._id}
              />
            </Paper>
          </Box>
        ) : (
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
                          {new Date(
                            promotionData.startDate
                          ).toLocaleDateString()}
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
                  {promotionData.updatedAt && (
                    <>
                      <ListItem>
                        <ListItemText primary={t('promotion.updatedAt')} />
                        <Typography
                          variant="body2"
                          textAlign="right"
                          color="grey.600"
                        >
                          {new Date(
                            promotionData.updatedAt
                          ).toLocaleDateString()}
                        </Typography>
                      </ListItem>
                      <Divider variant="middle" />
                    </>
                  )}
                  {promotionData.createdAt && (
                    <>
                      <ListItem>
                        <ListItemText primary={t('promotion.createdAt')} />
                        <Typography
                          variant="body2"
                          textAlign="right"
                          color="grey.600"
                        >
                          {new Date(
                            promotionData.createdAt
                          ).toLocaleDateString()}
                        </Typography>
                      </ListItem>
                      <Divider variant="middle" />
                    </>
                  )}
                </>
              )}
            </List>
          </Box>
        )}

        {!selectedDetail && (
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Typography variant="h4">{t('promotion.items')}</Typography>
            <Paper sx={{ height: 400, width: '100%' }}>
              {isLoadingPromotion ? (
                <LinearProgress />
              ) : (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  rowHeight={90}
                  editMode="row"
                  rowModesModel={rowModesModel}
                  onRowModesModelChange={handleRowModesModelChange}
                  onRowEditStop={
                    handleRowEditStop as GridEventListener<'rowEditStop'>
                  }
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
                      <EmptyScreen
                        titleEmpty={t('dashboard.noDataAvailable')}
                      />
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDetailModal;
