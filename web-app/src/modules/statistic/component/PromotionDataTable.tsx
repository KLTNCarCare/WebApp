import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';

interface PromotionItem {
  type: string;
  serviceId?: string;
  serviceName?: string;
  total_apply: number;
  total_amount: number;
}

interface Promotion {
  promotionId: string;
  promotionName: string;
  startDate: string;
  endDate: string;
  total_apply: number;
  total_amount: number;
  items: PromotionItem[];
}

interface PromotionDataTableProps {
  rows: Promotion[];
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
  isLoading: boolean;
}

const PromotionDataTable: React.FC<PromotionDataTableProps> = ({
  rows,
  paginationModel,
  setPaginationModel,
  totalPage,
  isLoading,
}) => {
  return (
    <Box sx={{ marginBottom: 4, padding: 2 }}>
      <Typography variant="h5" sx={{ paddingBottom: 2, fontWeight: 'bold' }}>
        Thống kê khuyến mãi
      </Typography>
      {isLoading ? (
        <LinearProgress />
      ) : rows.length === 0 ? (
        <EmptyScreen titleEmpty="Không có dữ liệu" />
      ) : (
        <Box>
          {rows.map((promotion, index) => (
            <Box
              key={index}
              sx={{
                marginBottom: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
                padding: 3,
                boxShadow: 2,
                backgroundColor: '#e6f7ff',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(11, 1fr)',
                  gap: 2,
                  alignItems: 'center',
                  marginBottom: 3,
                  borderRadius: 1,
                  padding: 1,
                }}
              >
                <Typography sx={{ gridColumn: 'span 10', fontWeight: 'bold' }}>
                  Chương trình khuyến mãi: {promotion.promotionName}
                </Typography>
                <Typography sx={{ gridColumn: 'span 2' }}>
                  Mã KM: {promotion.promotionId}
                </Typography>
                <Typography sx={{ gridColumn: 'span 2' }}>
                  Ngày bắt đầu: {promotion.startDate}
                </Typography>
                <Typography sx={{ gridColumn: 'span 3' }}>
                  Ngày kết thúc: {promotion.endDate}
                </Typography>
                <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                  Tổng số lần áp dụng: {promotion.total_apply.toLocaleString()}
                </Typography>
                <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                  Tổng tiền: {promotion.total_amount.toLocaleString()} VND
                </Typography>
              </Box>
              {promotion.items.length > 0 ? (
                promotion.items.map((item, itemIndex) => (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(11, 1fr)',
                      gap: 2,
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {itemIndex + 1}
                    </Typography>
                    <Typography sx={{ gridColumn: 'span 3' }}>
                      Dịch vụ: {item.serviceName || 'Không có tên dịch vụ'}
                    </Typography>
                    <Typography sx={{ gridColumn: 'span 3' }}>
                      Loại dịch vụ:{' '}
                      {item.type === 'discount-bill'
                        ? 'Giảm giá hóa đơn'
                        : 'Giảm giá dịch vụ'}
                    </Typography>
                    <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                      {item.total_apply.toLocaleString()}
                    </Typography>
                    <Typography sx={{ gridColumn: 'span 2', textAlign: 'end' }}>
                      {item.total_amount.toLocaleString()} VND
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ textAlign: 'center', color: 'gray' }}>
                  Không có dịch vụ nào
                </Typography>
              )}
            </Box>
          ))}

          <CustomPagination
            paginationModel={paginationModel}
            onPageChange={(page) =>
              setPaginationModel((prev) => ({ ...prev, page: page - 1 }))
            }
            totalPage={totalPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default PromotionDataTable;
