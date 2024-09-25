import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import useDebounce from 'src/lib/hooks/useDebounce';
import AdminLayout from 'src/components/layouts/AdminLayout';
import PromotionDataTable from './component/PromotionDataTable';
import {
  useGetListPromotion,
  PromotionManagement,
} from 'src/api/promotion/useGetPromotion';
import CreatePromotionModal from './component/CreatePromotionModal';

export function PromotionPage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const [isRegisterPromotion, setIsRegisterPromotion] =
    useState<boolean>(false);
  const [inputEmailValue, setInputEmailValue] = useState<string>('');
  const [inputPhoneValue, setInputPhoneValue] = useState<string>('');
  const debounceEmailValue = useDebounce<string>(inputEmailValue, 500);
  const debouncePhoneValue = useDebounce<string>(inputPhoneValue, 500);

  const { data, isLoading, refetch } = useGetListPromotion({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const totalPage = data?.totalPage || 0;
  const promotionList: PromotionManagement[] = data?.data ?? [];

  return (
    <>
      <AdminLayout
        title="Bản đồ ngập"
        isCollapse={isCollapse}
        setIsCollapse={setIsCollapse}
      >
        <Box sx={{ height: '100%', width: '100%', background: '#f7f7f7' }}>
          <Paper
            sx={{
              px: 3,
              py: 4,
              zIndex: 1,
              height: '7vh',
              boxShadow: 'none',
            }}
          >
            <Typography variant="h5" sx={{ paddingBottom: 2 }}>
              {t('promotion.userPromotionManagement')}
            </Typography>
          </Paper>
          <Paper
            sx={{
              px: 3,
              py: 4,
              paddingTop: '15px',
              m: '10px 20px',
              borderRadius: 2,
              boxShadow: 'none',
              zIndex: 1,
              display: 'flex',
            }}
          >
            <Stack>
              <Typography variant="h5">{t('promotion.filter')}</Typography>
            </Stack>
            <Button
              sx={{
                marginLeft: 'auto',
                fontWeight: '400',
                fontSize: '12pt',
                minWidth: 'auto',
                height: '40px',
              }}
              onClick={() => setIsRegisterPromotion(true)}
            >
              + {t('promotion.addNew')}
            </Button>
          </Paper>
          <Paper
            sx={{
              px: 3,
              py: 4,
              m: '20px 20px',
              borderRadius: 2,
              zIndex: 1,
              boxShadow: 'none',
              height: '70vh',
              paddingBottom: '0px',
            }}
          >
            <Typography variant="h5" sx={{ paddingBottom: 2 }}>
              {t('promotion.promotionList')}
            </Typography>

            <PromotionDataTable
              dataPromotion={promotionList}
              isLoadingPromotion={isLoading}
              refetch={refetch}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={totalPage}
            />
          </Paper>
        </Box>
        <Dialog
          open={isRegisterPromotion}
          fullWidth
          maxWidth="xs"
          onClose={() => setIsRegisterPromotion(false)}
        >
          <DialogTitle p="0px !important" borderBottom="1px solid #F2F2F2">
            <Toolbar>
              <Stack direction="row" spacing={2} width="100%">
                <Typography
                  variant="h4"
                  align="center"
                  noWrap
                  flexGrow={1}
                  color="grey.900"
                  ml={4.25}
                >
                  {t('promotion.registerPromotion')}
                </Typography>

                <ButtonBase
                  sx={{ flex: 'none' }}
                  disableRipple
                  onClick={() => setIsRegisterPromotion(false)}
                >
                  <CloseIcon />
                </ButtonBase>
              </Stack>
            </Toolbar>
          </DialogTitle>
          <CreatePromotionModal
            refetch={refetch}
            setIsAddPromotion={setIsRegisterPromotion}
          />
        </Dialog>
      </AdminLayout>
    </>
  );
}
