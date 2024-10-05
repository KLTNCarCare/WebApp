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
import { PromotionManagement } from 'src/api/promotion/useGetPromotion';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import CustomPagination from 'src/components/CustomPagination';
import PromotionDetailModal from './PromotionDetailModal';
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import EditIcon from '@mui/icons-material/Edit';
import DeletePromotion from './DeletePromotion';
import EditPromotionModal from './EditPromotionModal';
import { useGetPromotionLines } from 'src/api/promotionLine/useGetPromotionLine';
interface PromotionDataTableProps {
  dataPromotion: any[];
  isLoadingPromotion: boolean;
  refetch: () => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
}

const createPromotionColumns = (
  t: (key: string) => string,
  handleStatusClick: (id: string, currentStatus: string) => void,
  handleEditClick: (promotionData: any) => void,
  paginationModel: { page: number; pageSize: number },
  refetch: () => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: t('promotion.index'),
    maxWidth: 100,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => {
      const allRowIds = params.api.getAllRowIds();
      return allRowIds.indexOf(params.id) + 1;
    },
  },
  {
    field: 'promotionId',
    headerName: t('promotion.promotionId'),
    maxWidth: 100,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.promotionId || '',
  },
  {
    field: 'promotionName',
    headerName: t('promotion.promotionName'),
    maxWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.promotionName || '',
  },
  {
    field: 'description',
    headerName: t('promotion.description'),
    maxWidth: 500,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.description || '',
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
        <DeletePromotion _id={params.row._id} refetch={refetch} />
      </div>
    ),
  },
];

const PromotionDataTable: React.FC<PromotionDataTableProps> = ({
  dataPromotion,
  isLoadingPromotion,
  refetch,
  paginationModel,
  setPaginationModel,
  totalPage,
}) => {
  const { t } = useTranslation();
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionManagement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [isEditPromotionOpen, setIsEditPromotionOpen] = useState(false);
  const [editPromotionData, setEditPromotionData] = useState<any>(null);

  const {
    data: promotionLineData,
    isLoading: isLoadingPromotionLine,
    refetch: refetchPromotionLine,
  } = useGetPromotionLines(selectedPromotion?._id || '', {
    enabled: !!selectedPromotion?._id,
  });

  const handleRowClick = (params: GridRowParams) => {
    setSelectedPromotion(params.row as PromotionManagement);
  };

  const handleStatusClick = (id: string, currentStatus: string) => {
    console.log(`Current status for ${id} is ${currentStatus}`);
  };

  const handleEditClick = (promotionData: any) => {
    setEditPromotionData(promotionData);
    setIsEditPromotionOpen(true);
  };

  useEffect(() => {
    if (selectedPromotion && selectedPromotion._id) {
      if (paginationModel.page !== previousPage) {
        setPreviousPage(paginationModel.page);
      }
      if (!promotionLineData || promotionLineData.length === 0) {
        refetchPromotionLine();
      }
    }
  }, [
    selectedPromotion,
    promotionLineData,
    paginationModel.page,
    refetchPromotionLine,
  ]);

  return (
    <>
      <Paper>
        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={dataPromotion}
            columns={createPromotionColumns(
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
              if (!selectedPromotion || !selectedPromotion._id) {
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
            loading={isLoadingPromotion}
            onRowClick={handleRowClick}
          />
        </div>
      </Paper>

      {selectedPromotion && (
        <PromotionDetailModal
          open={!!selectedPromotion}
          onClose={() => setSelectedPromotion(null)}
          promotionData={selectedPromotion}
          refetch={refetch}
          dataPromotion={null}
          isLoadingPromotion={isLoadingPromotion}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          promotionLineData={promotionLineData}
          isLoadingPromotionLine={isLoadingPromotionLine}
          refetchPromotionLine={refetchPromotionLine}
        />
      )}

      <Dialog
        open={isEditPromotionOpen}
        onClose={() => setIsEditPromotionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {isEditPromotionOpen && editPromotionData && (
          <EditPromotionModal
            promotionData={editPromotionData}
            refetch={refetch}
            setIsEditPromotion={setIsEditPromotionOpen}
          />
        )}
      </Dialog>
    </>
  );
};

export default PromotionDataTable;
