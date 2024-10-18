import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDrop } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { useInProgressAppointment } from 'src/api/appointment/useInProgressAppoinment';
import DraggableAppointment from './DraggableAppointment';
import CreateAppointmentModal from './CreateAppoimentModal';

const ItemTypes = {
  APPOINTMENT: 'appointment',
};

interface Slot {
  id: string;
  title: string;
  items: any[];
}

interface DroppableSlotProps {
  slot: Slot;
  moveAppointment: (appointmentId: string, targetSlotId: string) => void;
  refetch: () => void;
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({
  slot,
  moveAppointment,
  refetch,
}) => {
  const { t } = useTranslation();
  const { mutate: inProgressAppointment } = useInProgressAppointment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.APPOINTMENT,
    drop: (draggedItem: { id: string }) => {
      moveAppointment(draggedItem.id, slot.id);
      inProgressAppointment(
        { _id: draggedItem.id },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      sx={{
        width: { xs: '100%', md: '48%' },
        minHeight: 200,
        padding: 2,
        marginBottom: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 0 }}>
        {slot.title}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {slot.items.length > 0 ? (
          slot.items.map((item) => (
            <DraggableAppointment
              key={item._id}
              item={item}
              refetch={refetch}
              onInvoiceCreated={(invoice: any) => {}}
            />
          ))
        ) : (
          <>
            <Typography variant="body2" sx={{ color: '#777', marginTop: 1 }}>
              {t('dashboard.noAppointmentsAvailable')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{
                marginTop: 2,
                backgroundColor: '#e6f8fa',
                color: '#000',
                width: '100%',
                height: '100%',
                '&:hover': {
                  backgroundColor: '#e6f8fa',
                },
              }}
            >
              {t('dashboard.receiveAppointment')}
            </Button>
          </>
        )}
      </Box>
      <CreateAppointmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        refetch={refetch}
      />
    </Box>
  );
};

export default DroppableSlot;
