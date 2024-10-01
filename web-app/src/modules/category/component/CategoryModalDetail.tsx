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
  CategoryManagement,
  CategoryResponse,
} from 'src/api/category/useGetCategory';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { ServiceByCategory } from 'src/api/category/useGetServiceByCategory';
import { Add, Edit, Delete, Cancel, Save } from '@mui/icons-material';
import { createServiceFn } from 'src/api/service/useCreateService';
import { updateServiceFn } from 'src/api/service/useUpdateService';
import { useDeleteService } from 'src/api/service/useDeleteService';

interface CategoryDetailModalProps {
  open: boolean;
  onClose: () => void;
  categoryData: CategoryManagement;
  refetch: () => void;
  dataCategory: CategoryResponse | null;
  isLoadingCategory: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  serviceByCategorytData: ServiceByCategory[] | undefined;
  isLoadingServiceByCategory: boolean;
}

interface EditToolbarProps {
  setRows: (
    newRows: (oldRows: ServiceByCategory[]) => ServiceByCategory[]
  ) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = 'new';
    setRows((oldRows) => [
      ...oldRows,
      {
        _id: id,
        serviceName: '',
        duration: 0,
        description: '',
        isNew: true,
        serviceId: '',
        categoryId: '',
        status: 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'serviceName' },
    }));
  };

  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        {t('category.addService')}
      </Button>
    </GridToolbarContainer>
  );
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  open,
  onClose,
  categoryData,
  refetch,
  dataCategory,
  isLoadingCategory,
  paginationModel,
  setPaginationModel,
  serviceByCategorytData,
  isLoadingServiceByCategory,
}) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ServiceByCategory[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const { mutate: deleteService } = useDeleteService({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (serviceByCategorytData) {
      setRows(serviceByCategorytData);
    }
  }, [serviceByCategorytData]);

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
      deleteService({ _id: rowToDelete._id });
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
      serviceName: newRow.serviceName,
      duration: newRow.duration,
      description: newRow.description,
    });

    let updatedRow: ServiceByCategory;

    if (newRow.isNew) {
      const createdService = await createServiceFn({
        serviceName: newRow.serviceName,
        categoryId: categoryData._id,
        duration: newRow.duration,
        description: newRow.description,
      });
      updatedRow = { ...createdService, isNew: false };
    } else {
      const updatedService = await updateServiceFn({
        id: newRow._id,
        serviceName: newRow.serviceName,
        duration: newRow.duration,
        description: newRow.description,
      });
      updatedRow = { ...updatedService, isNew: false };
    }

    setRows((prevRows) =>
      prevRows.map((row) => (row._id === newRow._id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('category.index'),
      maxWidth: 50,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => {
        const rowIndex = (serviceByCategorytData ?? []).findIndex(
          (row: ServiceByCategory) => row._id === params.id
        );
        return rowIndex !== -1 ? rowIndex + 1 : null;
      },
    },
    {
      field: 'serviceId',
      headerName: t('category.serviceId'),
      maxWidth: 160,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.serviceId || '',
    },
    {
      field: 'serviceName',
      headerName: t('category.serviceName'),
      maxWidth: 300,
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
      field: 'duration',
      headerName: t('category.duration'),
      maxWidth: 130,
      flex: 1,
      editable: true,
      type: 'number',
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 0;
        return { ...params.props, error: hasError };
      },
      cellClassName: (params) =>
        params.row.isNew ? 'highlight-cell' : 'wrap-cell',
      renderEditCell: (params) => (
        <TextField
          {...params}
          id={String(params.id)}
          error={params.error}
          helperText={params.error ? t('category.invalidDuration') : ''}
          type="number"
          inputProps={{ min: 0, step: 0.5 }}
          sx={{ width: '100%' }}
          onChange={(event) => {
            const value = event.target.value;
            params.api.setEditCellValue({
              id: params.id,
              field: 'duration',
              value,
            });
          }}
        />
      ),
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
      headerName: t('category.description'),
      maxWidth: 300,
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
      field: 'status',
      headerName: t('category.serviceStatus'),
      maxWidth: 160,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={
            params.row.status === 'active'
              ? t('category.active')
              : t('category.inactive')
          }
          color={params.row.status === 'active' ? 'success' : 'default'}
        />
      ),
      cellClassName: 'wrap-cell',
    },
    {
      field: 'createdAt',
      headerName: t('category.serviceCreatedAt'),
      maxWidth: 110,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.createdAt).toLocaleDateString(),
      cellClassName: 'wrap-cell',
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
      field: 'updatedAt',
      headerName: t('category.serviceUpdatedAt'),
      maxWidth: 110,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.updatedAt).toLocaleDateString(),
      cellClassName: 'wrap-cell',
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h2">{t('category.categoryDetails')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <List>
            {categoryData && (
              <>
                {categoryData._id && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.categoryId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {categoryData.categoryId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {categoryData.categoryName && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.categoryName')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {categoryData.categoryName}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {categoryData.categoryType && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.categoryType')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {categoryData.categoryType}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {categoryData.duration && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.duration')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {categoryData.duration}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {categoryData.status && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.status')} />
                      <Chip
                        label={
                          categoryData.status === 'active'
                            ? t('category.active')
                            : t('category.inactive')
                        }
                        color={
                          categoryData.status === 'active'
                            ? 'success'
                            : 'default'
                        }
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {categoryData.createdAt && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.createdAt')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(categoryData.createdAt).toLocaleString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {categoryData.updatedAt && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('category.updatedAt')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(categoryData.updatedAt).toLocaleString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
              </>
            )}
          </List>
        </Box>

        <Box
          sx={{
            height: 500,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
            '& .highlight-cell': {
              backgroundColor: 'rgba(255, 255, 0, 0.3)',
            },
          }}
        >
          <Typography variant="h4">
            {t('category.serviceByCategory')}
          </Typography>
          <Paper sx={{ height: 400, width: '100%' }}>
            {isLoadingServiceByCategory ? (
              <LinearProgress />
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
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
                  toolbar: { setRows, setRowModesModel },
                }}
              />
            )}
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailModal;
