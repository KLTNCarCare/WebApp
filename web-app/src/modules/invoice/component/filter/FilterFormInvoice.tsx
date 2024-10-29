import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import { ReactComponent as SearchIcon } from '../../../../assets/icons/Search.svg';
import { useTranslation } from 'react-i18next';

interface FilterFormInvoiceProps {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedField: string;
  setSelectedField: (value: string) => void;
  isReturnInvoice: boolean;
}

const FilterFormInvoice = ({
  searchText,
  setSearchText,
  selectedField,
  setSelectedField,
  isReturnInvoice,
}: FilterFormInvoiceProps) => {
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const handleFieldChange = (event: SelectChangeEvent<string>): void => {
    setSelectedField(event.target.value as string);
  };

  React.useEffect(() => {
    console.log('isReturnInvoice:', isReturnInvoice);
  }, [isReturnInvoice]);

  React.useEffect(() => {
    console.log('selectedField:', selectedField);
  }, [selectedField]);

  const invoiceFields = [
    <MenuItem key="invoiceId" value="invoiceId">
      {t('invoice.invoiceId')}
    </MenuItem>,
    <MenuItem key="customer.name" value="customer.name">
      {t('customer.customerName')}
    </MenuItem>,
    <MenuItem key="customer.phone" value="customer.phone">
      {t('customer.phone')}
    </MenuItem>,
    <MenuItem key="customer.custId" value="customer.custId">
      {t('customer.customerId')}
    </MenuItem>,
  ];

  const returnInvoiceFields = [
    <MenuItem key="invoice.invoiceId" value="invoice.invoiceId">
      {t('invoice.invoiceId')}
    </MenuItem>,
    <MenuItem key="invoice.customer.name" value="invoice.customer.name">
      {t('customer.customerName')}
    </MenuItem>,
    <MenuItem key="invoice.customer.phone" value="invoice.customer.phone">
      {t('customer.phone')}
    </MenuItem>,
    <MenuItem key="invoice.customer.custId" value="invoice.customer.custId">
      {t('customer.customerId')}
    </MenuItem>,
  ];

  return (
    <Box sx={{ p: '5px 10px 0px 10vh' }}>
      <Stack
        sx={{
          alignItems: 'center',
        }}
        direction="row"
        spacing={2}
      >
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>{t('dashboard.selectField')}</InputLabel>
          <Select
            value={selectedField}
            onChange={handleFieldChange}
            label={t('dashboard.selectField')}
          >
            {isReturnInvoice ? returnInvoiceFields : invoiceFields}
          </Select>
        </FormControl>
        <TextField
          inputRef={inputRef}
          size="medium"
          onChange={handleChange}
          value={searchText}
          type="search"
          placeholder={t('dashboard.search')}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={(theme) => ({
            width: '100%',
            justifyContent: 'flex-start',
            bgcolor: 'white',
            fontWeight: 600,
            color: theme.palette.grey[300],
            borderRadius: 1,
            '.MuiInputBase-input': {
              minWidth: '20vw',
            },
          })}
        />
      </Stack>
    </Box>
  );
};

export default FilterFormInvoice;
