import React, { useState, useEffect } from 'react';
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
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PromotionManagement } from 'src/api/promotion/useGetPromotion';
import {
  Detail,
  PromotionLine,
} from 'src/api/promotionLine/useGetPromotionLine';
import PromotionLineDataGrid from './PromotionLineDataGrid';

interface PromotionDetailModalProps {
  open: boolean;
  onClose: () => void;
  promotionData: PromotionManagement;
  refetch: () => void;
  dataPromotion: any;
  isLoadingPromotion: boolean;
  paginationModel: { pageSize: number; page: number };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{ pageSize: number; page: number }>
  >;
  promotionLineData: PromotionLine[] | undefined;
  isLoadingPromotionLine: boolean;
  refetchPromotionLine: () => void;
}

const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({
  open,
  onClose,
  promotionData,
  refetch,
  isLoadingPromotion,
  paginationModel,
  setPaginationModel,
  promotionLineData,
  isLoadingPromotionLine,
  refetchPromotionLine,
}) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<PromotionLine[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<Detail[] | null>(null);

  useEffect(() => {
    if (promotionLineData) {
      setRows(promotionLineData);
    }
  }, [promotionLineData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>
        <Typography variant="h2">
          {selectedDetail
            ? t('promotionLine.detail')
            : t('promotion.promotionDetails')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">{t('promotion.header')}</Typography>
          <List>
            {promotionData && (
              <>
                {promotionData._id && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.promotionId')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {promotionData.promotionId}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.promotionName && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.promotionName')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {promotionData.promotionName}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.status && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.status')} />
                      <Chip
                        label={
                          promotionData.status === 'active'
                            ? t('promotion.active')
                            : t('promotion.inactive')
                        }
                        color={
                          promotionData.status === 'active'
                            ? 'success'
                            : 'default'
                        }
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.startDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.startDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(promotionData.startDate).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.endDate && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.endDate')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(promotionData.endDate).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.updatedAt && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.updatedAt')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(promotionData.updatedAt).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
                {promotionData.createdAt && (
                  <>
                    <ListItem>
                      <ListItemText primary={t('promotion.createdAt')} />
                      <Typography
                        variant="body2"
                        textAlign="right"
                        color="grey.600"
                      >
                        {new Date(promotionData.createdAt).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <Divider variant="middle" />
                  </>
                )}
              </>
            )}
          </List>
          {promotionLineData && (
            <PromotionLineDataGrid promotionLineData={promotionLineData} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionDetailModal;
