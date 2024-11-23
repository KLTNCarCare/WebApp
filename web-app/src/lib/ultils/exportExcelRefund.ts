import ExcelJS from 'exceljs';

export const exportRefundToExcel = async (
  data: any,
  filters: { fromDate: string; toDate: string }
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('DSBH_TheoNgay', {
    views: [{ showGridLines: false }],
  });

  const defaultFont = {
    name: 'Times New Roman',
    size: 12,
    bold: false,
    color: { argb: '000000' },
  };

  const boldFont = {
    name: 'Times New Roman',
    size: 12,
    bold: true,
    color: { argb: '000000' },
  };

  const currencyFormat = '#,##0;[Red]"-"#,##0';

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // General store information
  sheet.addRow(['Tên cửa hàng: AKAuto']);
  sheet.mergeCells('A1:C1');
  sheet.addRow(['Địa chỉ cửa hàng: 4 Nguyễn Lương Bằng, Đống Đa, Hà Nội']);
  sheet.addRow([
    'Ngày in: ' +
      new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
  ]);
  sheet.mergeCells('A2:D2');
  sheet.mergeCells('A3:C3');
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (!cell.font || cell.font.bold !== true) {
        cell.font = defaultFont;
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  // Title Row
  const titleRow = sheet.addRow(['HOÁ ĐƠN HOÀN TRẢ']);
  titleRow.eachCell((cell) => {
    cell.font = boldFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  sheet.mergeCells('A4:G4');

  // Filter Date Range
  const date = sheet.addRow([
    `Từ ngày: ${formatDate(filters.fromDate)} Đến ngày ${formatDate(
      filters.toDate
    )}`,
  ]);
  date.eachCell((cell) => {
    cell.font = defaultFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  sheet.mergeCells('A5:G5');
  sheet.addRow([]);

  // Header Row
  const headerRow = sheet.addRow([
    'STT',
    'Mã Hóa Đơn Bán',
    'Ngày Bán',
    'Mã Hóa Đơn Hoàn Trả',
    'Ngày Hoàn Trả',
    'Dịch Vụ',
    'Số Tiền Hoàn Trả',
  ]);
  headerRow.height = 35;
  headerRow.eachCell((cell) => {
    cell.font = boldFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DDEBF7' },
    };
    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
  });

  let totalRefundAmount = 0;
  let rowNumber = 1; // Initialize rowNumber outside the loops

  // Loop through the refund data
  data?.data.forEach((item: any) => {
    item.items.forEach((refundItem: any) => {
      refundItem.items.forEach((service: any) => {
        const row = sheet.addRow([
          rowNumber, // Use rowNumber for the STT column
          refundItem.saleInvoiceId || '',
          refundItem.saleInvoiceCreatedAt || '',
          refundItem.refundInvoiceId || '',
          refundItem.refundInvoiceCreatedAt || '',
          service.serviceName || '',
          service.amount || 0,
        ]);

        // Increment the row number after adding each row
        rowNumber++;

        // Format the columns
        row.eachCell((cell, colNumber) => {
          cell.font = defaultFont;
          cell.alignment = { horizontal: 'left', vertical: 'middle' };

          if (colNumber === 7 && typeof cell.value === 'number') {
            cell.numFmt = currencyFormat;
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          }

          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          };
        });

        totalRefundAmount += service.amount || 0;
      });
    });
  });

  // Total Row
  const totalRow = sheet.addRow([
    'Tổng giá trị',
    '',
    '',
    '',
    '',
    '',
    totalRefundAmount,
  ]);
  sheet.mergeCells(`A${totalRow.number}:F${totalRow.number}`);
  totalRow.eachCell((cell, colNumber) => {
    cell.font = boldFont;
    cell.alignment = { horizontal: 'left', vertical: 'middle' };

    if (colNumber === 7) {
      cell.numFmt = currencyFormat;
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }

    cell.border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
  });

  sheet.columns = [
    { width: 10 },
    { width: 18 },
    { width: 18 },
    { width: 24 },
    { width: 20 },
    { width: 40 },
    { width: 20 },
  ];

  // Generate the filename based on the filter date
  const formattedFromDate = formatDate(filters.fromDate);
  const formattedToDate = formatDate(filters.toDate);
  const fileName = `Refund_${formattedFromDate}-${formattedToDate}.xlsx`;

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error generating Excel file', error);
  }
};
