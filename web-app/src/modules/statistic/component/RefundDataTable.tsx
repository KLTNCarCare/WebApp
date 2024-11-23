import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import CustomPagination from 'src/components/CustomPagination';
import EmptyScreen from 'src/components/layouts/EmtyScreen';

interface ServiceItem {
  serviceId: string;
  serviceName: string;
  amount: number;
}

interface InvoiceItem {
  saleInvoiceId: string;
  saleInvoiceCreatedAt: string;
  refundInvoiceId: string;
  refundInvoiceCreatedAt: string;
  items: ServiceItem[];
}

interface RefundRow {
  total_amount: number;
  items: InvoiceItem[];
}

interface RefundDataTableProps {
  rows: RefundRow[];
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  totalPage: number;
  isLoading: boolean;
}

const RefundDataTable: React.FC<RefundDataTableProps> = ({
  rows,
  paginationModel,
  setPaginationModel,
  totalPage,
  isLoading,
}) => {
  const groupedRefunds = rows.reduce((acc, refund) => {
    refund.items.forEach((invoice) => {
      if (!acc[invoice.saleInvoiceId]) {
        acc[invoice.saleInvoiceId] = {
          saleInvoiceId: invoice.saleInvoiceId,
          saleInvoiceCreatedAt: invoice.saleInvoiceCreatedAt,
          refundInvoiceId: invoice.refundInvoiceId,
          refundInvoiceCreatedAt: invoice.refundInvoiceCreatedAt,
          items: [],
        };
      }
      acc[invoice.saleInvoiceId].items = acc[
        invoice.saleInvoiceId
      ].items.concat(invoice.items);
    });
    return acc;
  }, {} as Record<string, InvoiceItem>);

  const groupedRows = Object.values(groupedRefunds);

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ paddingBottom: 2 }}>
        Thống kê hoàn tiền
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
                boxShadow: 1,
                backgroundColor: '#e6f7ff',
              }}
            >
              <Typography
                variant="h6"
                sx={{ paddingBottom: 2, fontWeight: 'bold' }}
              >
                Hóa đơn bán:{' '}
                <span style={{ marginRight: '10px' }}>{row.saleInvoiceId}</span>{' '}
                - Hóa đơn trả:{' '}
                <span style={{ marginLeft: '10px' }}>
                  {row.refundInvoiceId}
                </span>
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
                  Số Tiền
                </Typography>
                <Typography
                  sx={{
                    gridColumn: 'span 1',
                    fontWeight: 'bold',
                    textAlign: 'end',
                  }}
                >
                  Ngày Lập Hóa Đơn
                </Typography>
                <Typography
                  sx={{
                    gridColumn: 'span 1',
                    fontWeight: 'bold',
                    textAlign: 'end',
                  }}
                >
                  Ngày Hoàn Trả
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
                    {serviceItem.amount.toLocaleString()} VND
                  </Typography>
                  <Typography sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
                    {row.saleInvoiceCreatedAt}
                  </Typography>
                  <Typography sx={{ gridColumn: 'span 1', textAlign: 'end' }}>
                    {row.refundInvoiceCreatedAt}
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

export default RefundDataTable;
