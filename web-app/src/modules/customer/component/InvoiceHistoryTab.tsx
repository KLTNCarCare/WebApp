import React, { useState } from 'react';
import { useGetInvoiceByCustomerID } from 'src/api/invoice/useGetInvoiceByCustomerID';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Box, LinearProgress, Paper, Typography } from '@mui/material';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import InvoiceDetailModal from 'src/modules/invoice/component/InvoiceDetailModal';
import { Invoice } from 'src/api/invoice/types';

interface InvoiceHistoryTabProps {
  customerId: string;
}

const InvoiceHistoryTab: React.FC<InvoiceHistoryTabProps> = ({
  customerId,
}) => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useGetInvoiceByCustomerID({
    customerId,
  });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const columns: GridColDef[] = [
    { field: 'invoiceId', headerName: t('invoice.invoiceId'), flex: 1 },
    {
      field: 'createdAt',
      headerName: t('invoice.createdAt'),
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      field: 'payment_method',
      headerName: t('invoice.payment_method'),
      flex: 1,
      valueFormatter: (params) => {
        return params.value === 'cash'
          ? t('invoice.cash')
          : t('invoice.transfer');
      },
    },
    {
      field: 'final_total',
      headerName: t('invoice.finalTotal'),
      flex: 1,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(params.value);
      },
    },
  ];

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Typography color="error">{t('invoice.errorLoading')}</Typography>;
  }

  const handleRowClick = (params: any) => {
    setSelectedInvoice(params.row);
  };

  const handleCloseDetailModal = () => {
    setSelectedInvoice(null);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 300, width: '100%' }}>
      <Paper sx={{ flex: 1, minHeight: 200, width: '100%' }}>
        <DataGrid
          rows={Array.isArray(data) ? data : []}
          columns={columns}
          autoHeight
          getRowId={(row) => row._id}
          onRowClick={handleRowClick}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
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

      {selectedInvoice && (
        <InvoiceDetailModal
          open={!!selectedInvoice}
          onClose={handleCloseDetailModal}
          invoiceData={selectedInvoice}
          refetch={refetch}
          isLoadingInvoice={isLoading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onBack={handleCloseDetailModal}
        />
      )}
    </Box>
  );
};

export default InvoiceHistoryTab;
