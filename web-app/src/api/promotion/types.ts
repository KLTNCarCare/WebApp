// src/api/promotion/types.ts

export interface CreatePromotionFn {
  promotionName: string;
  description: string;
  startDate: number;
  endDate: number;
}

export interface Promotion {
  id: string;
  promotionName: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeletePromotionFn {
  _id: string;
}
export interface UpdatePromotionFn extends CreatePromotionFn {
  id: string;
}
export interface ChangeStatusFn {
  _id: string;
}
