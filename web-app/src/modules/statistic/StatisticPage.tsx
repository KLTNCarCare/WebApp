import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  Toolbar,
  ButtonBase,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from 'src/components/layouts/AdminLayout';
import { useGetStatisticCustomer } from 'src/api/statistic/useGetStatisticCustomer';
import { useGetStatisticStaff } from 'src/api/statistic/useGetStatisticStaff';
import { useGetStatisticServiceRefund } from 'src/api/statistic/useGetStatisticServiceRefund';
import { useGetStatisticPromotionResult } from 'src/api/statistic/useGetStatisticPromotionResult';
import FilterFormStatistic from './component/filter/FilterFormStatistic';
import CustomerDataTable from './component/CustomerDataTable';
import StaffDataTable from './component/StaffDataTable';
import RefundDataTable from './component/RefundDataTable';
import PromotionDataTable from './component/PromotionDataTable';
import { TEN_ITEMS_PAGE } from 'src/lib/constants';

export const StatisticPage = () => {
  const { t } = useTranslation();
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [isRegisterPromotion, setIsRegisterPromotion] =
    useState<boolean>(false);
  const [selectedDataType, setSelectedDataType] = useState<string>('customer');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filterParams, setFilterParams] = useState({
    fromDate: new Date(startDate).getTime(),
    toDate: new Date(endDate).getTime(),
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: TEN_ITEMS_PAGE,
  });

  const handleFilter = () => {
    setFilterParams({
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
    });
  };

  const customerQuery = useGetStatisticCustomer({
    fromDate: filterParams.fromDate,
    toDate: filterParams.toDate,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const staffQuery = useGetStatisticStaff({
    fromDate: filterParams.fromDate,
    toDate: filterParams.toDate,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const refundQuery = useGetStatisticServiceRefund({
    fromDate: filterParams.fromDate,
    toDate: filterParams.toDate,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const promotionQuery = useGetStatisticPromotionResult({
    fromDate: filterParams.fromDate,
    toDate: filterParams.toDate,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const [customerData, setCustomerData] = useState<any>(null);
  const [staffData, setStaffData] = useState<any>(null);
  const [refundData, setRefundData] = useState<any>(null);
  const [promotionData, setPromotionData] = useState<any>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState<boolean>(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
  const [isLoadingRefund, setIsLoadingRefund] = useState<boolean>(false);
  const [isLoadingPromotion, setIsLoadingPromotion] = useState<boolean>(false);
  const [errorCustomer, setErrorCustomer] = useState<any>(null);
  const [errorStaff, setErrorStaff] = useState<any>(null);
  const [errorRefund, setErrorRefund] = useState<any>(null);
  const [errorPromotion, setErrorPromotion] = useState<any>(null);

  useEffect(() => {
    if (selectedDataType === 'customer') {
      setCustomerData(customerQuery.data);
      setIsLoadingCustomer(customerQuery.isLoading);
      setErrorCustomer(customerQuery.error);
    }
  }, [
    selectedDataType,
    customerQuery.data,
    customerQuery.isLoading,
    customerQuery.error,
  ]);

  useEffect(() => {
    if (selectedDataType === 'staff') {
      setStaffData(staffQuery.data);
      setIsLoadingStaff(staffQuery.isLoading);
      setErrorStaff(staffQuery.error);
    }
  }, [
    selectedDataType,
    staffQuery.data,
    staffQuery.isLoading,
    staffQuery.error,
  ]);

  useEffect(() => {
    if (selectedDataType === 'refund') {
      setRefundData(refundQuery.data);
      setIsLoadingRefund(refundQuery.isLoading);
      setErrorRefund(refundQuery.error);
    }
  }, [
    selectedDataType,
    refundQuery.data,
    refundQuery.isLoading,
    refundQuery.error,
  ]);

  useEffect(() => {
    if (selectedDataType === 'promotion') {
      setPromotionData(promotionQuery.data);
      setIsLoadingPromotion(promotionQuery.isLoading);
      setErrorPromotion(promotionQuery.error);
    }
  }, [
    selectedDataType,
    promotionQuery.data,
    promotionQuery.isLoading,
    promotionQuery.error,
  ]);

  if (
    isLoadingCustomer ||
    isLoadingStaff ||
    isLoadingRefund ||
    isLoadingPromotion
  )
    if (errorCustomer || errorStaff || errorRefund || errorPromotion)
      return (
        <div>
          Error:{' '}
          {errorCustomer?.message ||
            errorStaff?.message ||
            errorRefund?.message ||
            errorPromotion?.message}
        </div>
      );

  const customerRows =
    customerData?.data?.map((customer: any) => ({
      sale_before: customer.sale_before,
      discount: customer.discount,
      sale_after: customer.sale_after,
      items: (customer.items || []).map((item: any) => ({
        custId: item.custId,
        custName: item.custName,
        sale_before: item.sale_before,
        discount: item.discount,
        sale_after: item.sale_after,
        items: (item.items || []).map((service: any) => ({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          sale_before: service.sale_before
            ? service.sale_before.toLocaleString()
            : 'N/A',
          discount: service.discount ? service.discount.toLocaleString() : '0',
          sale_after: service.sale_after
            ? service.sale_after.toLocaleString()
            : 'N/A',
        })),
      })),
    })) || [];

  const staffRows =
    staffData?.data?.map((staff: any) => ({
      total_sale_before: staff.total_sale_before,
      total_discount: staff.total_discount,
      total_sale_after: staff.total_sale_after,
      items: staff.items.map((item: any) => ({
        staffId: item.staffId,
        staffName: item.staffName,
        total_sale_before: item.total_sale_before,
        total_discount: item.total_discount,
        total_after: item.total_after,
        items: item.items.map((service: any) => ({
          date: service.date,
          total_sale_before:
            service.total_sale_before?.toLocaleString() || 'N/A',
          total_discount: service.total_discount?.toLocaleString() || 'N/A',
          total_sale_after: service.total_sale_after?.toLocaleString() || 'N/A',
        })),
      })),
    })) || [];
  const refundRows =
    refundData?.data?.map((refund: any) => ({
      total_amount: refund.total_amount,
      items: refund.items.map((invoice: any) => ({
        saleInvoiceId: invoice.saleInvoiceId,
        saleInvoiceCreatedAt: invoice.saleInvoiceCreatedAt,
        refundInvoiceId: invoice.refundInvoiceId,
        refundInvoiceCreatedAt: invoice.refundInvoiceCreatedAt,
        items: invoice.items.map((item: any) => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          amount: item.amount,
        })),
      })),
    })) || [];

  const promotionRows =
    promotionData?.data?.map((promotion: any) => ({
      total_apply: promotion.total_apply,
      total_amount: promotion.total_amount,
      items: promotion.items.map((item: any) => ({
        promotionId: item.promotionId,
        promotionName: item.promotionName,
        startDate: item.startDate,
        endDate: item.endDate,
        total_apply: item.total_apply,
        total_amount: item.total_amount,
        total_total_amount: item.total_total_amount,
        items: item.items.map((subItem: any) => ({
          type: subItem.type,
          serviceId: subItem.serviceId,
          serviceName: subItem.serviceName,
          total_apply: subItem.total_apply,
          total_amount: subItem.total_amount,
        })),
      })),
    })) || [];

  return (
    <AdminLayout title="" isCollapse={isCollapse} setIsCollapse={setIsCollapse}>
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
            {t('statistics.title')}
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
            <FilterFormStatistic
              selectedDataType={selectedDataType}
              setSelectedDataType={setSelectedDataType}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              onFilter={handleFilter}
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
            maxWidth: '100%',
            overflowX: 'auto',
          }}
        >
          {selectedDataType === 'customer' && (
            <CustomerDataTable
              rows={customerRows}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={customerData?.totalPage || 0}
              isLoading={isLoadingCustomer}
            />
          )}
          {selectedDataType === 'staff' && (
            <StaffDataTable
              rows={staffRows}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={staffData?.totalPage || 0}
              isLoading={isLoadingStaff}
            />
          )}
          {selectedDataType === 'refund' && (
            <RefundDataTable
              rows={refundRows}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={refundData?.totalPage || 0}
              isLoading={isLoadingRefund}
            />
          )}
          {selectedDataType === 'promotion' && (
            <PromotionDataTable
              rows={promotionRows}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalPage={promotionData?.totalPage || 0}
              isLoading={isLoadingPromotion}
            />
          )}
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
      </Dialog>
    </AdminLayout>
  );
};
