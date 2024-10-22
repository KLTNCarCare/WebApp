import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
  ButtonBase,
  DialogContent,
  Paper,
  Chip,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
  viVN,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Close as CloseIcon } from '@mui/icons-material';
import { PriceCatalogManagement } from 'src/api/priceCatalog/useGetPriceCatalog';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import EditIcon from '@mui/icons-material/Edit';
import DeletePriceCatalog from './DeletePriceCatalog';
import PriceCatalogDetailModal from './PriceCatalogDetailModal';
import EditPriceCatalogModal from './EditPriceCatalogModal';
import StatusToggle from './StatusToggle';
interface PriceCatalogDataTableProps {
  dataPriceCatalog: any[];
  isLoadingPriceCatalog: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createPriceCatalogColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  handleEditClick: (priceCatalogData: any) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('priceCatalog.index'),
    maxWidth: 100,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const allRowIds = params.api.getAllRowIds();
      return allRowIds.indexOf(params.id) + 1;
    },
  },
  {
    field: 'priceId',
    headerName: t('priceCatalog.priceId'),
    maxWidth: 100,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.priceId || '',
  },
  {
    field: 'priceName',
    headerName: t('priceCatalog.priceName'),
    maxWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.priceName || '',
  },
  {
    field: 'status',
    headerName: t('priceCatalog.status'),
    maxWidth: 200,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <div
        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
          event.stopPropagation()
        }
      >
        <Chip
          label={
            params.row.status === 'active'
              ? t('category.active')
              : t('category.inactive')
          }
          color={params.row.status === 'active' ? 'success' : 'default'}
        />
      </div>
    ),
  },
  {
    field: 'startDate',
    headerName: t('priceCatalog.startDate'),
    maxWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const date = new Date(params.row.startDate);
      return date.toLocaleDateString('vi-VN');
    },
  },
  {
    field: 'endDate',
    headerName: t('priceCatalog.endDate'),
    maxWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const date = new Date(params.row.endDate);
      return date.toLocaleDateString('vi-VN');
    },
  },
  {
    field: 'action',
    headerName: '',
    minWidth: 150,
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
        <DeletePriceCatalog _id={params.row._id} refetch={refetch} />
      </div>
    ),
  },
];

const PriceCatalogDataTable: React.FC<PriceCatalogDataTableProps> = ({
  dataPriceCatalog,
  isLoadingPriceCatalog,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const [selectedPriceCatalog, setSelectedPriceCatalog] =
    useState<PriceCatalogManagement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [isEditPriceCatalogOpen, setIsEditPriceCatalogOpen] = useState(false);
  const [editPriceCatalogData, setEditPriceCatalogData] = useState<any>(null);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedPriceCatalog(params.row as PriceCatalogManagement);
  };

  const handleStatusClick = (id: string, currentStatus: string) => {};

  const handleEditClick = (priceCatalogData: any) => {
    setEditPriceCatalogData(priceCatalogData);
    setIsEditPriceCatalogOpen(true);
  };

  useEffect(() => {
    if (selectedPriceCatalog && selectedPriceCatalog._id) {
      if (paginationModel.page !== previousPage) {
        setPreviousPage(paginationModel.page);
      }
    }
  }, [selectedPriceCatalog, paginationModel.page]);

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataPriceCatalog}
            columns={createPriceCatalogColumns(
              t,
              handleStatusClick,
              handleEditClick,
              paginationModel,
              refetch
            )}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            getRowId={(row) => row._id}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              if (!selectedPriceCatalog || !selectedPriceCatalog._id) {
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
            loading={isLoadingPriceCatalog}
            onRowClick={handleRowClick}
          />
        </div>
      </Paper>

      {selectedPriceCatalog && (
        <PriceCatalogDetailModal
          open={!!selectedPriceCatalog}
          onClose={() => setSelectedPriceCatalog(null)}
          priceCatalogData={selectedPriceCatalog}
          refetch={refetch}
          dataPriceCatalog={null}
          isLoadingPriceCatalog={isLoadingPriceCatalog}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      )}

      <Dialog
        open={isEditPriceCatalogOpen}
        onClose={() => setIsEditPriceCatalogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {isEditPriceCatalogOpen && editPriceCatalogData && (
          <EditPriceCatalogModal
            open={isEditPriceCatalogOpen}
            onClose={() => setIsEditPriceCatalogOpen(false)}
            priceCatalogData={editPriceCatalogData}
            refetch={refetch}
            setIsEditPriceCatalog={setIsEditPriceCatalogOpen}
          />
        )}
      </Dialog>
    </>
  );
};

export default PriceCatalogDataTable;
