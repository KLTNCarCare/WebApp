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

  sheet.addRow(['Tên cửa hàng: AKAuto']);
  sheet.mergeCells('A1:C1');
  sheet.addRow(['Địa chỉ cửa hàng: 4 Nguyễn Lương Bằng, Đống Đa, Hà Nội']);
  sheet.addRow([
    `Ngày in: ${new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`,
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
    'Tên Khách Hàng',
    'Dịch vụ',
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

  let previousCustRow: { [key: string]: any[] } = {};
  let totalSaleBefore = 0;
  let totalDiscount = 0;
  let totalSaleAfter = 0;

  let serialNumber = 1;

  data?.data.forEach((item: any) => {
    item.items.forEach((cust: any) => {
      let custTotalSaleBefore = 0;
      let custTotalDiscount = 0;
      let custTotalSaleAfter = 0;

      cust.items.forEach((invoice: any) => {
        const content = sheet.addRow([
          serialNumber,
          cust?.custId || '',
          cust?.custName || '',
          invoice?.serviceName || '',
          invoice.sale_before || 0,
          invoice.discount || 0,
          invoice.sale_after || 0,
        ]);

        if (!previousCustRow[cust.custId]) {
          previousCustRow[cust.custId] = [];
        }
        previousCustRow[cust.custId].push(content.number);

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

        custTotalSaleBefore += invoice.sale_before || 0;
        custTotalDiscount += invoice.discount || 0;
        custTotalSaleAfter += invoice.sale_after || 0;
      });

      const custTotalRow = sheet.addRow([
        '',
        '',
        '',
        `Tổng cộng`,
        custTotalSaleBefore,
        custTotalDiscount,
        custTotalSaleAfter,
      ]);
      sheet.mergeCells(`A${custTotalRow.number}:C${custTotalRow.number}`);
      custTotalRow.eachCell((cell, colNumber) => {
        cell.font = boldFont;
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

      totalSaleBefore += custTotalSaleBefore;
      totalDiscount += custTotalDiscount;
      totalSaleAfter += custTotalSaleAfter;

      serialNumber++;
    });
  });

  const totalRow = sheet.addRow([
    'Tổng cộng',
    '',
    '',
    '',
    totalSaleBefore,
    totalDiscount,
    totalSaleAfter,
  ]);
  sheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);
  totalRow.eachCell((cell, colNumber) => {
    cell.font = boldFont;
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
    { width: 20 },
    { width: 40 },
    { width: 25 },
    { width: 25 },
    { width: 25 },
  ];
  const formattedFromDate = formatDate(filters.fromDate);
  const formattedToDate = formatDate(filters.toDate);
  const fileName = `TKNV_${formattedFromDate}-${formattedToDate}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
