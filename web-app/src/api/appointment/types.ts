import exp from 'constants';

export interface Customer {
  phone: string;
  name: string;
}

export interface Vehicle {
  licensePlate: string | null;
  model: string | null;
}

export interface Item {
  typeId: string;
  typeName: string;
  serviceId: string;
  serviceName: string;
  status: string;
}
export interface ItemCreate {
  typeId: string;
  typeName: string;
  serviceId: string;
  serviceName: string;
}

export interface Appointment {
  _id: string;
  customer: Customer;
  vehicle: Vehicle;
  total_duration: number;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
  invoiceCreated: boolean;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type CreateAppointmentFn = {
  customer: Customer;
  vehicle: Vehicle;
  startTime: number;
  total_duration: number;
  notes: string;
  items: ItemCreate[];
};
export interface ServiceItem {
  itemId: string;
  itemName: string;
  price: number;
}

export interface PriceCatalog {
  _id: string;
  priceId: string;
  priceName: string;
  startDate: string;
  endDate: string;
  status: string;
  items: ServiceItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ConfirmAppointmentFn {
  _id: string;
}

export interface InProgressAppointmentFn {
  _id: string;
}

export interface CompletedAppointmentFn {
  _id: string;
}
