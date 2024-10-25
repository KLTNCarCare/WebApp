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
import { useGetListInvoice } from 'src/api/invoice/useGetAllInvoice';
import { Invoice } from 'src/api/invoice/types';
import InvoiceDataTable from './component/InvoiceDataTable';
import FilterFormInvoice from './component/filter/FilterFormInvoice';

export function InvoicePage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const [isRegisterInvoice, setIsRegisterInvoice] = useState<boolean>(false);
  const [inputCustIDValue, setInputCustIDValue] = useState<string>('');
  const debounceCustIDValue = useDebounce<string>(inputCustIDValue, 500);

  const { data, isLoading, refetch } = useGetListInvoice({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    field: 'customer.custId',
    word: debounceCustIDValue,
  });

  const totalPage = data?.totalPage || 0;
  const invoiceList: Invoice[] = data?.data ?? [];

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
              searchText={inputCustIDValue}
              setSearchText={setInputCustIDValue}
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
            height: '70vh',
            paddingBottom: '0px',
          }}
        >
          <Typography variant="h5" sx={{ paddingBottom: 2 }}>
            {t('invoice.invoiceList')}
          </Typography>

          <InvoiceDataTable
            dataInvoice={invoiceList}
            isLoadingInvoice={isLoading}
            refetch={refetch}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            totalPage={totalPage}
          />
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
