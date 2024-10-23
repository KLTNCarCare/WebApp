import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { PromotionLine } from 'src/api/promotionLine/useGetPromotionLine';
import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';
import PromotionLineDetail from './PromotionLineDetail';

interface PromotionLineDataGridProps {
  promotionLineData: PromotionLine[];
}

const PromotionLineDataGrid: React.FC<PromotionLineDataGridProps> = ({
  promotionLineData,
}) => {
  const { t } = useTranslation();
  const [selectedPromotionLine, setSelectedPromotionLine] =
    React.useState<PromotionLine | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const handleRowClick = (params: any) => {
    setSelectedPromotionLine(params.row);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedPromotionLine(null);
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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={promotionLineData}
          columns={columns}
          pageSizeOptions={[5]}
          pagination
          getRowId={(row) => row._id}
          onRowClick={handleRowClick}
        />
      </div>
      <PromotionLineDetail
        open={detailOpen}
        onClose={handleCloseDetail}
        promotionLine={selectedPromotionLine}
      />
    </>
  );
};

export default PromotionLineDataGrid;
