import ExcelJS from 'exceljs';

export const exportPromotionToExcel = async (
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

  // Function to format date in dd/mm/yyyy
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Sheet setup
  sheet.addRow(['Tên cửa hàng: AKAuto']);
  sheet.mergeCells('A1:C1');
  sheet.addRow(['Địa chỉ cửa hàng: 4 Nguyễn Lương Bằng, Đống Đa, Hà Nội']);
  sheet.addRow([`Ngày in: ${new Date().toLocaleString('vi-VN')}`]);
  sheet.mergeCells('A2:D2');
  sheet.mergeCells('A3:C3');
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (!cell.font || cell.font.bold !== true) {
        cell.font = defaultFont;
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.alignment.wrapText = true; // Enable text wrapping for all cells
      }
    });
  });

  const titleRow = sheet.addRow(['DOANH SỐ THEO CHƯƠNG TRÌNH']);
  titleRow.eachCell((cell) => {
    cell.font = boldFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.alignment.wrapText = true; // Enable text wrapping for title row
  });
  sheet.mergeCells('A4:J4');

  const date = sheet.addRow([
    `Từ ngày: ${formatDate(filters.fromDate)} Đến ngày ${formatDate(
      filters.toDate
    )}`,
  ]);
  date.eachCell((cell) => {
    cell.font = defaultFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.alignment.wrapText = true; // Enable text wrapping for date row
  });
  sheet.mergeCells('A5:J5');
  sheet.addRow([]);

  // Header Row
  const headerRow = sheet.addRow([
    'STT',
    'Mã CTKM',
    'Tên CTKM',
    'Ngày Bắt Đầu',
    'Ngày Kết Thúc',
    'Tổng Số Lượng Áp Dụng',
    'Tổng Giá Trị Áp Dụng',
    'Dịch Vụ',
    'Số Lượng Áp Dụng Khuyến Mãi',
    'Giá Trị Áp Dụng Khuyến Mãi',
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
    cell.alignment.wrapText = true; // Enable text wrapping for header row
  });

  let serialNumber = 1; // STT for each promotion (CTKM)

  data?.data.forEach((promotion: any) => {
    // Khởi tạo serial number cho mỗi promotionId, đánh STT chỉ cho mỗi CTKM
    promotion.items.forEach((item: any, index: number) => {
      const promotionRow = sheet.addRow([
        index === 0 ? serialNumber++ : '', // Only assign STT to the first row for each promotion
        promotion.promotionId || '',
        promotion.promotionName || '',
        promotion.startDate || '',
        promotion.endDate || '',
        promotion.total_apply || 0,
        promotion.total_amount || 0,
        item.serviceName || '',
        item.total_apply || 0,
        item.total_amount || 0,
      ]);

      promotionRow.eachCell((cell) => {
        cell.font = defaultFont;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.alignment.wrapText = true; // Enable text wrapping for each data cell

        if (
          typeof cell.value === 'number' &&
          (cell.address?.charAt(0) === 'F' ||
            cell.address?.charAt(0) === 'G' ||
            cell.address?.charAt(0) === 'I' ||
            cell.address?.charAt(0) === 'J')
        ) {
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
    });
  });

  // Merge cells if data is the same
  const mergeCells = (startRow: number, endRow: number, col: string) => {
    sheet.mergeCells(`${col}${startRow}:${col}${endRow}`);
  };

  let startRow = 9; // Starting row for data
  let endRow = startRow;
  let previousValue = sheet.getCell(`B${startRow}`).value;

  for (let i = startRow + 1; i <= sheet.rowCount; i++) {
    const currentValue = sheet.getCell(`B${i}`).value;
    if (currentValue === previousValue) {
      endRow = i;
    } else {
      if (startRow !== endRow) {
        mergeCells(startRow, endRow, 'A');
        mergeCells(startRow, endRow, 'B');
        mergeCells(startRow, endRow, 'C');
        mergeCells(startRow, endRow, 'D');
        mergeCells(startRow, endRow, 'E');
        mergeCells(startRow, endRow, 'F');
        mergeCells(startRow, endRow, 'G');
      }
      startRow = i;
      endRow = i;
      previousValue = currentValue;
    }
  }

  // Merge the last set of cells if needed
  if (startRow !== endRow) {
    mergeCells(startRow, endRow, 'A');
    mergeCells(startRow, endRow, 'B');
    mergeCells(startRow, endRow, 'C');
    mergeCells(startRow, endRow, 'D');
    mergeCells(startRow, endRow, 'E');
    mergeCells(startRow, endRow, 'F');
    mergeCells(startRow, endRow, 'G');
  }

  sheet.columns = [
    { width: 10 },
    { width: 18 },
    { width: 28 },
    { width: 15 },
    { width: 15 },
    { width: 20 },
    { width: 20 },
    { width: 25 }, // Service column
    { width: 20 }, // Apply quantity column
    { width: 20 }, // Apply value column
  ];

  // Create file name based on filter date
  const formattedFromDate = formatDate(filters.fromDate);
  const formattedToDate = formatDate(filters.toDate);
  const fileName = `TKCTKM_${formattedFromDate}-${formattedToDate}.xlsx`;

  // Write buffer to download the file
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error generating excel file:', error);
  }
};
