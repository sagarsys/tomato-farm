export type Farm = {
  id: string;
  name: string;
  city: string;
};

export type Warehouse = {
  id: string;
  name: string;
  city: string;
};

export type Store = {
  id: string;
  name: string;
  city: string;
};

export type BuyOrder = {
  id: string;
  date: Date;
  supplier: Farm;
  destination: Warehouse;
  isContaminated: boolean;
  volume: number; // KG
  pricePerUnit: number; // $
};

export type SellOrder = {
  id: string;
  costs: BuyOrder[];
  date: Date;
  destination: Store;
  pricePerUnit: number; // $
};
