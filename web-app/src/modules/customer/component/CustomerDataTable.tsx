import React, { useState } from 'react';
import { Chip, Dialog, LinearProgress, Paper, Button } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
  viVN,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import EditIcon from '@mui/icons-material/Edit';
import { Customer } from 'src/api/customer/types';
import CustomerDetailModal from './CustomerDetailModal';
import EditCustomerModal from './EditCustomer';

interface CustomerDataTableProps {
  dataCustomer: Customer[];
  isLoadingCustomer: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createCustomerColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  handleEditClick: (customerData: Customer) => void,
  handleDetailClick: (customerData: Customer) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('customer.index'),
    maxWidth: 50,
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => {
      const index =
        paginationModel.page * paginationModel.pageSize +
        params.api.getAllRowIds().indexOf(params.id);
      return index + 1;
    },
  },
  {
    field: 'custId',
    headerName: t('customer.customerId'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.custId || '',
  },
  {
    field: 'name',
    headerName: t('customer.customerName'),
    minWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.name || '',
  },
  {
    field: 'phone',
    headerName: t('customer.phone'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.phone || '',
  },
  {
    field: 'vehicles',
    headerName: t('customer.vehicles'),
    minWidth: 200,
    flex: 1.5,
    renderCell: (params: GridRenderCellParams) => {
      const vehicles = params.row.vehicles;
      return (
        <div>
          {vehicles.slice(0, 2).map((vehicle: any, index: number) => (
            <div key={index}>
              {vehicle.model} - {vehicle.licensePlate}
            </div>
          ))}
          {vehicles.length > 2 && (
            <div>
              ... {`${t('customer.moreVehicles')} ${vehicles.length - 2}`}
            </div>
          )}
        </div>
      );
    },
  },
  {
    field: 'createdAt',
    headerName: t('customer.createdAt'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const date = new Date(params.row.createdAt);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
  {
    field: 'action',
    headerName: '',
    minWidth: 100,
    flex: 0.5,
    align: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          paddingRight: '15px',
        }}
      >
        <EditIcon
          sx={{ cursor: 'pointer', color: '#a1a0a0' }}
          onClick={() => handleEditClick(params.row)}
        />
      </div>
    ),
  },
];

const CustomerDataTable: React.FC<CustomerDataTableProps> = ({
  dataCustomer,
  isLoadingCustomer,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const [isDetailCustomerOpen, setIsDetailCustomerOpen] = useState(false);
  const [detailCustomerData, setDetailCustomerData] = useState<Customer | null>(
    null
  );
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState<Customer | null>(
    null
  );

  const handleRowClick = (params: GridRowParams) => {
    setDetailCustomerData(params.row as Customer);
    setIsDetailCustomerOpen(true);
  };

  const handleStatusClick = (id: string, currentStatus: string) => {};

  const handleEditClick = (customerData: Customer) => {
    setEditCustomerData(customerData);
    setIsEditCustomerOpen(true);
    setIsDetailCustomerOpen(false);
  };

  const handleDetailClick = (customerData: Customer) => {
    setDetailCustomerData(customerData);
    setIsDetailCustomerOpen(true);
  };

  const handleCloseEditCustomerModal = () => {
    setIsEditCustomerOpen(false);
  };

  const handleCloseEditCustomer = async () => {
    setIsEditCustomerOpen(false);
    await refetch();
    setIsDetailCustomerOpen(true);
  };

  const handleCloseDetailCustomer = () => {
    setIsDetailCustomerOpen(false);
    refetch();
  };

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataCustomer}
            columns={createCustomerColumns(
              t,
              handleStatusClick,
              handleEditClick,
              handleDetailClick,
              paginationModel,
              refetch
            )}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) =>
              row._id || row.id || Math.random().toString(36).substr(2, 9)
            }
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
                    setPaginationModel((prev) => ({ ...prev, page: page - 1 }))
                  }
                  totalPage={totalPage}
                />
              ),
            }}
            loading={isLoadingCustomer}
            onRowClick={handleRowClick}
          />
        </div>
      </Paper>

      {detailCustomerData && (
        <CustomerDetailModal
          open={isDetailCustomerOpen}
          onClose={handleCloseDetailCustomer}
          customerData={detailCustomerData}
          refetch={refetch}
        />
      )}

      <Dialog
        open={isEditCustomerOpen}
        onClose={handleCloseEditCustomerModal}
        maxWidth="md"
        fullWidth
      >
        {isEditCustomerOpen && editCustomerData && (
          <EditCustomerModal
            customerData={editCustomerData}
            refetch={handleCloseEditCustomer}
            setIsEditCustomer={setIsEditCustomerOpen}
          />
        )}
      </Dialog>
    </>
  );
};

export default CustomerDataTable;
