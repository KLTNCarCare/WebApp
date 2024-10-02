export interface CreatePriceCatalogFn {
  priceName: string;
  items: Item[];
  startDate: string;
  endDate: string;
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
  _id: string;
}

export interface DeletePriceCatalogFn {
  _id: string;
}
export interface UpdatePriceCatalogFn {
  id: string;
  endDate: string;
}
export interface ActivePriceCatalogFn {
  _id: string;
}
export interface InactivePriceCatalogFn {
  _id: string;
}
