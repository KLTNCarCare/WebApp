import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Item } from 'src/api/appointment/types';
import { useInProgressAppointment } from 'src/api/appointment/useChangePiorityService';

interface PendingServiceListProps {
  item: any;
  refetch: () => void;
}

const PendingServiceList: React.FC<PendingServiceListProps> = ({
  item,
  refetch,
}) => {
  const [services, setServices] = useState<Item[]>(item.items);

  const { mutate: updateServiceStatus } = useInProgressAppointment({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error updating service status:', error);
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedServices = Array.from(services);
    const [removed] = reorderedServices.splice(result.source.index, 1);
    reorderedServices.splice(result.destination.index, 0, removed);

    setServices(reorderedServices);
    updateServiceStatus({
      appointmentId: item._id,
      items: reorderedServices.map((service) => ({
        serviceId: service.serviceId,
      })),
    });
  };

  const handleStartService = (serviceId: string) => {
    const updatedServices = services.map((service) => {
      if (service.serviceId === serviceId) {
        return { ...service, status: 'in-progress' };
      }
      return service;
    });

    setServices(updatedServices);
    updateServiceStatus({
      appointmentId: item._id,
      items: updatedServices.map((service) => ({
        serviceId: service.serviceId,
      })),
    });
  };

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: 2,
        bgcolor: 'background.default',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
      >
        Pending Services
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="services">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {services.map((service, index) => (
                <Draggable
                  key={service.serviceId}
                  draggableId={service.serviceId}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                          <Typography variant="h6">
                            {service.serviceName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {service.status === 'pending' && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleStartService(service.serviceId)
                                }
                              >
                                Start
                              </Button>
                            )}
                            {service.status === 'in-progress' && (
                              <BuildIcon color="primary" />
                            )}
                            {service.status === 'completed' && (
                              <CheckCircleIcon color="success" />
                            )}
                          </Box>
                        </Paper>
                      </Box>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default PendingServiceList;
