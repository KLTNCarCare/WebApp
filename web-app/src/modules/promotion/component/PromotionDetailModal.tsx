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
  PromotionManagement,
  PromotionResponse,
} from 'src/api/promotion/useGetPromotion';
import {
  PromotionLine,
  useGetPromotionLines,
} from 'src/api/promotion/useGetPromotionLine';
import EmptyScreen from 'src/components/layouts/EmtyScreen';

interface PromotionDetailModalProps {
  open: boolean;
  onClose: () => void;
  promotionData: PromotionManagement;
  promotionLineData: PromotionLine[] | undefined;
  refetch: () => void;
  dataPromotion: PromotionResponse | null;
  isLoadingPromotion: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  isLoadingPromotionLine: boolean;
  refetchPromotionLine: () => void;
}

const createPromotionLineColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  promotionLineData: PromotionLine[]
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('promotionLine.index'),
    maxWidth: 50,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const rowIndex = promotionLineData.findIndex(
        (row: PromotionLine) => row._id === params.id
      );
      return rowIndex !== -1 ? rowIndex + 1 : null;
    },
  },
  {
    field: 'lineId',
    headerName: t('promotionLine.lineId'),
    maxWidth: 160,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.lineId || '',
  },
  {
    field: 'description',
    headerName: t('promotionLine.description'),
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
    field: 'startDate',
    headerName: t('promotionLine.startDate'),
    maxWidth: 110,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.startDate).toLocaleDateString(),
  },
  {
    field: 'endDate',
    headerName: t('promotionLine.endDate'),
    maxWidth: 110,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.endDate).toLocaleDateString(),
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
    valueGetter: (params: GridValueGetterParams) => params.row.itemGiftId || '',
  },
  {
    field: 'discount',
    headerName: t('promotionLine.discount'),
    maxWidth: 100,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.discount ? `${params.row.discount} %` : '',
  },
  {
    field: 'limitDiscount',
    headerName: t('promotionLine.limitDiscount'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.limitDiscount ? `${params.row.limitDiscount} VND` : '',
  },
];

const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({
  open,
  onClose,
  promotionData,
  promotionLineData,
  refetch,
  dataPromotion,
  isLoadingPromotion,
  paginationModel,
  setPaginationModel,
  isLoadingPromotionLine,
  refetchPromotionLine,
}) => {
  const { t } = useTranslation();

  const handleStatusClick = (id: string, currentStatus: string) => {
    console.log(
      `Status clicked for id: ${id}, current status: ${currentStatus}`
    );
  };

  const columns = createPromotionLineColumns(
    t,
    handleStatusClick,
    promotionLineData || []
  );

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
                {promotionData.description && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.description')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {promotionData.description}
                      </Typography>
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

        <Box>
          <Typography variant="h4">{t('promotion.lines')}</Typography>
          <Paper sx={{ height: 400, width: '100%' }}>
            {isLoadingPromotionLine ? (
              <LinearProgress />
            ) : (
              <DataGrid
                rows={promotionLineData || []}
                columns={columns}
                pagination
                paginationModel={{
                  pageSize: promotionLineData?.length || 0,
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

export default PromotionDetailModal;
