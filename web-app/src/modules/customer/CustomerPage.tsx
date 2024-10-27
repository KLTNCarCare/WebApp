import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
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
import CustomerDataTable from './component/CustomerDataTable';
import { useGetAllCustomer } from 'src/api/customer/useGetAllCustomer';
import { Customer } from 'src/api/customer/types';
import CreateCustomerModal from './component/CreateCustomerModal';
import FilterFormCustomer from './component/filter/FilterFormCustomer';

export function CustomerPage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const [isRegisterCustomer, setIsRegisterCustomer] = useState<boolean>(false);
  const [inputPhoneValue, setInputPhoneValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState('phone');
  const debouncePhoneValue = useDebounce<string>(inputPhoneValue, 500);

  const { data, isLoading, refetch } = useGetAllCustomer(
    paginationModel.page + 1,
    paginationModel.pageSize,
    selectedField,
    debouncePhoneValue
  );

  const totalPage = data?.data.totalPage || 0;
  const customerList: Customer[] = data?.data.data ?? [];

  useEffect(() => {
    refetch();
  }, [debouncePhoneValue, refetch]);

  return (
    <>
      <AdminLayout
        title="Loại hàng"
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
              {t('customer.userCustomerManagement')}
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
              <Typography variant="h5">{t('customer.filter')}</Typography>
              <FilterFormCustomer
                searchText={inputPhoneValue}
                setSearchText={setInputPhoneValue}
                selectedField={selectedField}
                setSelectedField={setSelectedField}
              />
            </Stack>
            <Button
              sx={{
                marginLeft: 'auto',
                fontWeight: '400',
                fontSize: '12pt',
                minWidth: 'auto',
                height: '40px',
              }}
              onClick={() => setIsRegisterCustomer(true)}
            >
              + {t('customer.addNew')}
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
              {t('customer.customerList')}
            </Typography>

            <CustomerDataTable
              dataCustomer={customerList}
              isLoadingCustomer={isLoading}
              refetch={refetch}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={totalPage}
            />
          </Paper>
        </Box>
        <Dialog
          open={isRegisterCustomer}
          fullWidth
          maxWidth="xs"
          onClose={() => setIsRegisterCustomer(false)}
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
                  {t('customer.registerCustomer')}
                </Typography>

                <ButtonBase
                  sx={{ flex: 'none' }}
                  disableRipple
                  onClick={() => setIsRegisterCustomer(false)}
                >
                  <CloseIcon />
                </ButtonBase>
              </Stack>
            </Toolbar>
          </DialogTitle>
          <CreateCustomerModal
            refetch={refetch}
            setIsAddCustomer={setIsRegisterCustomer}
            open={isRegisterCustomer}
            onClose={() => setIsRegisterCustomer(false)}
          />
        </Dialog>
      </AdminLayout>
    </>
  );
}
