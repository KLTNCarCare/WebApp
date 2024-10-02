export interface CreateCategoryFn {
  categoryName: string;
}

export interface Category {
  id: string;
  categoryName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  status: string;
}

export interface DeleteCategoryFn {
  _id: string;
}

export interface UpdateCategoryFn {
  id: string;
  categoryName: string;
  duration: number;
}

export interface InactiveStatusFn {
  _id: string;
}
export interface ActiveStatusFn {
  _id: string;
}
