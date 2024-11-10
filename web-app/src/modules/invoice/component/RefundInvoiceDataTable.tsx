import React, { useState, useEffect } from 'react';
import { LinearProgress, Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
  viVN,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { InvoiceData } from 'src/api/refundInvoice/types';
import RefundInvoiceDetailModal from './RefundInvoiceDetailModal';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  refundRow: {
    backgroundColor: '#ffcccc',
  },
});

interface RefundInvoiceDataTableProps {
  dataInvoice: InvoiceData[];
  isLoadingInvoice: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createRefundInvoiceColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('invoice.index'),
    maxWidth: 50,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const allRowIds = params.api.getAllRowIds();
      return allRowIds.indexOf(params.id) + 1;
    },
  },
  {
    field: 'invoiceRefundId',
    headerName: t('invoice.invoiceRefundId'),
    maxWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.invoiceRefundId || '',
  },
  {
    field: 'custId',
    headerName: t('invoice.custID'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.invoice.customer.custId || '',
  },
  {
    field: 'name',
    headerName: t('invoice.customerName'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.invoice.customer.name || '',
  },
  {
    field: 'customerPhone',
    headerName: t('invoice.customerPhone'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.invoice.customer.phone || '',
  },
  {
    field: 'vehicleLicensePlate',
    headerName: t('invoice.vehicleLicensePlate'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.invoice.vehicle.licensePlate || '',
  },
  {
    field: 'vehicleModel',
    headerName: t('invoice.vehicleModel'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.invoice.vehicle.model || '',
  },
  {
    field: 'createdAt',
    headerName: t('invoice.createdAt'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const date = new Date(params.row.createdAt);
      return date.toLocaleDateString('vi-VN');
    },
  },
];

const RefundInvoiceDataTable: React.FC<RefundInvoiceDataTableProps> = ({
  dataInvoice,
  isLoadingInvoice,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedInvoice(params.row as InvoiceData);
    setIsDetailModalOpen(true);
  };

  const handleStatusClick = (id: string, currentStatus: string) => {};

  useEffect(() => {
    if (selectedInvoice && selectedInvoice._id) {
      setPaginationModel((prev) => ({ ...prev, page: paginationModel.page }));
    }
  }, [selectedInvoice, paginationModel.page, setPaginationModel]);

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataInvoice}
            columns={createRefundInvoiceColumns(
              t,
              handleStatusClick,
              paginationModel,
              refetch
            )}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) => row._id}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel((prev) => ({ ...prev, ...model }));
            }}
            pageSizeOptions={[TEN_ITEMS_PAGE]}
            slots={{
              loadingOverlay: LinearProgress,
              noRowsOverlay: () => (
                <EmptyScreen titleEmpty={t('dashboard.noDataAvailable')} />
              ),
              pagination: () => (
                <CustomPagination
                  paginationModel={paginationModel}
                  onPageChange={(page) =>
                    setPaginationModel((prev) => ({
                      ...prev,
                      page: page - 1,
                    }))
                  }
                  totalPage={totalPage}
                />
              ),
            }}
            loading={isLoadingInvoice}
            onRowClick={handleRowClick}
            getRowClassName={(params) =>
              params.row.isRefund ? classes.refundRow : ''
            }
          />
        </div>
      </Paper>
      {selectedInvoice && (
        <RefundInvoiceDetailModal
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onBack={() => setIsDetailModalOpen(false)}
          invoiceData={selectedInvoice}
          refetch={refetch}
          isLoadingInvoice={isLoadingInvoice}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      )}
    </>
  );
};

export default RefundInvoiceDataTable;
