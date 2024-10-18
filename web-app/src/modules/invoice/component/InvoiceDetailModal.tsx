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
  Chip,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { Invoice } from 'src/api/invoice/types';
import InvoicePrintModal from 'src/modules/dashboard/component/InvoicePrintModal';

interface InvoiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  invoiceData: Invoice | null; // Cập nhật kiểu dữ liệu để chấp nhận null
  refetch: () => void;
  isLoadingInvoice: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
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
    valueGetter: (params: GridValueGetterParams) => `${params.row.price} VND`,
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
    valueGetter: (params: GridValueGetterParams) => `${params.row.total} VND`,
  },
];

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  open,
  onClose,
  invoiceData,
  refetch,
  isLoadingInvoice,
  paginationModel,
  setPaginationModel,
}) => {
  const { t } = useTranslation();
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shouldReopen, setShouldReopen] = useState(false);

  const itemColumns = createItemColumns(t);

  const handlePrint = () => {
    setPrintModalOpen(true);
  };

  const handlePayment = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (paymentMethod: string) => {
    refetch();
    setShouldReopen(true);
  };

  useEffect(() => {
    if (shouldReopen) {
      setShouldReopen(false);
      onClose();
      setTimeout(() => {
        refetch();
      }, 500);
    }
  }, [shouldReopen, onClose, refetch]);

  if (!invoiceData) return null; // Kiểm tra nếu không có dữ liệu hóa đơn

  const invoiceArray = Array.isArray(invoiceData) ? invoiceData : [invoiceData];

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h2" align="center">
            {t('invoice.invoiceDetails')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {invoiceArray.map((invoice) => (
            <Box key={invoice._id} sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h4">{t('invoice.header')}</Typography>
              <List>
                {invoice.invoiceId && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.invoiceId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.invoiceId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.customer.name && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.customerName')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.customer.name}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.customer.phone && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.customerPhone')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.customer.phone}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.vehicle.licensePlate && (
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
                        {invoice.vehicle.licensePlate}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.vehicle.model && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.vehicleModel')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.vehicle.model}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {invoice.status && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.status')} />
                      <Chip
                        label={
                          invoice.status === 'unpaid'
                            ? t('invoice.unpaid')
                            : t('invoice.paid')
                        }
                        color={
                          invoice.status === 'unpaid' ? 'error' : 'success'
                        }
                        sx={{ ml: 1 }}
                      />
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
                {invoice.updatedAt && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.updatedAt')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(invoice.updatedAt).toLocaleDateString()}
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
                    rows={invoice.items || []}
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
                      {invoice.sub_total} VND
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
                      {invoice.discount.per}% ({invoice.discount.value_max} VND)
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
                      {invoice.final_total} VND
                    </Typography>
                  </ListItem>
                </List>
              </Box>
            </Box>
          ))}
        </DialogContent>

        {/* Dialog Actions */}
        {/* <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={handlePrint} color="primary" variant="contained">
            {t('invoice.print')}
          </Button>
          {invoiceData.status === 'unpaid' && (
            <Button onClick={handlePayment} color="primary" variant="contained">
              {t('invoice.pay')}
            </Button>
          )}
        </DialogActions> */}
      </Dialog>

      {/* Print and Payment Modals */}
      {/* <InvoicePrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        invoiceData={invoiceData}
      /> */}
    </>
  );
};

export default InvoiceDetailModal;
