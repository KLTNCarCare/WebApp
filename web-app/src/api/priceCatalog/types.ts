export interface CreatePriceCatalogFn {
  priceName: string;
  items: Item[];
  startDate: number;
  endDate: number;
}

export interface PriceCatalog {
  _id: string;
  priceId: string;
  priceName: string;
  startDate: string;
  endDate: string;
  status: string;
  items: Item[];
  createdDate: string;
  updatedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Item {
  itemId: string;
  itemName: string;
  price: number;
}

export interface DeletePriceCatalogFn {
  _id: string;
}
export interface UpdateEndatePriceCatalogFn {
  id: string;
  endDate: string;
}
export interface ActivePriceCatalogFn {
  _id: string;
}
export type UpdatePriceCatalogFn = {
  priceName: string;
  startDate: string;
  endDate: string;
  items: Item[];
};
