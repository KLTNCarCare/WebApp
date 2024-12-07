import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';

interface StaffItemDetails {
  date: string;
  total_sale_before: number;
  total_discount: number;
  total_sale_after: number;
}

interface StaffItem {
  staffId: string;
  staffName: string;
  total_sale_before: number;
  total_discount: number;
  total_after: number;
  items: StaffItemDetails[];
}

interface StaffRow {
  total_sale_before: number;
  total_discount: number;
  total_sale_after: number;
  items: StaffItem[];
}

interface StaffDataTableProps {
  rows: StaffRow[];
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
  isLoading: boolean;
}

const StaffDataTable: React.FC<StaffDataTableProps> = ({
  rows,
  paginationModel,
  setPaginationModel,
  totalPage,
  isLoading,
}) => {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h5" sx={{ paddingBottom: 2 }}>
        Thống kê nhân viên
      </Typography>
      {isLoading ? (
        <LinearProgress />
      ) : rows.length === 0 ? (
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
            <Typography>MÃ NV</Typography>
            <Typography
              sx={{
                gridColumn: 'span 2',
              }}
            >
              TÊN NV
            </Typography>
            <Typography>NGÀY LẬP</Typography>
            <Typography
              sx={{
                gridColumn: 'span 2',
              }}
            >
              DOANH SỐ TRƯỚC CK
            </Typography>
            <Typography
              sx={{
                gridColumn: 'span 2',
              }}
            >
              CHIẾT KHẤU
            </Typography>
            <Typography
              sx={{
                gridColumn: 'span 2',
              }}
            >
              DOANH SỐ SAU CK
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: '#e6f7ff' }}>
            {rows.map((row, rowIndex) => (
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
                    {(row.total_sale_before ?? 0).toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{
                      gridColumn: 'span 2',
                      textAlign: 'end',
                      fontWeight: 'bold',
                    }}
                  >
                    {(row.total_discount ?? 0).toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{
                      gridColumn: 'span 2',
                      textAlign: 'end',
                      fontWeight: 'bold',
                    }}
                  >
                    {(row.total_sale_after ?? 0).toLocaleString()}
                  </Typography>
                </Box>

                {row.items.map((staffItem, staffIndex) => (
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
                      {staffItem.items.map((detail, detailIndex) => (
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
                          <Typography>{staffItem.staffId}</Typography>
                          <Typography
                            sx={{
                              gridColumn: 'span 2',
                            }}
                          >
                            {staffItem.staffName}
                          </Typography>
                          <Typography>{detail.date}</Typography>
                          <Typography
                            sx={{
                              gridColumn: 'span 2',
                              textAlign: 'end',
                            }}
                          >
                            {detail.total_sale_before.toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{
                              gridColumn: 'span 2',
                              textAlign: 'end',
                            }}
                          >
                            {detail.total_discount.toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{
                              gridColumn: 'span 2',
                              textAlign: 'end',
                            }}
                          >
                            {detail.total_sale_after.toLocaleString()}
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
                        sx={{
                          gridColumn: 'span 5',
                          fontWeight: 'bold',
                        }}
                      >
                        Tổng cộng
                      </Typography>
                      <Typography
                        sx={{
                          gridColumn: 'span 2',
                        }}
                      >
                        {(staffItem.total_sale_before ?? 0).toLocaleString()}
                      </Typography>
                      <Typography
                        sx={{
                          gridColumn: 'span 2',
                        }}
                      >
                        {(staffItem.total_discount ?? 0).toLocaleString()}
                      </Typography>
                      <Typography
                        sx={{
                          gridColumn: 'span 2',
                        }}
                      >
                        {(staffItem.total_after ?? 0).toLocaleString()}
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

export default StaffDataTable;
