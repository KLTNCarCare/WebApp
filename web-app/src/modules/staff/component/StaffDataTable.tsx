import React, { useState } from 'react';
import { Dialog, LinearProgress, Paper, Button } from '@mui/material';
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
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Staff } from 'src/api/staff/types';
import StaffDetailModal from './StaffDetailModal';
import EditStaffModal from './EditStaff';
import GrantAccount from './GrantAccount';
import RevokeAccount from './RevokeAccount';

interface StaffDataTableProps {
  dataStaff: Staff[];
  isLoadingStaff: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createStaffColumns = (
  t: (key: string) => string,
  handleGrantAccountClick: (staffData: Staff) => void,
  handleEditClick: (staffData: Staff) => void,
  handleDetailClick: (staffData: Staff) => void,
  handleRevokeAccountClick: (staffData: Staff) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('staff.index'),
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
    field: 'staffId',
    headerName: t('staff.staffId'),
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.staffId || '',
  },
  {
    field: 'name',
    headerName: t('staff.name'),
    minWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.name || '',
  },
  {
    field: 'phone',
    headerName: t('staff.phone'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.phone || '',
  },
  {
    field: 'role',
    headerName: t('staff.role'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const role = params.row.role;
      return role === 'staff'
        ? t('staff.roleStaff')
        : role === 'admin'
        ? t('staff.roleAdmin')
        : role;
    },
  },
  {
    field: 'isAccount',
    headerName: t('staff.isAccount'),
    minWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      return params.row.isAccount
        ? t('staff.hasAccount')
        : t('staff.noAccount');
    },
  },
  {
    field: 'action',
    headerName: '',
    minWidth: 150,
    flex: 1,
    align: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {params.row.isAccount === false && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleGrantAccountClick(params.row)}
          >
            {t('staff.grantAccount')}
          </Button>
        )}
        <EditIcon
          sx={{ cursor: 'pointer', color: '#a1a0a0' }}
          onClick={() => handleEditClick(params.row)}
        />
        {params.row.isAccount === true && params.row.role !== 'admin' && (
          <PersonOffIcon
            sx={{ cursor: 'pointer', color: '#a1a0a0' }}
            onClick={() => handleRevokeAccountClick(params.row)}
          />
        )}
      </div>
    ),
  },
];

const StaffDataTable: React.FC<StaffDataTableProps> = ({
  dataStaff,
  isLoadingStaff,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const [isDetailStaffOpen, setIsDetailStaffOpen] = useState(false);
  const [detailStaffData, setDetailStaffData] = useState<Staff | null>(null);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [editStaffData, setEditStaffData] = useState<Staff | null>(null);
  const [isGrantAccountOpen, setIsGrantAccountOpen] = useState(false);
  const [grantAccountData, setGrantAccountData] = useState<Staff | null>(null);
  const [isRevokeAccountOpen, setIsRevokeAccountOpen] = useState(false);
  const [revokeAccountData, setRevokeAccountData] = useState<Staff | null>(
    null
  );

  const handleRowClick = (params: GridRowParams) => {
    setDetailStaffData(params.row as Staff);
    setIsDetailStaffOpen(true);
  };

  const handleGrantAccountClick = (staffData: Staff) => {
    setGrantAccountData(staffData);
    setIsGrantAccountOpen(true);
  };

  const handleEditClick = (staffData: Staff) => {
    setEditStaffData(staffData);
    setIsEditStaffOpen(true);
    setIsDetailStaffOpen(false);
  };

  const handleDetailClick = (staffData: Staff) => {
    setDetailStaffData(staffData);
    setIsDetailStaffOpen(true);
  };

  const handleRevokeAccountClick = (staffData: Staff) => {
    if (staffData.role !== 'admin') {
      setRevokeAccountData(staffData);
      setIsRevokeAccountOpen(true);
    }
  };

  const handleCloseEditStaffModal = () => {
    setIsEditStaffOpen(false);
  };

  const handleCloseEditStaff = async () => {
    setIsEditStaffOpen(false);
    await refetch();
    setIsDetailStaffOpen(true);
  };

  const handleCloseDetailStaff = () => {
    setIsDetailStaffOpen(false);
    refetch();
  };

  const handleCloseGrantAccount = () => {
    setIsGrantAccountOpen(false);
    refetch();
  };

  const handleCloseRevokeAccount = () => {
    setIsRevokeAccountOpen(false);
    refetch();
  };

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataStaff}
            columns={createStaffColumns(
              t,
              handleGrantAccountClick,
              handleEditClick,
              handleDetailClick,
              handleRevokeAccountClick,
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
            loading={isLoadingStaff}
            onRowClick={handleRowClick}
          />
        </div>
      </Paper>

      {detailStaffData && (
        <StaffDetailModal
          open={isDetailStaffOpen}
          onClose={handleCloseDetailStaff}
          staffData={detailStaffData}
          refetch={refetch}
        />
      )}

      <Dialog
        open={isEditStaffOpen}
        onClose={handleCloseEditStaffModal}
        maxWidth="md"
        fullWidth
      >
        {isEditStaffOpen && editStaffData && (
          <EditStaffModal
            open={isEditStaffOpen}
            onClose={handleCloseEditStaffModal}
            staffData={editStaffData}
            refetch={handleCloseEditStaff}
            setIsEditStaff={setIsEditStaffOpen}
          />
        )}
      </Dialog>

      {grantAccountData && (
        <GrantAccount
          open={isGrantAccountOpen}
          onClose={handleCloseGrantAccount}
          staff={grantAccountData}
          refetch={refetch}
        />
      )}

      {revokeAccountData && (
        <RevokeAccount
          staff={revokeAccountData}
          open={isRevokeAccountOpen}
          onClose={handleCloseRevokeAccount}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default StaffDataTable;
