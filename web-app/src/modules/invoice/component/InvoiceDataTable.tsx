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
import { Invoice } from 'src/api/invoice/types';
import InvoiceDetailModal from './InvoiceDetailModal';

interface InvoiceDataTableProps {
  dataInvoice: any[];
  isLoadingInvoice: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createInvoiceColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('invoice.index'),
    maxWidth: 100,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const allRowIds = params.api.getAllRowIds();
      return allRowIds.indexOf(params.id) + 1;
    },
  },
  {
    field: 'invoiceId',
    headerName: t('invoice.invoiceId'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.invoiceId || '',
  },
  {
    field: 'custId',
    headerName: t('invoice.custID'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.customer.custId || '',
  },
  {
    field: 'customerName',
    headerName: t('invoice.customerName'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.customer.name || '',
  },
  {
    field: 'customerPhone',
    headerName: t('invoice.customerPhone'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.customer.phone || '',
  },
  {
    field: 'vehicleLicensePlate',
    headerName: t('invoice.vehicleLicensePlate'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.vehicle.licensePlate || '',
  },
  {
    field: 'vehicleModel',
    headerName: t('invoice.vehicleModel'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.vehicle.model || '',
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
  {
    field: 'updatedAt',
    headerName: t('invoice.updatedAt'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const date = new Date(params.row.updatedAt);
      return date.toLocaleDateString('vi-VN');
    },
  },
];

const InvoiceDataTable: React.FC<InvoiceDataTableProps> = ({
  dataInvoice,
  isLoadingInvoice,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedInvoice(params.row as Invoice);
    setIsDetailModalOpen(true);
  };

  const handleStatusClick = (id: string, currentStatus: string) => {};

  useEffect(() => {
    if (selectedInvoice && selectedInvoice._id) {
      if (paginationModel.page !== previousPage) {
        setPreviousPage(paginationModel.page);
      }
    }
  }, [selectedInvoice, paginationModel.page]);

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataInvoice}
            columns={createInvoiceColumns(
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
              if (!selectedInvoice || !selectedInvoice._id) {
                setPaginationModel((prev) => ({ ...prev, ...model }));
              } else {
                setPaginationModel((prev) => ({ ...prev, page: currentPage }));
              }
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
                    setPaginationModel((prev) => ({ ...prev, page: page - 1 }))
                  }
                  totalPage={totalPage}
                />
              ),
            }}
            loading={isLoadingInvoice}
            onRowClick={handleRowClick}
          />
        </div>
      </Paper>
      {selectedInvoice && (
        <InvoiceDetailModal
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

export default InvoiceDataTable;
