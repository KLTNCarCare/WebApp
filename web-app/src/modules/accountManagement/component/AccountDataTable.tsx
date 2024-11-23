import {
  Box,
  ButtonBase,
  Dialog,
  DialogTitle,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
  viVN,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  AccountManagement,
  AccountResponse,
} from 'src/api/account/useGetAccountsByAdmin';
import AccountDetailModal from './AccountDetailModal';
// import { columns } from 'tailwindcss/defaultTheme';

type ListAccountProps = {
  dataAccount: AccountResponse | null;
  refetch: () => void;
  isLoadingAccount: boolean;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: (model: { page: number; pageSize: number }) => void;
};

const createColumns = (
  t: (key: string) => string,
  refetch: () => void
): GridColDef[] => [
  {
    field: 'create_time',
    headerAlign: 'center',
    headerName: t('account.time'),
    minWidth: 250,
    valueFormatter: (params: GridValueFormatterParams<string>) =>
      dayjs.unix(Number(params.value)).format('dd, DD/MM/YYYY, HH:mm A'),
    align: 'center',
    filterable: false,
  },
  {
    field: 'name',
    headerAlign: 'center',
    headerName: t('account.name'),
    minWidth: 250,
    align: 'center',
    valueGetter: (params: GridValueGetterParams) => {
      if (params.row.name) {
        return params.row.name;
      }
      return '';
    },
    filterable: false,
  },
  {
    field: '_id',
    headerAlign: 'center',
    headerName: t('account.phoneNumber'),
    minWidth: 250,
    align: 'center',
    valueGetter: (params: GridValueGetterParams) => {
      if (params.row._id) {
        return params.row._id;
      }
      return '';
    },
    filterable: false,
  },
  {
    field: 'email',
    headerAlign: 'center',
    headerName: t('account.email'),
    minWidth: 250,
    align: 'center',
    valueGetter: (params: GridValueGetterParams) => {
      if (params.row.email) {
        return params.row.email;
      }
      return '';
    },
    filterable: false,
  },
  {
    field: 'roles',
    headerAlign: 'center',
    headerName: t('account.roles'),
    minWidth: 250,
    align: 'center',
    filterable: false,
  },
  {
    field: 'delete',
    headerName: '',
    minWidth: 120,
    align: 'center',
  },
];

const AccountDataTable = ({
  dataAccount,
  refetch,
  isLoadingAccount,
  paginationModel,
}: ListAccountProps) => {
  const { t } = useTranslation();
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [accountData, setAccountData] = useState<AccountManagement>();

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <>
      <Box sx={{ height: '90%', width: '100%' }}>
        <DataGrid
          {...data}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          getRowId={(rows) => rows._id}
          pagination
          rows={dataAccount?.data ? dataAccount.data : []}
          rowCount={dataAccount?.total || 0}
          paginationMode="server"
          columns={createColumns(t, refetch)}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: paginationModel.pageSize,
              },
            },
          }}
          //   slots={{
          //     pagination: (props) => (
          //       <CustomPagination
          //         paginationModel={paginationModel}
          //         onPageChange={(page) =>
          //           handlePaginationModelChange({ ...paginationModel, page })
          //         }
          //         rowCount={dataAccount?.total || 0}
          //         {...props}
          //       />
          //     ),
          //     loadingOverlay: LinearProgress,
          //     noRowsOverlay: () => (
          //       <EmptyScreen titleEmpty={t('dashboard.noDataAvailable')} />
          //     ),
          //   }}
          loading={isLoadingAccount}
          sx={(theme) => ({
            '.MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[50],
            },
            '.css-6s1r5b-MuiDataGrid-selectedRowCount': {
              visibility: 'hidden',
            },
            '.MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
          })}
          onCellClick={(params: GridCellParams) => {
            if (params.field !== 'delete') {
              setShowModalDetail(true);
              setAccountData(params.row);
            }
          }}
        />
      </Box>
      {/* show report detail */}
      <Dialog
        open={showModalDetail}
        fullWidth
        maxWidth="xs"
        onClose={() => setShowModalDetail(false)}
      >
        <DialogTitle p="0px !important" borderBottom="1px solid #F2F2F2">
          <Toolbar>
            <Stack direction="row" spacing={2} width="100%">
              <Typography
                variant="h4"
                align="center"
                noWrap
                flexGrow={1}
                color="grey.900"
                ml={4.25}
              >
                {t('account.accountInformation')}
              </Typography>

              <ButtonBase
                sx={{ flex: 'none' }}
                disableRipple
                onClick={() => setShowModalDetail(false)}
              >
                <CloseIcon />
              </ButtonBase>
            </Stack>
          </Toolbar>
        </DialogTitle>

        {accountData ? (
          <AccountDetailModal refetch={refetch} accountData={accountData} />
        ) : null}
      </Dialog>
    </>
  );
};

export default AccountDataTable;
