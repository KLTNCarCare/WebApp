export interface RefundInvoiceResponse {
  code: number;
  message: string;
  totalCount: number;
  totalPage: number;
  data: InvoiceData[];
}

export interface InvoiceData {
  _id: string;
  invoiceId?: string;
  invoiceRefundId?: string;
  reason: string;
  invoice: Invoice;
  payment?: Payment;
  createdAt: string;
  __v: number;
}

export interface Invoice {
  invoiceId: string;
  appointmentId: string;
  customer: Customer;
  vehicle: Vehicle;
  notes: string;
  items: Item[];
  discount: Discount;
  promotion: Promotion[];
  payment_method: string;
  isRefund: boolean;
  e_invoice_code?: string | null;
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
  sub_total: number;
  final_total: number;
  id: string;
}

export interface Customer {
  _id: string;
  custId: string;
  phone: string;
  name: string;
  id: string;
}

export interface Vehicle {
  licensePlate: string;
  model: string;
}

export interface Item {
  typeId: string;
  typeName: string;
  serviceId: string;
  serviceName: string;
  price: number;
  discount: number;
  total: number;
}

export interface Discount {
  per: number;
  value_max: number;
}

export interface Promotion {
  promotion_line: string;
  code: string;
  description: string;
  value: number;
}

export interface Payment {
  method: string;
  e_invoice_code?: string | null;
}
export interface CreateRefundInvoiceFn {
  invoiceId: string;
  reason: string;
}
