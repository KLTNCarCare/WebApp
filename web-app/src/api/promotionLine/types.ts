export interface Detail {
  itemId?: string;
  itemName?: string;
  itemGiftId?: string;
  itemGiftName?: string;
  bill?: number;
  discount: number;
  limitDiscount?: number;
}

export interface CreatePromotionLineFn {
  parentId: string;
  description: string;
  type: 'discount-service' | 'discount-bill';
  startDate: number;
  endDate: number;
  detail: Detail[];
  status: string;
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
