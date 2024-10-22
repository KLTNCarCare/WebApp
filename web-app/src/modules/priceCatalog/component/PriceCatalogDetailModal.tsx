import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Paper,
  Divider,
  ListItemText,
  ListItem,
  List,
  Chip,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import {
  PriceCatalogManagement,
  PriceCatalogResponse,
} from 'src/api/priceCatalog/useGetPriceCatalog';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import EditPriceCatalogModal from './EditPriceCatalogModal';

interface PriceCatalogDetailModalProps {
  open: boolean;
  onClose: () => void;
  priceCatalogData: PriceCatalogManagement;
  refetch: () => void;
  dataPriceCatalog: PriceCatalogResponse | null;
  isLoadingPriceCatalog: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
}

const createItemColumns = (t: (key: string) => string): GridColDef[] => [
  {
    field: 'itemName',
    headerName: t('priceCatalog.itemName'),
    minWidth: 300,
    flex: 1,
  },
  {
    field: 'itemPrice',
    headerName: t('priceCatalog.itemPrice'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(params.row.price),
  },
];

const PriceCatalogDetailModal: React.FC<PriceCatalogDetailModalProps> = ({
  open,
  onClose,
  priceCatalogData,
  refetch,
  dataPriceCatalog,
  isLoadingPriceCatalog,
  paginationModel,
  setPaginationModel,
}) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    refetch();
    onClose();
  };

  const isInactiveAndFutureStartDate =
    priceCatalogData.status === 'inactive' &&
    new Date(priceCatalogData.startDate) > new Date();

  const itemColumns = createItemColumns(t);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h2">
          {t('priceCatalog.priceCatalogDetails')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">{t('priceCatalog.header')}</Typography>
          <List>
            {priceCatalogData && (
              <>
                {priceCatalogData._id && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('priceCatalog.priceId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {priceCatalogData.priceId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {priceCatalogData._id && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('priceCatalog.priceName')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {priceCatalogData.priceName}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {priceCatalogData.status && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('priceCatalog.status')} />
                      <Chip
                        label={
                          priceCatalogData.status === 'active'
                            ? t('priceCatalog.active')
                            : priceCatalogData.status === 'inactive'
                            ? t('priceCatalog.inactive')
                            : t('priceCatalog.expires')
                        }
                        color={
                          priceCatalogData.status === 'active'
                            ? 'success'
                            : priceCatalogData.status === 'inactive'
                            ? 'default'
                            : 'error'
                        }
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {priceCatalogData.startDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('priceCatalog.startDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(
                          priceCatalogData.startDate
                        ).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {priceCatalogData.startDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('priceCatalog.startDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(
                          priceCatalogData.startDate
                        ).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {priceCatalogData.endDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('priceCatalog.endDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(
                          priceCatalogData.endDate
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">{t('priceCatalog.items')}</Typography>
          <Paper sx={{ width: '100%' }}>
            <DataGrid
              rows={priceCatalogData.items || []}
              columns={itemColumns}
              pagination
              paginationModel={{
                pageSize: priceCatalogData.items?.length || 0,
                page: 0,
              }}
              disableRowSelectionOnClick
              autoHeight
              getRowId={(row) => row.itemId}
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
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenEditModal}
          >
            {t('priceCatalog.edit')}
          </Button>
        </Box>
      </DialogContent>

      <EditPriceCatalogModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        priceCatalogData={priceCatalogData}
        refetch={refetch}
        setIsEditPriceCatalog={setIsEditModalOpen}
      />
    </Dialog>
  );
};

export default PriceCatalogDetailModal;
