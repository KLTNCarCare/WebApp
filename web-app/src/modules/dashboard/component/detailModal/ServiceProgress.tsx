import React from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { DirectionsCar, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Service {
  serviceId: string;
  serviceName: string;
  status: 'pending' | 'in-progress' | 'completed';
  startTime: string;
  endTime: string;
  startActual: string;
  endActual: string;
}

interface ServiceProgressProps {
  item: any;
  onStatusChange: (
    serviceId: string,
    newStatus: 'pending' | 'in-progress' | 'completed'
  ) => void;
}

const ServiceProgress: React.FC<ServiceProgressProps> = ({
  item,
  onStatusChange,
}) => {
  const { t } = useTranslation();

  const handleStatusChange = (
    serviceId: string,
    newStatus: 'pending' | 'in-progress' | 'completed'
  ) => {
    onStatusChange(serviceId, newStatus);
  };

  const formatDateTimeVN = (date: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          mb: 2,
          textAlign: 'center',
        }}
      >
        {t('appointment.process')}
      </Typography>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <DirectionsCar />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
              {item.status !== 'completed' && (
                <Typography
                  sx={{ color: 'text.primary', fontWeight: 'medium' }}
                >
                  {t('appointment.startTime')}:{' '}
                  {formatDateTimeVN(item?.startTime)}
                </Typography>
              )}
              <Typography
                sx={{ color: 'text.secondary', fontWeight: 'medium' }}
              >
                {t('appointment.actualStartTime')}:{' '}
                {formatDateTimeVN(item?.startActual)}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>

        {item.items.map((service: Service, index: number) => (
          <TimelineItem key={service.serviceId}>
            <TimelineSeparator>
              <TimelineDot
                color={
                  service.status === 'completed'
                    ? 'success'
                    : service.status === 'in-progress'
                    ? 'primary'
                    : 'grey'
                }
              >
                {service.status === 'pending' && <HourglassEmptyIcon />}
                {service.status === 'in-progress' && <BuildIcon />}
                {service.status === 'completed' && <CheckCircleIcon />}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                  {service.serviceName}
                </Typography>
                {service.status === 'pending' && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('appointment.startTime')}:{' '}
                    {new Date(service.startTime).toLocaleString()}
                  </Typography>
                )}
                {service.status === 'in-progress' && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('appointment.endTime')}:{' '}
                    {new Date(service.endTime).toLocaleString()}
                  </Typography>
                )}
                {service.status === 'completed' && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('appointment.actualEndTime')}:{' '}
                    {new Date(service.endActual).toLocaleString()}
                  </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mt: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {item.status === 'in-progress' &&
                    service.status === 'pending' &&
                    (index === 0 ||
                      item.items[index - 1].status === 'completed') && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleStatusChange(service.serviceId, 'in-progress')
                        }
                        sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
                      >
                        {t('appointment.start')}
                      </Button>
                    )}
                  {item.status === 'in-progress' &&
                    service.status === 'in-progress' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleStatusChange(service.serviceId, 'completed')
                        }
                        sx={{ '&:hover': { bgcolor: 'secondary.dark' } }}
                      >
                        {t('appointment.start')}
                      </Button>
                    )}
                </Box>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <ArrowForward />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
              {item.status !== 'completed' && (
                <Typography
                  sx={{ color: 'text.primary', fontWeight: 'medium' }}
                >
                  {t('appointment.endTime')}: {formatDateTimeVN(item?.endTime)}
                </Typography>
              )}
              {item.status === 'completed' && (
                <Typography
                  sx={{ color: 'text.primary', fontWeight: 'medium' }}
                >
                  {t('appointment.actualEndTime')}:{' '}
                  {formatDateTimeVN(item?.endActual)}
                </Typography>
              )}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  );
};

export default ServiceProgress;
