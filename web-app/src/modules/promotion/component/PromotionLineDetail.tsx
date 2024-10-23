import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { PromotionLine } from 'src/api/promotionLine/useGetPromotionLine';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
} from '@mui/material';

interface PromotionLineDetailProps {
  open: boolean;
  onClose: () => void;
  promotionLine: PromotionLine | null;
}

const PromotionLineDetail: React.FC<PromotionLineDetailProps> = ({
  open,
  onClose,
  promotionLine,
}) => {
  const { t } = useTranslation();

  if (!promotionLine) {
    return null;
  }

  const columns: GridColDef[] = [
    { field: 'code', headerName: t('promotionLine.code'), width: 120 },
    {
      field: 'itemName',
      headerName: t('promotionLine.itemName'),
      width: 230,
    },
    {
      field: 'description',
      headerName: t('promotionLine.description'),
      minWidth: 250,
    },
    {
      field: 'discount',
      headerName: t('promotionLine.discount'),
      width: 100,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: 'limitDiscount',
      headerName: t('promotionLine.limitDiscount'),
      width: 200,
      valueFormatter: (params) => {
        const value = params.value || 0;
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value);
      },
    },
  ];

  const rows = promotionLine.detail.map((detail, index) => ({
    id: index,
    ...detail,
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h2">{t('promotionLine.detail')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">{t('promotionLine.header')}</Typography>
          <List>
            {promotionLine.lineId && (
              <>
                <ListItem>
                  <ListItemText primary={t('promotionLine.lineId')} />
                  <Typography
                    variant="body2"
                    textAlign="right"
                    color="grey.600"
                  >
                    {promotionLine.lineId}
                  </Typography>
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
            {promotionLine.description && (
              <>
                <ListItem>
                  <ListItemText primary={t('promotionLine.description')} />
                  <Typography
                    variant="body2"
                    textAlign="right"
                    color="grey.600"
                  >
                    {promotionLine.description}
                  </Typography>
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
            {promotionLine.type && (
              <>
                <ListItem>
                  <ListItemText primary={t('promotionLine.type')} />
                  <Typography
                    variant="body2"
                    textAlign="right"
                    color="grey.600"
                  >
                    {promotionLine.type === 'discount-service'
                      ? t('promotionLine.discountService')
                      : t('promotionLine.discountBill')}
                  </Typography>
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
            {promotionLine.startDate && (
              <>
                <ListItem>
                  <ListItemText primary={t('promotionLine.startDate')} />
                  <Typography
                    variant="body2"
                    textAlign="right"
                    color="grey.600"
                  >
                    {new Date(promotionLine.startDate).toLocaleDateString()}
                  </Typography>
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
            {promotionLine.endDate && (
              <>
                <ListItem>
                  <ListItemText primary={t('promotionLine.endDate')} />
                  <Typography
                    variant="body2"
                    textAlign="right"
                    color="grey.600"
                  >
                    {new Date(promotionLine.endDate).toLocaleDateString()}
                  </Typography>
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
            {promotionLine.status && (
              <>
                <ListItem>
                  <ListItemText primary={t('promotionLine.status')} />
                  <Chip
                    label={
                      promotionLine.status === 'active'
                        ? t('promotion.active')
                        : t('promotion.inactive')
                    }
                    color={
                      promotionLine.status === 'active' ? 'success' : 'default'
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
          </List>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              mt: 2,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5]}
                pagination
                autoHeight
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('dashboard.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionLineDetail;
