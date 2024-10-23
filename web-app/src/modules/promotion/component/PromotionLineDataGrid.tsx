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
import EmptyScreen from 'src/components/layouts/EmtyScreen';
import { useCreatePromotionLine } from 'src/api/promotionLine/useCreatePromotionLine';
import { CreatePromotionLineFn } from 'src/api/promotionLine/types';

interface PromotionLineDataGridProps {
  promotionLineData: PromotionLine[];
  promotionId: string;
}

const PromotionLineDataGrid: React.FC<PromotionLineDataGridProps> = ({
  promotionLineData,
  promotionId,
}) => {
  const { t } = useTranslation();
  const [selectedPromotionLine, setSelectedPromotionLine] =
    React.useState<PromotionLine | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [rows, setRows] = React.useState<PromotionLine[]>(promotionLineData);

  const createPromotionLineMutation = useCreatePromotionLine({
    onSuccess: (newLine) => {
      setRows((prevRows) => [...prevRows, newLine]);
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

  const handleAdd = (newLine: PromotionLine) => {
    const newLineData: CreatePromotionLineFn = {
      parentId: newLine.parentId,
      description: newLine.description,
      type: newLine.type as 'discount-service' | 'discount-bill',
      startDate: new Date(newLine.startDate).getTime(),
      endDate: new Date(newLine.endDate).getTime(),
      detail: newLine.detail.map((d) => ({
        ...d,
        itemId: d.itemId ?? undefined,
        itemGiftId: d.itemGiftId ?? undefined,
      })),
      status: newLine.status,
    };
    createPromotionLineMutation.mutate(newLineData);
    setAddModalOpen(false);
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
    </>
  );
};

export default PromotionLineDataGrid;
