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
}) => {
  const { t } = useTranslation();

  const handleStatusClick = (id: string, currentStatus: string) => {
    console.log(
      `Status clicked for id: ${id}, current status: ${currentStatus}`
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
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
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailModal;
