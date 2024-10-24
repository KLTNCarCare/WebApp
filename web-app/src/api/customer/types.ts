export interface Vehicle {
  model: string;
  licensePlate: string;
}

export interface Customer {
  _id: string;
  custId: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  dob: string | null;
  vehicles: Vehicle[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: {
    totalPage: number;
    totalCount: number;
    data: Customer[];
  };
}

export interface DeleteCustomerFn {
  _id: string;
}

export interface UpdateCustomerFn {
  _id: string;
  custId: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  dob: string | null;
  vehicles: Vehicle[];
  createdAt: string;
  updatedAt: string;
}
export interface CreateCustomerFn {
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  dob: string | null;
  vehicles: Vehicle[];
}
