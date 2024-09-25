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
import {
  GetAccountParams,
  useGetListAccountByAdmin,
} from 'src/api/account/useGetAccountsByAdmin';
import AdminLayout from 'src/components/layouts/AdminLayout';
import FilterFormAccount from './component/filter/FilterFormAccount';
import AccountDataTable from './component/AccountDataTable';

export function AccountPage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const [isRegisterAccount, setIsRegisterAccount] = useState<boolean>(false);
  const [inputEmailValue, setInputEmailValue] = useState<string>('');
  const [inputPhoneValue, setInputPhoneValue] = useState<string>('');
  const debounceEmailValue = useDebounce<string>(inputEmailValue, 500);
  const debouncePhoneValue = useDebounce<string>(inputPhoneValue, 500);
  const accountParams: GetAccountParams = {
    page: paginationModel.page,
    size: paginationModel.pageSize,
    email: debounceEmailValue ? debounceEmailValue : undefined,
    phone: debouncePhoneValue ? debouncePhoneValue : undefined,
  };
  const {
    data: dataAccount,
    isLoading,
    refetch,
  } = useGetListAccountByAdmin(accountParams, {
    enabled: false,
  });
  useEffect(() => {
    if (
      debounceEmailValue ||
      debouncePhoneValue ||
      paginationModel ||
      refetch
    ) {
      refetch(); // Refetch data when pagination model changes
    }
  }, [paginationModel, refetch, debounceEmailValue, debouncePhoneValue]);

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
              {t('account.userAccountManagement')}
            </Typography>
          </Paper>
          <Paper
            sx={{
              px: 3,
              py: 4,
              paddingTop: ' 15px',
              m: '10px 20px',
              borderRadius: 2,
              boxShadow: 'none',
              zIndex: 1,
              display: 'flex',
            }}
          >
            <Stack>
              <Typography variant="h5">{t('account.filter')}</Typography>
              <FilterFormAccount
                inputEmailValue={inputEmailValue}
                inputPhoneValue={inputPhoneValue}
                setInputEmailValue={setInputEmailValue}
                setInputPhoneValue={setInputPhoneValue}
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
              onClick={() => setIsRegisterAccount(true)}
            >
              + {t('account.addNew')}
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
              {t('account.accountList')}
            </Typography>

            <AccountDataTable
              dataAccount={dataAccount ? dataAccount : null}
              isLoadingAccount={isLoading}
              refetch={refetch}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          </Paper>
        </Box>
        <Dialog
          open={isRegisterAccount}
          fullWidth
          maxWidth="xs"
          onClose={() => setIsRegisterAccount(false)}
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
                  {t('account.registerAccount')}
                </Typography>

                <ButtonBase
                  sx={{ flex: 'none' }}
                  disableRipple
                  onClick={() => setIsRegisterAccount(false)}
                >
                  <CloseIcon />
                </ButtonBase>
              </Stack>
            </Toolbar>
          </DialogTitle>

          {/* <DialogContent>
            <FormRegisterAccount
              refetch={refetch}
              setIsOpenRegisterOrEditAccount={setIsRegisterAccount}
              dataRole={dataRole?.data ?? []}
            />
          </DialogContent> */}
        </Dialog>
      </AdminLayout>
    </>
  );
}
