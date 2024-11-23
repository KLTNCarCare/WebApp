export interface StatisticParams {
  fromDate: number;
  toDate: number;
  page: number;
  limit: number;
}
export interface ExportParams {
  fromDate: number;
  toDate: number;
}
export interface ServiceItem {
  serviceId: string;
  serviceName: string;
  sale_before: number;
  discount: number;
  sale_after: number;
}

export interface Customer {
  custId: string;
  custName: string;
  items: ServiceItem[];
}

export interface CustomerStatistics {
  code: number;
  message: string;
  totalCount: number;
  totalPage: number;
  data: Customer[];
}

export interface StaffItem {
  date: string;
  total_sale_before: number;
  total_discount: number;
  total_sale_after: number;
}

export interface Staff {
  staffId: string;
  staffName: string;
  total_sale_before: number;
  total_discount: number;
  total_after: number;
  items: StaffItem[];
}

export interface StaffStatistics {
  code: number;
  message: string;
  totalCount: number;
  totalPage: number;
  data: Staff[];
}

export interface RefundServiceItem {
  serviceId: string;
  serviceName: string;
  amount: number;
}

export interface RefundInvoice {
  saleInvoiceId: string;
  saleInvoiceCreatedAt: string;
  refundInvoiceId: string;
  refundInvoiceCreatedAt: string;
  items: RefundServiceItem[];
}

export interface RefundStatistics {
  code: number;
  message: string;
  totalCount: number;
  totalPage: number;
  data: RefundInvoice[];
}

export interface PromotionItem {
  type: string;
  total_apply: number;
  total_amount: number;
  serviceId?: string;
  serviceName?: string;
}

export interface Promotion {
  promotionId: string;
  promotionName: string;
  startDate: string;
  endDate: string;
  total_apply: number;
  total_amount: number;
  items: PromotionItem[];
}

export interface PromotionStatistics {
  code: number;
  message: string;
  totalCount: number;
  totalPage: number;
  data: Promotion[];
}
