import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../../../../assets/icons/Search.svg';
import { useTranslation } from 'react-i18next';

interface FilterFormCustomerProps {
  searchText: string;
  setSearchText: (value: string) => void;
}

const FilterFormCustomer = ({
  searchText,
  setSearchText,
}: FilterFormCustomerProps) => {
  const { t } = useTranslation();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  return (
    <Box sx={{ p: '5px 10px 0px 0px' }}>
      <Stack
        sx={{
          alignItems: 'center',
        }}
        direction="row"
        spacing={2}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: '12pt',
            fontWeight: '500',
            width: '17vw',
          }}
          gutterBottom
        >
          {t('customer.phone')}
        </Typography>
        <TextField
          inputRef={inputRef}
          size="small"
          onChange={handleChange}
          value={searchText}
          type="search"
          placeholder={t('customer.searchByPhone')}
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
              minWidth: '12vw',
            },
          })}
        />
      </Stack>
    </Box>
  );
};

export default FilterFormCustomer;
