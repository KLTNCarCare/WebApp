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
  },
  category: {
    list: 'v1/api/category/get-all',
    create: 'v1/api/category/create',
    update: 'v1/api/category/edit',
    delete: (id: string) => `v1/api/category/delete/${id}`,
    getServiceByCategory: 'v1/api/service/get-by-category',
  },
  priceCatalog: {
    list: 'v1/api/price-catalog/get-all',
    create: 'v1/api/price-catalog/create',
    update: 'v1/api/price-catalog/update-end-date',
    delete: (id: string) => `v1/api/price-catalog/delete-price-catalog/${id}`,
  },
};

export default apiRoutes;
