import { useState } from 'react';
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
import {
  useGetListPriceCatalog,
  PriceCatalogManagement,
} from 'src/api/priceCatalog/useGetPriceCatalog';
import PriceCatalogDataTable from './component/PriceCatalogDataTable';
import CreatePriceCatalogModal from './component/CreatePriceCatalogModal';
import FilterFormPriceCatalog from './component/filter/FilterFormPriceCatalog';

export function PriceCatalogPage() {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const [isRegisterPriceCatalog, setIsRegisterPriceCatalog] =
    useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState('priceName');
  const debounceValue = useDebounce<string>(inputValue, 500);

  const { data, isLoading, refetch } = useGetListPriceCatalog({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    field: selectedField,
    word: debounceValue,
  });

  const totalPage = data?.totalPage || 0;
  const priceCatalogList: PriceCatalogManagement[] = data?.data ?? [];

  return (
    <>
      <AdminLayout
        title=""
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
              {t('priceCatalog.userPriceCatalogManagement')}
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
              <Typography variant="h5">{t('priceCatalog.filter')}</Typography>
              <FilterFormPriceCatalog
                searchText={inputValue}
                setSearchText={setInputValue}
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
              onClick={() => setIsRegisterPriceCatalog(true)}
            >
              + {t('priceCatalog.addNew')}
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
              {t('priceCatalog.priceCatalogList')}
            </Typography>

            <PriceCatalogDataTable
              dataPriceCatalog={priceCatalogList}
              isLoadingPriceCatalog={isLoading}
              refetch={refetch}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={totalPage}
            />
          </Paper>
        </Box>
        <Dialog
          open={isRegisterPriceCatalog}
          fullWidth
          maxWidth="xs"
          onClose={() => setIsRegisterPriceCatalog(false)}
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
                  {t('priceCatalog.registerPriceCatalog')}
                </Typography>

                <ButtonBase
                  sx={{ flex: 'none' }}
                  disableRipple
                  onClick={() => setIsRegisterPriceCatalog(false)}
                >
                  <CloseIcon />
                </ButtonBase>
              </Stack>
            </Toolbar>
          </DialogTitle>
          <CreatePriceCatalogModal
            refetch={refetch}
            setIsAddPriceCatalog={setIsRegisterPriceCatalog}
          />
        </Dialog>
      </AdminLayout>
    </>
  );
}
