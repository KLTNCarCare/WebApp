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
  Typography,
} from '@mui/material';
import React from 'react';
import { ReactComponent as SearchIcon } from '../../../../assets/icons/Search.svg';
import { useTranslation } from 'react-i18next';

interface FilterFormInvoiceProps {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedField: string;
  setSelectedField: (value: string) => void;
}

const FilterFormInvoice = ({
  searchText,
  setSearchText,
  selectedField,
  setSelectedField,
}: FilterFormInvoiceProps) => {
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };
  const handleFieldChange = (event: SelectChangeEvent<string>): void => {
    setSelectedField(event.target.value as string);
  };

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
            <MenuItem value="invoiceId">{t('invoice.invoiceId')}</MenuItem>
            <MenuItem value="customer.name">
              {t('customer.customerName')}
            </MenuItem>
            <MenuItem value="customer.phone">{t('customer.phone')}</MenuItem>
            <MenuItem value="customer.custId">
              {t('customer.customerId')}
            </MenuItem>
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
