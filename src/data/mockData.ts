import { faker } from "@faker-js/faker";
import { Farm, Warehouse, Store, BuyOrder, SellOrder } from "./types";

faker.seed(100000);

export function createRandomFarm(): Farm {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    city: faker.location.city(),
  };
}
export const farms: Farm[] = Array.from({ length: 10000 }, createRandomFarm);

export function createRandomWarehouse(): Warehouse {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    city: faker.location.city(),
  };
}
export const warehouses: Warehouse[] = Array.from(
  { length: 1000 },
  createRandomWarehouse
);

export function createRandomStore(): Store {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    city: faker.location.city(),
  };
}
export const stores: Store[] = Array.from({ length: 100 }, createRandomStore);

export function createRandomBuyOrder(): BuyOrder {
  return {
    id: faker.string.uuid(),
    date: faker.date.anytime(),
    supplier: farms[Math.floor(Math.random() * farms.length)],
    destination: warehouses[Math.floor(Math.random() * warehouses.length)],
    isContaminated: faker.datatype.boolean(),
    volume: faker.number.int({ min: 1, max: 999999 }), // KG
    pricePerUnit: faker.number.int({ min: 1, max: 10 }), // $
  };
}
export const buyOrders: BuyOrder[] = Array.from(
  { length: 16000 },
  createRandomBuyOrder
);

export function createRandomSellOrder(index: number): SellOrder {
  const start = index * 4;
  const end = start + 4;
  return {
    id: faker.string.uuid(),
    date: faker.date.anytime(),
    costs: buyOrders.slice(start, end),
    destination: stores[Math.floor(Math.random() * stores.length)],
    pricePerUnit: faker.number.int({ min: 1, max: 10 }), // $
  };
}
export const sellOrders: SellOrder[] = Array.from({ length: 4000 }, (_v, i) =>
  createRandomSellOrder(i)
);
