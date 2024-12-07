import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';

interface CustomerItemDetails {
  serviceId: string;
  serviceName: string;
  sale_before: number;
  discount: number;
  sale_after: number;
}

interface CustomerItem {
  custId: string;
  custName: string;
  sale_before: number;
  discount: number;
  sale_after: number;
  items: CustomerItemDetails[];
}

interface CustomerRow {
  sale_before: number;
  discount: number;
  sale_after: number;
  items: CustomerItem[];
}

interface CustomerDataTableProps {
  rows: CustomerRow[];
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
  isLoading: boolean;
}

const CustomerDataTable: React.FC<CustomerDataTableProps> = ({
  rows,
  paginationModel,
  setPaginationModel,
  totalPage,
  isLoading,
}) => {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h5" sx={{ paddingBottom: 2 }}>
        Thống kê khách hàng
      </Typography>
      {isLoading ? (
        <LinearProgress />
      ) : rows && rows.length === 0 ? (
        <EmptyScreen titleEmpty="No data available" />
      ) : (
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(11, 1fr)',
              gap: 2,
              alignItems: 'center',
              justifyItems: 'center',
              marginBottom: 2,
              marginLeft: 1,
            }}
          >
            <Typography>STT</Typography>
            <Typography>MÃ KH</Typography>
            <Typography>TÊN KH</Typography>
            <Typography>Mã dịch vụ</Typography>
            <Typography>Tên dịch vụ</Typography>
            <Typography sx={{ gridColumn: 'span 2' }}>
              DOANH SỐ TRƯỚC CK
            </Typography>
            <Typography sx={{ gridColumn: 'span 2' }}>CHIẾT KHẤU</Typography>
            <Typography sx={{ gridColumn: 'span 2' }}>
              DOANH SỐ SAU CK
            </Typography>
          </Box>

          <Box sx={{ backgroundColor: '#e6f7ff' }}>
            {rows?.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  marginBottom: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  padding: 2,
                  display: 'grid',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(11, 1fr)',
                    gap: 2,
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    sx={{
                      gridColumn: 'span 5',
                      textAlign: 'end',
                      fontWeight: 'bold',
                    }}
                  >
                    Tổng cộng
                  </Typography>
                  <Typography
                    sx={{
                      gridColumn: 'span 2',
                      textAlign: 'end',
                      fontWeight: 'bold',
                    }}
                  >
                    {(row.sale_before ?? 0).toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{
                      gridColumn: 'span 2',
                      textAlign: 'end',
                      fontWeight: 'bold',
                    }}
                  >
                    {(row.discount ?? 0).toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{
                      gridColumn: 'span 2',
                      textAlign: 'end',
                      fontWeight: 'bold',
                    }}
                  >
                    {(row.sale_after ?? 0).toLocaleString()}
                  </Typography>
                </Box>

                {row.items?.map((customerItem, staffIndex) => (
                  <Box
                    key={staffIndex}
                    sx={{
                      marginBottom: 2,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      padding: 2,
                    }}
                  >
                    <Box>
                      {customerItem.items?.map((detail, detailIndex) => (
                        <Box
                          key={detailIndex}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(11, 1fr)',
                            gap: 2,
                            alignItems: 'center',
                            marginBottom: 1,
                          }}
                        >
                          <Typography>{detailIndex + 1}</Typography>
                          <Typography>
                            {customerItem.custId || 'Chưa có mã khách'}
                          </Typography>
                          {/* Mã khách */}
                          <Typography sx={{ gridColumn: 'span 1' }}>
                            {customerItem.custName || 'Chưa có tên khách'}
                          </Typography>
                          {/* Tên khách */}
                          <Typography>{detail.serviceId}</Typography>
                          <Typography>{detail.serviceName}</Typography>

                          <Typography
                            sx={{ gridColumn: 'span 2', textAlign: 'end' }}
                          >
                            {detail.sale_before.toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{ gridColumn: 'span 2', textAlign: 'end' }}
                          >
                            {(detail.discount ?? 0).toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{ gridColumn: 'span 2', textAlign: 'end' }}
                          >
                            {detail.sale_after.toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        cursor: 'pointer',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(11, 1fr)',
                        gap: 2,
                        alignItems: 'center',
                        justifyItems: 'end',
                      }}
                    >
                      <Typography
                        sx={{ gridColumn: 'span 5', fontWeight: 'bold' }}
                      >
                        Tổng cộng
                      </Typography>
                      <Typography sx={{ gridColumn: 'span 2' }}>
                        {customerItem.sale_before.toLocaleString()}
                      </Typography>
                      <Typography sx={{ gridColumn: 'span 2' }}>
                        {(customerItem.discount ?? 0).toLocaleString()}
                      </Typography>
                      <Typography sx={{ gridColumn: 'span 2' }}>
                        {customerItem.sale_after.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

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

export default CustomerDataTable;
