import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { ReactComponent as SearchIcon } from '../../../../assets/icons/Search.svg';
import { useTranslation } from 'react-i18next';

interface FilterFormAccountProps {
  inputEmailValue: string;
  setInputEmailValue: (value: string) => void;
  inputPhoneValue: string;
  setInputPhoneValue: (value: string) => void;
}
const FilterFormAccount = ({
  inputEmailValue,
  inputPhoneValue,
  setInputEmailValue,
  setInputPhoneValue,
}: FilterFormAccountProps) => {
  const { t } = useTranslation();
  const inputEmailRef = React.useRef<HTMLInputElement>(null);
  const inputPhoneRef = React.useRef<HTMLInputElement>(null);
  const handleChangeEmail = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputEmailValue(event.target.value);
  };
  const handleChangePhone = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputPhoneValue(event.target.value);
  };

  return (
    <Box sx={{ p: '15px 10px 10px 0px' }}>
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
          }}
          gutterBottom
        >
          {t('account.email')}
        </Typography>
        <TextField
          inputRef={inputEmailRef}
          size="small"
          onChange={handleChangeEmail}
          value={inputEmailValue}
          type="search"
          placeholder={t('account.searchByEmail')}
          autoFocus
          InputProps={{
            // autoFocus: true,
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
        <Typography
          variant="h5"
          sx={{
            fontSize: '12pt',
            fontWeight: '500',
            width: '15vw',
          }}
          gutterBottom
        >
          {t('account.phoneNumber')}
        </Typography>
        <TextField
          inputRef={inputPhoneRef}
          size="small"
          onChange={handleChangePhone}
          value={inputPhoneValue}
          type="search"
          placeholder={t('account.searchByPhone')}
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
export default FilterFormAccount;
