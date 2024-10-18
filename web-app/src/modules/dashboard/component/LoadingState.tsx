import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  isLoading: boolean;
  error: any;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isLoading, error }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Typography variant="h6" sx={{ padding: 2 }}>
        {t('dashboard.loadingData')}
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" sx={{ color: 'red', padding: 2 }}>
        {t('dashboard.errorOccurred')}: {error.message}
      </Typography>
    );
  }

  return null;
};

export default LoadingState;
