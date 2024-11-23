import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material/Select';
import { useExportStatisticCustomer } from 'src/api/statistic/useExportCustomer';
import { useExportStatisticStaff } from 'src/api/statistic/useExportStaff';
import { exportCustomerToExcel } from 'src/lib/ultils/exportExcelCustomer';
import { exportStaffToExcel } from 'src/lib/ultils/exportExcelStaff';
import { toast } from 'react-toastify';
import { useExportStatisticRefund } from 'src/api/statistic/useExportRefund';
import { exportRefundToExcel } from 'src/lib/ultils/exportExcelRefund';
import { useExportStatisticPromotion } from 'src/api/statistic/useExportPromotion';
import { exportPromotionToExcel } from 'src/lib/ultils/exportExcelPromotion';
import { ReactComponent as ExportFileIcon } from '../../../../assets/icons/ExportFile.svg';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterFormStatisticProps {
  selectedDataType: string;
  setSelectedDataType: React.Dispatch<React.SetStateAction<string>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  onFilter: () => void;
}

const FilterFormStatistic: React.FC<FilterFormStatisticProps> = ({
  selectedDataType,
  setSelectedDataType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onFilter,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    setFilters({
      fromDate: startDate,
      toDate: endDate,
    });
  }, [startDate, endDate]);

  const [filters, setFilters] = React.useState({
    fromDate: startDate,
    toDate: endDate,
  });

  const { data: customerData } = useExportStatisticCustomer({
    fromDate: new Date(filters.fromDate).getTime(),
    toDate: new Date(filters.toDate).getTime(),
  });

  const { data: staffData } = useExportStatisticStaff({
    fromDate: new Date(filters.fromDate).getTime(),
    toDate: new Date(filters.toDate).getTime(),
  });
  const { data: refundData } = useExportStatisticRefund({
    fromDate: new Date(filters.fromDate).getTime(),
    toDate: new Date(filters.toDate).getTime(),
  });
  const { data: promotionData } = useExportStatisticPromotion({
    fromDate: new Date(filters.fromDate).getTime(),
    toDate: new Date(filters.toDate).getTime(),
  });

  const handleExport = () => {
    if (selectedDataType === 'customer' && customerData) {
      exportCustomerToExcel(customerData, {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    } else if (selectedDataType === 'staff' && staffData) {
      exportStaffToExcel(staffData, {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    } else if (selectedDataType === 'refund' && refundData) {
      exportRefundToExcel(refundData, {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    } else if (selectedDataType === 'promotion' && promotionData) {
      exportPromotionToExcel(promotionData, {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    } else {
      toast.error('Không có dữ liệu để xuất.');
    }
  };

  return (
    <Box sx={{ p: '5px 10px 0px 10vh' }}>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        sx={{
          alignItems: 'center',
        }}
      >
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="data-type-select-label">
            {t('dashboard.selectField')}
          </InputLabel>
          <Select
            labelId="data-type-select-label"
            value={selectedDataType}
            onChange={(event: SelectChangeEvent) =>
              setSelectedDataType(event.target.value)
            }
            label={t('dataType')}
          >
            <MenuItem value="customer">{t('dashboard.customer')}</MenuItem>
            <MenuItem value="staff">{t('dashboard.staff')}</MenuItem>
            <MenuItem value="refund">{t('invoice.returnInvoice')}</MenuItem>
            <MenuItem value="promotion">{t('dashboard.promotion')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label={t('dashboard.fromDate')}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <TextField
          label={t('dashboard.toDate')}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />

        <Button
          startIcon={<FilterAltIcon />}
          onClick={onFilter}
          variant="contained"
        >
          {t('dashboard.filter')}
        </Button>
        <Button
          startIcon={<ExportFileIcon />}
          onClick={handleExport}
          variant="contained"
          color="primary"
        >
          {t('dashboard.export')}
        </Button>
      </Stack>
    </Box>
  );
};

export default FilterFormStatistic;
