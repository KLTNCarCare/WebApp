import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import i18n from 'src/i18n/i18n';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiListItemIcon-root': {
    position: 'absolute',
    left: 0,
  },
}));
export default function SelectLanguage() {
  const [language, setLanguage] = React.useState<string>(
    localStorage.getItem('language') || 'vi'
  );

  const handleChange = (event: SelectChangeEvent) => {
    localStorage.setItem('language', event.target.value as string);
    setLanguage(event.target.value as string);
    // i18n.changeLanguage(event.target.value);
  };
  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={language}
      onChange={handleChange}
      input={<BootstrapInput />}
    >
      <MenuItem value="vi">VI</MenuItem>
      <MenuItem value="en">EN</MenuItem>
    </Select>
  );
}
