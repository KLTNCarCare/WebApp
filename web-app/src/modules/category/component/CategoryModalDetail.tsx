import React from 'react';
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
  ButtonBase,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import {
  CategoryManagement,
  CategoryResponse,
} from 'src/api/category/useGetCategory';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { ServiceByCategory } from 'src/api/category/useGetServiceByCategory';

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
const createServiceColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  serviceByCategorytData: ServiceByCategory[]
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('category.index'),
    maxWidth: 50,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const rowIndex = serviceByCategorytData.findIndex(
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
    valueGetter: (params: GridValueGetterParams) => params.row.serviceId || '',
  },
  {
    field: 'serviceName',
    headerName: t('category.serviceName'),
    maxWidth: 300,
    flex: 1,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'status',
    headerName: t('category.serviceStatus'),
    maxWidth: 160,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.status || '',
  },
  {
    field: 'createdAt',
    headerName: t('category.serviceCreatedAt'),
    maxWidth: 110,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.createdAt).toLocaleDateString(),
  },
  {
    field: 'updatedAt',
    headerName: t('category.serviceUpdatedAt'),
    maxWidth: 110,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.createdAt).toLocaleDateString(),
  },
];
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

  const handleStatusClick = (id: string, currentStatus: string) => {
    console.log(
      `Status clicked for id: ${id}, current status: ${currentStatus}`
    );
  };
  const columns = createServiceColumns(
    t,
    handleStatusClick,
    serviceByCategorytData || []
  );
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
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {categoryData.status}
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

        <Box>
          <Typography variant="h4">
            {t('category.serviceByCategory')}
          </Typography>
          <Paper sx={{ height: 400, width: '100%' }}>
            {isLoadingServiceByCategory ? (
              <LinearProgress />
            ) : (
              <DataGrid
                rows={serviceByCategorytData || []}
                columns={columns}
                pagination
                paginationModel={{
                  pageSize: serviceByCategorytData?.length || 0,
                  page: 0,
                }}
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
                  noRowsOverlay: () => (
                    <EmptyScreen titleEmpty={t('dashboard.noDataAvailable')} />
                  ),
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
