export interface Staff {
  _id: string;
  staffId: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  dob: string | null;
  isAccount: boolean;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: string | null;
  role?: string;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: {
    totalPage: number;
    totalCount: number;
    data: Staff[];
  };
}
export interface CreateStaffFn {
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  dob: string | null;
}
export interface UpdateStaffFn {
  _id: string;
  staffId: string;
  name: string;
  email: string | null;
  address: string | null;
  dob: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface GrantAccountFn {
  password: string;
}
export interface UpdatePhoneStaffFn {
  _id: string;
  phone: string;
}
