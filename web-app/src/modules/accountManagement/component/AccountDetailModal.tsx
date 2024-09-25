import {
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { AccountManagement } from 'src/api/account/useGetAccountsByAdmin';

type AccountDetailModalProps = {
  accountData: AccountManagement;
  refetch: () => void;
};
const AccountDetailModal = ({
  accountData,
  refetch,
}: AccountDetailModalProps) => {
  const { t } = useTranslation();
  const [isOpenAccountStatus, setIsOpenAccountStatus] =
    useState<boolean>(false);
  //   const { mutate: updateAccount } = useUpdateStatusAccountByAdmin();
  const [isOpenEditAccount, setIsOpenEditAccount] = useState<boolean>(false);

  return (
    <>
      <DialogContent sx={{ p: 0 }}>
        <List
          sx={{
            py: 0,
            width: '100%',
            '.MuiListItemText-primary': {
              fontWeight: 600,
            },
          }}
        >
          {accountData.name ? (
            <>
              <ListItem>
                <ListItemText primary={t('account.name')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {accountData.name}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
            </>
          ) : null}

          {accountData._id ? (
            <>
              <ListItem>
                <ListItemText primary={t('account.phoneNumber')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {accountData._id}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
            </>
          ) : null}

          {accountData.email ? (
            <>
              <ListItem>
                <ListItemText primary={t('account.email')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {accountData.email}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
            </>
          ) : null}

          {accountData.create_time ? (
            <>
              <ListItem>
                <ListItemText primary={t('account.time')} />
                <Typography variant="body2" textAlign="right" color="grey.600">
                  {dayjs
                    .unix(accountData.create_time)
                    .format('dd, DD/MM/YYYY, HH:mm A')}
                </Typography>
              </ListItem>
              <Divider variant="middle" />
            </>
          ) : null}

          <ListItem>
            <ListItemText primary={t('account.account_status')} />
            <Typography
              variant="body2"
              textAlign="right"
              color="grey.600"
              component="div"
            ></Typography>
          </ListItem>
          <Divider variant="middle" />
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Stack spacing={2} width="100%">
          <Button
            fullWidth
            color="inherit"
            variant="contained"
            onClick={() => setIsOpenEditAccount(true)}
          >
            {t('account.editInformationAccount')}
          </Button>
        </Stack>
      </DialogActions>
      <Dialog
        open={isOpenAccountStatus}
        maxWidth="xs"
        onClose={() => setIsOpenAccountStatus(false)}
      >
        <DialogTitle variant="h4">
          {t('account.updateStatusAccount')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            {t('account.confirmUpdateStatusAccount')}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 2,
            button: { width: '50%' },
          }}
        >
          <Button onClick={() => setIsOpenAccountStatus(false)} color="inherit">
            {t('account.cancel')}
          </Button>
          <Button autoFocus color="primary">
            {t('account.update')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isOpenEditAccount}
        fullWidth
        maxWidth="xs"
        onClose={() => setIsOpenEditAccount(false)}
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
                {t('account.editInformationAccount')}
              </Typography>

              <ButtonBase
                sx={{ flex: 'none' }}
                disableRipple
                onClick={() => setIsOpenEditAccount(false)}
              >
                <CloseIcon />
              </ButtonBase>
            </Stack>
          </Toolbar>
        </DialogTitle>

        <DialogContent sx={{ px: 2, mt: 2 }}>
          {/* <FormRegisterAccount
            accountData={accountData}
            isUpdate={true}
            refetch={refetch}
            setIsOpenRegisterOrEditAccount={setIsOpenEditAccount}
            dataRole={dataRole}
          /> */}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AccountDetailModal;
