export interface CreateServiceFn {
  serviceName: string;
  categoryId: string;
  duration: number;
  description: string;
}

export interface DeleteServiceFn {
  _id: string;
}

export interface UpdateServiceFn {
  id: string;
  serviceName: string;
  duration: number;
  description: string;
}
