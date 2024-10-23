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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowId,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import {
  CategoryManagement,
  CategoryResponse,
} from 'src/api/category/useGetCategory';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { ServiceByCategory } from 'src/api/category/useGetServiceByCategory';
import { Add, Edit, Delete } from '@mui/icons-material';
import { createServiceFn } from 'src/api/service/useCreateService';
import { updateServiceFn } from 'src/api/service/useUpdateService';
import { useDeleteService } from 'src/api/service/useDeleteService';
import ServiceDetailModal from './ServiceDetailModal';
import { v4 as uuidv4 } from 'uuid';
import snackbarUtils from 'src/lib/snackbarUtils';

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
  onAddService: () => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { onAddService } = props;
  const { t } = useTranslation();

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={onAddService}>
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
  const [selectedService, setSelectedService] =
    useState<ServiceByCategory | null>(null);
  const [isServiceDetailModalOpen, setServiceDetailModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { mutate: deleteService } = useDeleteService({
    onSuccess: () => {
      refetch();
      handleApiResponse({ message: t('category.serviceDeletedSuccessfully') });
    },
  });

  useEffect(() => {
    if (serviceByCategorytData) {
      setRows(
        serviceByCategorytData.map((service) => ({
          ...service,
          id: service._id,
        }))
      );
    }
  }, [serviceByCategorytData]);

  const handleApiResponse = (response: { message?: string }) => {
    if (response.message) {
      setSnackbarMessage(response.message);
      setSnackbarOpen(true);
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    const service = rows.find((row) => row.id === id);
    if (service) {
      setSelectedService(service);
      setModalMode('edit');
      setServiceDetailModalOpen(true);
    }
  };

  const handleAddService = () => {
    const newService: ServiceByCategory = {
      _id: uuidv4(),
      serviceName: '',
      duration: 0,
      description: '',
      isNew: true,
      serviceId: '',
      categoryId: categoryData._id,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };
    setSelectedService(newService);
    setModalMode('add');
    setServiceDetailModalOpen(true);
  };

  const handleSaveService = async (
    updatedService: ServiceByCategory
  ): Promise<{ code: number; message: string }> => {
    try {
      let response;
      if (updatedService.isNew) {
        response = await createServiceFn({
          serviceName: updatedService.serviceName,
          categoryId: categoryData._id,
          duration: updatedService.duration,
          description: updatedService.description,
        });
      } else {
        response = await updateServiceFn({
          id: updatedService._id,
          serviceName: updatedService.serviceName,
          duration: updatedService.duration,
          description: updatedService.description,
          status: updatedService.status,
        });
      }
      setServiceDetailModalOpen(false);
      refetch();
      snackbarUtils.success(t('category.serviceSavedSuccessfully'));
      return { code: 200, message: 'Success' };
    } catch (error) {
      if ((error as any).response) {
        const errorMessage =
          (error as any).response.data?.message || 'Có lỗi xảy ra';
        snackbarUtils.error(errorMessage);
        return { code: (error as any).response.status, message: errorMessage };
      } else if ((error as any).request) {
        const errorMessage = 'Không thể kết nối đến máy chủ';
        snackbarUtils.error(errorMessage);
        return { code: 500, message: errorMessage };
      } else {
        const errorMessage = 'Có lỗi xảy ra';
        snackbarUtils.error(errorMessage);
        return { code: 500, message: errorMessage };
      }
    }
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const rowToDelete = rows.find((row) => row.id === id);
    if (rowToDelete) {
      deleteService({ _id: rowToDelete._id });
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCloseServiceDetailModal = () => {
    setServiceDetailModalOpen(false);
    refetch();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
      type: 'number',
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
          {params.value} {t('category.hours')}
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: t('category.description'),
      maxWidth: 300,
      flex: 1,
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
      getActions: ({ id }) => [
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
      ],
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
            flex: 1,
            minHeight: 500,
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
          <Paper sx={{ flex: 1, minHeight: 400, width: '100%' }}>
            {isLoadingServiceByCategory ? (
              <LinearProgress />
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationModel={{
                  pageSize: paginationModel.pageSize,
                  page: paginationModel.page,
                }}
                onPaginationModelChange={(model) => setPaginationModel(model)}
                disableRowSelectionOnClick
                autoHeight
                getRowId={(row) => row._id || uuidv4()}
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
                  toolbar: { onAddService: handleAddService },
                }}
              />
            )}
          </Paper>
        </Box>
      </DialogContent>
      {selectedService && (
        <ServiceDetailModal
          open={isServiceDetailModalOpen}
          onClose={handleCloseServiceDetailModal}
          serviceData={selectedService}
          onSave={handleSaveService}
          mode={modalMode}
          refetch={refetch}
        />
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CategoryDetailModal;
