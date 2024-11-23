import React, { useState } from 'react';
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
import { Invoice } from 'src/api/invoice/types';
import CreateRefundInvoice from './CreateRefundInvoice';
import InvoicePrintModal from 'src/modules/dashboard/component/InvoicePrintModal';

interface InvoiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  invoiceData: Invoice | null;
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

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
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
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const itemColumns = createItemColumns(t);

  const handlePrint = () => {
    setPrintModalOpen(true);
  };

  const handleRefundClose = () => {
    setRefundModalOpen(false);
    refetch();
  };

  const handleRefundSuccess = () => {
    handleRefundClose();
    onClose();
  };

  if (!invoiceData) return null;

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
                {invoice.staff && (
                  <>
                    {invoice.staff.staffId && (
                      <>
                        <ListItem>
                          <ListItemText primary={t('invoice.staffId')} />
                          <Typography
                            variant="body2"
                            textAlign="right"
                            color="grey.600"
                          >
                            {invoice.staff.staffId}
                          </Typography>
                        </ListItem>
                        <Divider variant="middle" />
                      </>
                    )}
                    {invoice.staff.name && (
                      <>
                        <ListItem>
                          <ListItemText primary={t('invoice.staffName')} />
                          <Typography
                            variant="body2"
                            textAlign="right"
                            color="grey.600"
                          >
                            {invoice.staff.name}
                          </Typography>
                        </ListItem>
                        <Divider variant="middle" />
                      </>
                    )}
                  </>
                )}
                {invoice.customer.custId && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('invoice.custID')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {invoice.customer.custId}
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
                      pageSize: invoiceData.items?.length || 0,
                      page: 0,
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
                  {invoice.promotion && invoice.promotion.length > 0 ? (
                    <DataGrid
                      rows={invoice.promotion || []}
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
                        pageSize: invoiceData.items?.length || 0,
                        page: 0,
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
                      }).format(invoice.sub_total)}
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
                      {invoice.discount.per}% (
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(invoice.discount.value_max)}
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
                      }).format(invoice.final_total)}
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
          {!invoiceData.isRefund && (
            <Button
              onClick={() => setRefundModalOpen(true)}
              color="primary"
              variant="contained"
            >
              {t('invoice.refund')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <InvoicePrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        invoiceData={invoiceData}
      />

      {/* Refund Invoice Modal */}
      <CreateRefundInvoice
        open={refundModalOpen}
        onClose={handleRefundClose}
        invoiceId={invoiceData._id}
        refetch={refetch}
        onSuccess={handleRefundSuccess}
      />
    </>
  );
};

export default InvoiceDetailModal;
