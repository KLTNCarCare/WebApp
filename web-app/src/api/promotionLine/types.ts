export interface Detail {
  itemId?: string | null;
  itemName?: string;
  itemGiftId?: string | null;
  itemGiftName?: string;
  bill?: number;
  discount: number;
  limitDiscount?: number;
}

export interface CreatePromotionLineFn {
  parentId: string;
  description: string;
  type: 'discount-service' | 'discount-bill';
  startDate: string | number;
  endDate: string | number;
  detail: Detail[];
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
