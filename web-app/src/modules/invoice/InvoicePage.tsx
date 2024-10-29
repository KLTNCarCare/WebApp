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
  Tabs,
  Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';
import useDebounce from 'src/lib/hooks/useDebounce';
import AdminLayout from 'src/components/layouts/AdminLayout';
import { useGetListInvoice } from 'src/api/invoice/useGetAllInvoice';
import { useGetRefundInvoice } from 'src/api/refundInvoice/useGetRefundInvoice';
import { Invoice } from 'src/api/invoice/types';
import {
  RefundInvoiceResponse,
  InvoiceData as RefundInvoiceData,
} from 'src/api/refundInvoice/types';
import InvoiceDataTable from './component/InvoiceDataTable';
import RefundInvoiceDataTable from './component/RefundInvoiceDataTable';
import FilterFormInvoice from './component/filter/FilterFormInvoice';

export function InvoicePage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });
  const [paginationModelRefund, setPaginationModelRefund] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const [isRegisterInvoice, setIsRegisterInvoice] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState('invoiceId');
  const debounceValue = useDebounce<string>(inputValue, 500);

  const { data, isLoading, refetch } = useGetListInvoice({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    field: selectedField,
    word: debounceValue,
  });

  const {
    data: refundData,
    isLoading: isRefundLoading,
    refetch: refetchRefund,
  } = useGetRefundInvoice({
    page: paginationModelRefund.page + 1,
    limit: paginationModelRefund.pageSize,
    field: selectedField,
    word: debounceValue,
  });

  const totalPageInvoice = data?.totalPage || 0;
  const invoiceList: Invoice[] = data?.data ?? [];
  const totalPageRefund = refundData?.totalPage || 0;
  const refundInvoiceList: RefundInvoiceData[] = refundData?.data ?? [];

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <AdminLayout
      title={t('invoice.invoiceManagement')}
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
            {t('invoice.invoiceManagement')}
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
            <Typography variant="h5">{t('invoice.filter')}</Typography>
            <FilterFormInvoice
              searchText={inputValue}
              setSearchText={setInputValue}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
            />
          </Stack>
        </Paper>
        <Paper
          sx={{
            px: 3,
            py: 4,
            m: '20px 20px',
            borderRadius: 2,
            zIndex: 1,
            boxShadow: 'none',
            height: 'calc(100vh - 200px)',
            overflowY: 'auto',
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="invoice tabs"
          >
            <Tab label={t('invoice.invoice')} />
            <Tab label={t('invoice.returnInvoice')} />
          </Tabs>
          {selectedTab === 0 && (
            <div>
              <Typography variant="h5" sx={{ paddingBottom: 2 }}>
                {t('invoice.invoiceList')}
              </Typography>
              <InvoiceDataTable
                dataInvoice={invoiceList}
                isLoadingInvoice={isLoading}
                refetch={refetch}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                totalPage={totalPageInvoice}
              />
            </div>
          )}
          {selectedTab === 1 && (
            <div>
              <Typography variant="h5" sx={{ paddingBottom: 2 }}>
                {t('invoice.refundInvoiceList')}
              </Typography>
              <RefundInvoiceDataTable
                dataInvoice={refundInvoiceList}
                isLoadingInvoice={isRefundLoading}
                refetch={refetch}
                paginationModel={paginationModelRefund}
                setPaginationModel={setPaginationModelRefund}
                totalPage={totalPageRefund}
              />
            </div>
          )}
        </Paper>
      </Box>
      <Dialog
        open={isRegisterInvoice}
        fullWidth
        maxWidth="xs"
        onClose={() => setIsRegisterInvoice(false)}
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
                {t('invoice.registerInvoice')}
              </Typography>

              <ButtonBase
                sx={{ flex: 'none' }}
                disableRipple
                onClick={() => setIsRegisterInvoice(false)}
              >
                <CloseIcon />
              </ButtonBase>
            </Stack>
          </Toolbar>
        </DialogTitle>
      </Dialog>
    </AdminLayout>
  );
}

export default InvoicePage;
