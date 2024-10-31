import React from 'react';
import { Box, Typography } from '@mui/material';
import DraggableAppointment from './DraggableAppointment';
import { useTranslation } from 'react-i18next';

interface CompletedAppointmentsProps {
  appointments: any[];
  refetch: () => void;
}

const CompletedAppointments: React.FC<CompletedAppointmentsProps> = ({
  appointments,
  refetch,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        padding: 1,
        backgroundColor: '#bef7c3',
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginTop: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        height: '160px',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          alignSelf: 'center',
          color: '#333',
          fontWeight: 'bold',
        }}
      >
        {t('dashboard.completedAppointments')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: 2,
          overflowX: 'auto',
          height: '100%',
        }}
      >
        {appointments
          .filter((item) => item.status === 'completed')
          .sort(
            (a, b) =>
              new Date(b.endActual).getTime() - new Date(a.endActual).getTime()
          )
          .map((item) => (
            <DraggableAppointment
              key={item._id}
              item={item}
              refetch={refetch}
            />
          ))}
      </Box>
    </Box>
  );
};

export default CompletedAppointments;
