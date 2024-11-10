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
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Staff } from 'src/api/staff/types';
import EditStaffModal from './EditStaff';

interface StaffDetailModalProps {
  open: boolean;
  onClose: () => void;
  staffData: Staff;
  refetch: () => void;
}

const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  open,
  onClose,
  staffData,
  refetch,
}) => {
  const { t } = useTranslation();
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleEditClick = () => {
    setIsEditStaffOpen(true);
    onClose();
  };

  const handleCloseEditStaff = async () => {
    setIsEditStaffOpen(false);
    await refetch();
    onClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h2">{t('staff.staffDetails')}</Typography>
        </DialogTitle>
        <DialogContent>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label={t('staff.details')} />
          </Tabs>
          <Box sx={{ mb: 2 }}>
            <List>
              <ListItem>
                <ListItemText primary={t('staff.staffId')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.staffId}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.name')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.name}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.phone')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.phone}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.email')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.email || 'N/A'}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.address')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.address || 'N/A'}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.dob')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.dob
                    ? new Date(staffData.dob).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.createdAt')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {new Date(staffData.createdAt).toLocaleString()}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.updatedAt')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {new Date(staffData.updatedAt).toLocaleString()}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary={t('staff.role')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {staffData.role === 'staff'
                    ? t('staff.roleStaff')
                    : t('staff.roleAdmin')}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </DialogContent>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            p: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            fullWidth
          >
            {t('staff.editStaff')}
          </Button>
        </Box>
      </Dialog>

      {isEditStaffOpen && (
        <EditStaffModal
          open={isEditStaffOpen}
          onClose={() => setIsEditStaffOpen(false)}
          staffData={staffData}
          refetch={handleCloseEditStaff}
          setIsEditStaff={setIsEditStaffOpen}
        />
      )}
    </>
  );
};

export default StaffDetailModal;
