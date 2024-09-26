export interface CreateCategoryFn {
  categoryName: string;
  categoryType: string;
  duration: number;
}

export interface Category {
  id: string;
  categoryName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  categoryType: string;
  duration: number;
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
