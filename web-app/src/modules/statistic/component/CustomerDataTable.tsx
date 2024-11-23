import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';

interface ServiceItem {
  serviceId: string;
  serviceName: string;
  sale_before: number;
  discount: number;
  sale_after: number;
}

interface CustomerRow {
  custId: string;
  custName: string;
  items: ServiceItem[];
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
  const groupedCustomers = rows.reduce((acc, customer) => {
    if (!acc[customer.custName]) {
      acc[customer.custName] = {
        custName: customer.custName,
        items: [],
      };
    }
    acc[customer.custName].items = acc[customer.custName].items.concat(
      customer.items
    );
    return acc;
  }, {} as Record<string, { custName: string; items: ServiceItem[] }>);

  const groupedRows = Object.values(groupedCustomers);

  return (
    <Paper>
      <Typography variant="h5" sx={{ paddingBottom: 2 }}>
        Thống kê khách hàng
      </Typography>
      {isLoading ? (
        <LinearProgress />
      ) : groupedRows.length === 0 ? (
        <EmptyScreen titleEmpty="No data available" />
      ) : (
        <Box>
          {groupedRows.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                marginBottom: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
                padding: 2,
                backgroundColor: '#e6f7ff',
              }}
            >
              <Typography variant="h6" sx={{ paddingBottom: 2 }}>
                Tên Khách Hàng: {row.custName}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 2,
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                <Typography sx={{ gridColumn: 'span 1', fontWeight: 'bold' }}>
                  STT
                </Typography>
                <Typography sx={{ gridColumn: 'span 2', fontWeight: 'bold' }}>
                  Tên Dịch Vụ
                </Typography>
                <Typography
                  sx={{
                    gridColumn: 'span 1',
                    fontWeight: 'bold',
                    textAlign: 'end',
                  }}
                >
                  Giá Trước Giảm
                </Typography>
                <Typography
                  sx={{
                    gridColumn: 'span 1',
                    fontWeight: 'bold',
                    textAlign: 'end',
                  }}
                >
                  Giảm Giá
                </Typography>
                <Typography
                  sx={{
                    gridColumn: 'span 1',
                    fontWeight: 'bold',
                    textAlign: 'end',
                  }}
                >
                  Giá Sau Giảm
                </Typography>
              </Box>

              {row.items.map((serviceItem, serviceIndex) => (
                <Box
                  key={serviceIndex}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 2,
                    alignItems: 'center',
                    borderTop: '1px solid #ddd',
                    paddingTop: 1,
                    marginBottom: 1,
                  }}
                >
                  <Typography>{serviceIndex + 1}</Typography>
                  <Typography sx={{ gridColumn: 'span 2' }}>
                    {serviceItem.serviceName}
                  </Typography>
                  <Typography sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
                    {serviceItem.sale_before.toLocaleString()}
                  </Typography>
                  <Typography sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
                    {serviceItem.discount.toLocaleString()}
                  </Typography>
                  <Typography sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
                    {serviceItem.sale_after.toLocaleString()}
                  </Typography>
                </Box>
              ))}
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
    </Paper>
  );
};

export default CustomerDataTable;
