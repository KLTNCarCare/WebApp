import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Paper,
  Divider,
  ListItemText,
  ListItem,
  List,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { InvoiceData } from 'src/api/refundInvoice/types';

interface RefundInvoiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
  refetch: () => void;
  isLoadingInvoice: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  onBack: () => void;
}

const createItemColumns = (t: (key: string) => string): GridColDef[] => [
  {
    field: 'serviceName',
    headerName: t('invoice.itemName'),
    minWidth: 300,
    flex: 1,
  },
  {
    field: 'price',
    headerName: t('invoice.itemPrice'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(params.row.price),
  },
  {
    field: 'discount',
    headerName: t('invoice.itemDiscount'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.discount}%`,
  },
  {
    field: 'total',
    headerName: t('invoice.itemTotal'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(params.row.total),
  },
];

const RefundInvoiceDetailModal: React.FC<RefundInvoiceDetailModalProps> = ({
  open,
  onClose,
  invoiceData,
  refetch,
  isLoadingInvoice,
  paginationModel,
  setPaginationModel,
  onBack,
}) => {
  const { t } = useTranslation();
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const itemColumns = createItemColumns(t);

  const handlePrint = () => {
    setPrintModalOpen(true);
  };

  useEffect(() => {
    if (printModalOpen) {
      setPrintModalOpen(false);
      onClose();
      setTimeout(() => {
        refetch();
      }, 500);
    }
  }, [printModalOpen, onClose, refetch]);

  if (!invoiceData) return null;

  const invoiceArray = Array.isArray(invoiceData) ? invoiceData : [invoiceData];

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h2" align="center">
            {t('invoice.refundInvoiceDetails')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {invoiceArray.map((invoice) => (
            <Box key={invoice._id} sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h4">{t('invoice.header')}</Typography>
              <List>
                {invoice.invoiceRefundId && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.invoiceRefundId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoiceRefundId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.reason && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.reason')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="red.600"
                      >
                        {invoice.reason}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.invoice.invoiceId && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.invoiceId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoice.invoiceId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.invoice.customer.custId && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.custID')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoice.customer.custId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.invoice.customer.name && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.customerName')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoice.customer.name}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.invoice.customer.phone && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.customerPhone')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoice.customer.phone}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.invoice.vehicle.licensePlate && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={t('invoice.vehicleLicensePlate')}
                      />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoice.vehicle.licensePlate}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.invoice.vehicle.model && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.vehicleModel')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoice.vehicle.model}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.createdAt && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.createdAt')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
              </List>

              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Typography variant="h4">{t('invoice.items')}</Typography>
                <Paper sx={{ flex: 1, p: 2 }}>
                  <DataGrid
                    rows={invoice.invoice.items || []}
                    columns={itemColumns}
                    pagination
                    paginationModel={{
                      pageSize: paginationModel.pageSize,
                      page: paginationModel.page,
                    }}
                    onPaginationModelChange={(model) =>
                      setPaginationModel(model)
                    }
                    disableRowSelectionOnClick
                    autoHeight
                    getRowId={(row) => row.serviceId}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      },
                    }}
                    slots={{
                      noRowsOverlay: () => (
                        <EmptyScreen
                          titleEmpty={t('dashboard.noDataAvailable')}
                        />
                      ),
                    }}
                  />
                </Paper>
              </Box>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Typography variant="h4">{t('invoice.promotion')}</Typography>
                <Paper sx={{ flex: 1, p: 2 }}>
                  {invoice.invoice.promotion &&
                  invoice.invoice.promotion.length > 0 ? (
                    <DataGrid
                      rows={invoice.invoice.promotion || []}
                      columns={[
                        {
                          field: 'code',
                          headerName: t('invoice.promotionCode'),
                          minWidth: 150,
                          flex: 1,
                        },
                        {
                          field: 'description',
                          headerName: t('invoice.promotionDescription'),
                          minWidth: 300,
                          flex: 1,
                        },
                      ]}
                      pagination
                      paginationModel={{
                        pageSize: paginationModel.pageSize,
                        page: paginationModel.page,
                      }}
                      onPaginationModelChange={(model) =>
                        setPaginationModel(model)
                      }
                      disableRowSelectionOnClick
                      autoHeight
                      getRowId={(row) => row.promotion_line}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        },
                      }}
                      slots={{
                        noRowsOverlay: () => (
                          <EmptyScreen
                            titleEmpty={t('dashboard.noDataAvailable')}
                          />
                        ),
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      textAlign="center"
                      color="grey.600"
                    >
                      {t('invoice.noPromotions')}
                    </Typography>
                  )}
                </Paper>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h4">{t('invoice.summary')}</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary={t('invoice.subTotal')} />
                    <Typography
                      variant="body2"
                      textAlign="right"
                      color="grey.600"
                    >
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(invoice.invoice.sub_total)}
                    </Typography>
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem>
                    <ListItemText primary={t('invoice.discount')} />
                    <Typography
                      variant="body2"
                      textAlign="right"
                      color="grey.600"
                    >
                      {invoice.invoice.discount.per}% (
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(invoice.invoice.discount.value_max)}
                      )
                    </Typography>
                  </ListItem>
                  <Divider variant="middle" />
                  <ListItem>
                    <ListItemText primary={t('invoice.finalTotal')} />
                    <Typography
                      variant="body2"
                      textAlign="right"
                      color="grey.600"
                    >
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(invoice.invoice.final_total)}
                    </Typography>
                  </ListItem>
                </List>
              </Box>
            </Box>
          ))}
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={onBack} color="primary" variant="contained">
            {t('invoice.back')}
          </Button>
          <Button onClick={handlePrint} color="primary" variant="contained">
            {t('invoice.print')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RefundInvoiceDetailModal;
