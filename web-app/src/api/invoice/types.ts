import { ConfirmAppointmentFn } from './../appointment/types';
import { Customer, Vehicle } from '../appointment/types';

interface Discount {
  per: number;
  value_max: number;
}

interface Item {
  typeId: string;
  typeName: string;
  serviceId: string;
  serviceName: string;
  price: number;
  discount: number;
}

export interface Invoice {
  _id: string;
  invoiceId: string;
  appointmentId: string;
  customer: Customer;
  vehicle: Vehicle;
  notes: string | null;
  status: string;
  items: Item[];
  discount: Discount;
  promotion_code: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  sub_total: number;
  final_total: number;
  id: string;
}

export interface CreateInvoiceFn {
  appointmentId: string;
}
export interface GetInvoiceByAppoinmentFn {
  appointmentId: string;
}
export interface ConfirmPayInvoiceFn {
  appointmentId: string;
  paymentMethod: string;
}

export interface GetInvoiceParams {
  page: number;
  limit: number;
}

export interface InvoiceResponse {
  totalPage: number;
  totalCount: number;
  data: Invoice[];
}
