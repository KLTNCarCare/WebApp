const apiRoutes = {
  user: {},
  admin: {
    auth: {
      login: 'v1/api/auth/sign-in',
      sendOtp: 'v1/admin/auth/send-otp',
      activate: '/admin/auth/activate',
      verifyOtp: '/admin/auth/verify-otp',
      logout: '/admin/auth/logout',
    },
    profile: 'v1/api/admin/profile',
  },
  employee: {
    list: 'v1/api/employee',
    create: 'v1/api/employee',
    update: 'v1/api/employee',
    delete: (id: string) => `v1/api/employee/${id}`,
  },
  promotion: {
    list: 'v1/api/promotion/get-all',
    create: 'v1/api/promotion/create-promotion',
    update: 'v1/api/promotion/update-promotion',
    delete: (id: string) => `v1/api/promotion/delete-promotion/${id}`,
    getLineByParentId: '/v1/api/promotion/get-line-by-parentId',
    changeSTTLine: (id: string) => `v1/api/promotion/change-status-line/${id}`,
  },
  category: {
    list: 'v1/api/category/get-all',
    create: 'v1/api/category/create',
    update: 'v1/api/category/edit',
    delete: (id: string) => `v1/api/category/delete/${id}`,
    getServiceByCategory: 'v1/api/service/get-by-category',
    active: (id: string) => `v1/api/category/active/${id}`,
    inactive: (id: string) => `v1/api/category/inactive/${id}`,
  },
  priceCatalog: {
    list: 'v1/api/price-catalog/get-all',
    create: 'v1/api/price-catalog/create',
    update: 'v1/api/price-catalog/update',
    updateEndDate: 'v1/api/price-catalog/update-end-date',
    delete: (id: string) => `v1/api/price-catalog/delete-price-catalog/${id}`,
    getCurrent: 'v1/api/price-catalog/get-all-price-current',
    changeSTT: (id: string) => `v1/api/price-catalog/change-status/${id}`,
  },
  service: {
    create: 'v1/api/service/create',
    update: 'v1/api/service/edit',
    delete: (id: string) => `v1/api/service/delete/${id}`,
  },
  promotionLine: {
    create: 'v1/api/promotion/create-line',
    update: 'v1/api/promotion/update-line',
    delete: (id: string) => `v1/api/promotion/delete-line/${id}`,
    updateEndDate: 'v1/api/promotion/update-end-date',
  },
  appointment: {
    create: 'v1/api/appointment/create',
    createOnSite: 'v1/api/appointment/create-on-site',
    getAvailavleTime: 'v1/api/appointment/get-available-time',
    slotInDay: 'v1/api/appointment/slot-in-day',
    getAppointmentInDay: 'v1/api/appointment/get-appointment-in-day',
    confirm: (id: string) => `v1/api/appointment/in-progress/${id}`,
    cancel: (id: string) => `v1/api/appointment/canceled/${id}`,
    delete: (id: string) => `v1/api/appointment/delete/${id}`,
    inprogress: (id: string) => `v1/api/appointment/in-progress/${id}`,
    completed: (id: string) => `v1/api/appointment/completed/${id}`,
    addServiceToAppointment: (id: string) =>
      `v1/api/appointment/add-service/${id}`,
    changeServiceStatus: (appointmentId: string, serviceId: string) =>
      `v1/api/appointment/update-process/${appointmentId}/${serviceId}`,
    changePiorityService: (appointmentId: string) =>
      `v1/api/appointment/in-progresse/${appointmentId}`,
    createOnSiteFuture: 'v1/api/appointment/create-on-site-future',
  },
  promotionDetail: {
    create: (id: string) => `v1/api/promotion/add-promotion-detail/${id}`,
    delete: (id: string) => `v1/api/promotion/delete-promotion-detail/${id}`,
  },
  invoice: {
    create: 'v1/api/invoice/create',
    getInvoiceByAppoinment: 'v1/api/invoice/get-invoice',
    payInvoice: (id: string) => `v1/api/invoice/create/${id}`,
    getAllInvoice: 'v1/api/invoice/get-all',
    getInvoiceByCustomerID: 'v1/api/invoice/get-by-custId',
    getRefundInvoice: 'v1/api/invoice/get-all-invoice-refund',
    createRefund: 'v1/api/invoice/create-invoice-refund',
  },
  payment: {
    payZaloPay: (id: string) => `v1/api/payment/create-payment-url/${id}`,
  },
  socket: {
    staff: 'https://akautoserver.click/sockjs/staff',
  },
  customer: {
    list: 'v1/api/customer/get-all',
    create: 'v1/api/customer/save',
    update: 'v1/api/customer/edit',
    remove: (id: string) => `v1/api/customer/remove/${id}`,
  },
  staff: {
    list: 'v1/api/staff/get-all',
    create: 'v1/api/staff/save',
    update: 'v1/api/staff/edit',
    updatePhone: 'v1/api/staff/edit-phone',
    grantAccount: 'v1/api/staff/grant-account',
    revokeAccount: 'v1/api/staff/revoke-account',
  },
  account: {
    changePassword: 'v1/api/account/change-password',
    sendOTP: 'v1/api/otp/send-otp',
  },
  statistic: {
    getStatisticCustomer: 'v1/api/statistic/customer',
    getStatisticStaff: 'v1/api/statistic/staff',
    getStatisticPromotion: 'v1/api/statistic/promotion-result',
    getStatisticRefund: 'v1/api/statistic/service-refund',
    exportCustomer: 'v1/api/statistic/customer/export',
    exportStaff: 'v1/api/statistic/staff/export',
    exportPromotion: 'v1/api/statistic/promotion-result/export',
    exportRefund: 'v1/api/statistic/service-refund/export',
  },
};

export default apiRoutes;
