export interface CreatePromotionLineFn {
  parentId: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  itemId: string;
  itemGiftId: string;
  discount: number;
  limitDiscount: number;
}

export interface DeletePromotionLineFn {
  _id: string;
}

export interface UpdatePromotionLineFn {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  itemId?: string;
  itemGiftId?: string;
  discount: number;
  limitDiscount: number;
}
