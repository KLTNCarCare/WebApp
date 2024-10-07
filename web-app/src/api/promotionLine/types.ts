export interface CreatePromotionLineFn {
  parentId: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface DeletePromotionLineFn {
  _id: string;
}

export interface UpdatePromotionLineFn {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
}
export interface CreatePromotionDetailFn {
  _id: string;
  discount: number;
  limitDiscount: number;
  bill: number;
}
export interface DeletePromotionDetailFn {
  _id: string;
}
