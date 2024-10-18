import React from 'react';
import { Box, Grid } from '@mui/material';
import DroppableSlot from './DroppableSlot';

interface SlotAreaProps {
  slots: any[];
  moveAppointment: (appointmentId: string, targetSlotId: string) => void;
  refetch: () => void;
}

const SlotArea: React.FC<SlotAreaProps> = ({
  slots,
  moveAppointment,
  refetch,
}) => {
  return (
    <Grid item xs={12} md={8}>
      <Box
        flex="1"
        minWidth="0"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        height="75vh"
        overflow="auto"
        sx={{
          padding: 2,
          backgroundColor: '#f0fceb',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {slots.map((slot) => (
          <DroppableSlot
            key={slot.id}
            slot={slot}
            moveAppointment={moveAppointment}
            refetch={refetch}
          />
        ))}
      </Box>
    </Grid>
  );
};

export default SlotArea;
