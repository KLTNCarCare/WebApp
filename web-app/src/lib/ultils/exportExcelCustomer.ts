// src/utils/exportExcel.ts
import ExcelJS from 'exceljs';

export const exportCustomerToExcel = async (
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

  // Sheet setup
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

  const titleRow = sheet.addRow(['DOANH SỐ THEO KHÁCH HÀNG']);
  titleRow.eachCell((cell) => {
    cell.font = boldFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  sheet.mergeCells('A4:G4');

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

  const headerRow = sheet.addRow([
    'STT',
    'Mã KH',
    'Tên KH',
    'Loại DV',
    'Doanh Số Trước CK',
    'Chiết Khấu',
    'Doanh Số Sau CK',
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

  let previousSTT: any = null;
  let previousCustRow: { [key: string]: any[] } = {};
  data?.data.forEach((item: any, index: number) => {
    item.items.forEach((invoice: any) => {
      const content = sheet.addRow([
        previousSTT === index ? '' : index + 1,
        item?.custId || '',
        item?.custName || '',
        invoice.serviceName || '',
        invoice.sale_before || 0,
        invoice.discount || 0,
        invoice.sale_after || 0,
      ]);
      if (!previousCustRow[item.custId]) {
        previousCustRow[item.custId] = [];
      }
      previousCustRow[item.custId].push(content.number);

      content.eachCell((cell, colNumber) => {
        cell.font = defaultFont;
        cell.alignment = { horizontal: 'left', vertical: 'middle' };

        if (typeof cell.value === 'number') {
          if (colNumber === 5 || colNumber === 6 || colNumber === 7) {
            cell.numFmt = currencyFormat;
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          }
        }
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
      });
      previousSTT = item.custId;
    });
  });

  for (const key in previousCustRow) {
    const row = previousCustRow[key];
    const start = row[0];
    const end = row[row.length - 1];
    sheet.mergeCells(`A${start}:A${end}`);
    sheet.mergeCells(`B${start}:B${end}`);
    sheet.mergeCells(`C${start}:C${end}`);
  }

  sheet.columns = [
    { width: 10 },
    { width: 18 },
    { width: 28 },
    { width: 46 },
    { width: 25 },
    { width: 25 },
    { width: 25 },
  ];
  // Tạo tên file từ filter date
  const formattedFromDate = formatDate(filters.fromDate);
  const formattedToDate = formatDate(filters.toDate);
  const fileName = `TKKH_${formattedFromDate}-${formattedToDate}.xlsx`;
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};
