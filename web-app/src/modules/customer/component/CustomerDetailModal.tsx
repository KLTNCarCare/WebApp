import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Paper,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Customer } from 'src/api/customer/types';
import EditCustomerModal from './EditCustomer';

interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
  customerData: Customer;
  refetch: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  open,
  onClose,
  customerData,
  refetch,
}) => {
  const { t } = useTranslation();
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditCustomerOpen(true);
  };

  const handleCloseEditCustomer = () => {
    setIsEditCustomerOpen(false);
    refetch();
  };

  const vehicleColumns: GridColDef[] = [
    {
      field: 'model',
      headerName: t('customer.vehicleModel'),
      flex: 1,
    },
    {
      field: 'licensePlate',
      headerName: t('customer.licensePlate'),
      flex: 1,
    },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h2">{t('customer.customerDetails')}</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <List>
              <ListItem>
                <ListItemText primary={t('customer.customerId')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {customerData.custId}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('customer.customerName')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {customerData.name}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('customer.phone')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {customerData.phone}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('customer.email')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {customerData.email || 'N/A'}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('customer.dob')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {customerData.dob
                    ? new Date(customerData.dob).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('customer.createdAt')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {new Date(customerData.createdAt).toLocaleString()}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('customer.updatedAt')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {new Date(customerData.updatedAt).toLocaleString()}
                </Typography>
              </ListItem>
            </List>
          </Box>

          <Box sx={{ flex: 1, minHeight: 300, width: '100%' }}>
            <Typography variant="h4">{t('customer.vehicles')}</Typography>
            <Paper sx={{ flex: 1, minHeight: 200, width: '100%' }}>
              <DataGrid
                rows={customerData.vehicles}
                columns={vehicleColumns}
                autoHeight
                getRowId={(row) => row.licensePlate}
                sx={{
                  '& .MuiDataGrid-cell': {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  },
                }}
              />
            </Paper>
          </Box>
        </DialogContent>
        <Box
          sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', p: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            fullWidth
          >
            {t('customer.editCustomer')}
          </Button>
        </Box>
      </Dialog>

      {isEditCustomerOpen && (
        <EditCustomerModal
          customerData={customerData}
          refetch={handleCloseEditCustomer}
          setIsEditCustomer={setIsEditCustomerOpen}
        />
      )}
    </>
  );
};

export default CustomerDetailModal;
