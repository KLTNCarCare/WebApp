import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { PromotionLine } from 'src/api/promotionLine/useGetPromotionLine';
import { useTranslation } from 'react-i18next';
import { Chip, Button, Box } from '@mui/material';
import PromotionLineDetail from './PromotionLineDetail';
import AddPromotionLineModal from './AddPromotionLineModal';
import EditPromotionLineModal from './EditPromotionLineModal'; // Import EditPromotionLineModal
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { useCreatePromotionLine } from 'src/api/promotionLine/useCreatePromotionLine';
import { CreatePromotionLineFn } from 'src/api/promotionLine/types';
import snackbarUtils from 'src/lib/snackbarUtils';
import EditIcon from '@mui/icons-material/Edit';
import DeletePromotionLine from './DeletePromotionLine';

interface PromotionLineDataGridProps {
  promotionLineData: PromotionLine[];
  promotionId: string;
  refetch: () => void;
}

const PromotionLineDataGrid: React.FC<PromotionLineDataGridProps> = ({
  promotionLineData,
  promotionId,
  refetch,
}) => {
  const { t } = useTranslation();
  const [selectedPromotionLine, setSelectedPromotionLine] =
    React.useState<PromotionLine | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [rows, setRows] = React.useState<PromotionLine[]>(promotionLineData);

  const createPromotionLineMutation = useCreatePromotionLine({
    onSuccess: (newLine) => {
      setRows((prevRows) => [...prevRows, newLine]);
      snackbarUtils.success('Thêm thành công!');
      refetch();
    },
    onError: (error: any) => {
      snackbarUtils.error(`${error.message}`);
    },
  });

  const handleRowClick = (params: any) => {
    setSelectedPromotionLine(params.row);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedPromotionLine(null);
  };

  const handleAddNewLine = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleEditClick = (line: PromotionLine) => {
    setSelectedPromotionLine(line);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedPromotionLine(null);
  };

  const handleAdd = (newLine: PromotionLine) => {
    if (newLine.detail && Array.isArray(newLine.detail)) {
      const newLineData: CreatePromotionLineFn = {
        parentId: newLine.parentId,
        description: newLine.description,
        type: newLine.type as 'discount-service' | 'discount-bill',
        startDate: new Date(newLine.startDate).getTime(),
        endDate: new Date(newLine.endDate).getTime(),
        detail: newLine.detail,
      };
      createPromotionLineMutation.mutate(newLineData);
      setAddModalOpen(false);
    } else {
      console.error('Invalid detail data:', newLine.detail);
    }
  };

  const columns: GridColDef<PromotionLine>[] = [
    {
      field: 'index',
      headerName: t('promotionLine.index'),
      width: 50,
      valueGetter: (params: GridValueGetterParams) =>
        params.api.getSortedRowIds().indexOf(params.id) + 1,
    },
    { field: 'lineId', headerName: t('promotionLine.lineId'), width: 150 },
    {
      field: 'description',
      headerName: t('promotionLine.description'),
      width: 300,
    },
    {
      field: 'type',
      headerName: t('promotionLine.type'),
      width: 150,
      valueGetter: (params: GridValueGetterParams) => {
        const type = params.value as string;
        return type === 'discount-service'
          ? t('promotionLine.discountService')
          : t('promotionLine.discountBill');
      },
    },
    {
      field: 'startDate',
      headerName: t('promotionLine.startDate'),
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: 'endDate',
      headerName: t('promotionLine.endDate'),
      width: 150,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.value as string).toLocaleDateString(),
    },
    {
      field: 'status',
      headerName: t('promotionLine.status'),
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={
            params.value === 'active'
              ? t('promotion.active')
              : t('promotion.inactive')
          }
          color={params.value === 'active' ? 'success' : 'default'}
          sx={{ ml: 1 }}
        />
      ),
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
          {/* <EditIcon
            sx={{ cursor: 'pointer', color: '#a1a0a0' }}
            onClick={() => handleEditClick(params.row)}
          /> */}
          <DeletePromotionLine _id={params.row._id} refetch={refetch} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddNewLine}>
          {t('promotionLine.addNewLine')}
        </Button>
      </Box>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          pagination
          getRowId={(row) => row._id}
          onRowClick={handleRowClick}
          autoHeight
          slots={{
            noRowsOverlay: () => (
              <EmptyScreen titleEmpty={t('dashboard.noDataAvailable')} />
            ),
          }}
        />
      </div>
      <PromotionLineDetail
        open={detailOpen}
        onClose={handleCloseDetail}
        promotionLine={selectedPromotionLine}
      />
      <AddPromotionLineModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
        promotionId={promotionId}
      />
      {selectedPromotionLine && (
        <EditPromotionLineModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          promotionLineData={selectedPromotionLine}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default PromotionLineDataGrid;
