import React from 'react';
import { Switch, FormControlLabel, Typography, Box } from '@mui/material';
import { useChangeStatus } from 'src/api/priceCatalog/useChangeStatusPriceCatalog';
import snackbarUtils from 'src/lib/snackbarUtils';

interface ToggleStatusButtonProps {
  status: 'active' | 'inactive' | 'expires';
  onToggle: () => void;
  id: string;
  refetch?: () => void;
}

const ToggleStatusButton: React.FC<ToggleStatusButtonProps> = ({
  status,
  onToggle,
  id,
  refetch,
}) => {
  const mutation = useChangeStatus({
    onSuccess: (success) => {
      onToggle();
      snackbarUtils.success(success);
      refetch?.();
    },
    onError: (error) => {
      snackbarUtils.error(error);
    },
  });

  const handleToggle = () => {
    mutation.mutate({ _id: id });
  };

  if (status === 'expires') {
    return (
      <Typography
        variant="body2"
        sx={{ color: 'gray', fontStyle: 'italic' }}
      ></Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <FormControlLabel
        control={
          <Switch
            checked={status === 'active'}
            onChange={handleToggle}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'green',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'green',
              },
              '& .MuiSwitch-switchBase': {
                color: 'grey',
              },
              '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                backgroundColor: 'grey',
              },
            }}
          />
        }
        label={status === 'active'}
        sx={{
          '& .MuiFormControlLabel-label': {
            color: status === 'active' ? 'green' : 'red',
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
};

export default ToggleStatusButton;
