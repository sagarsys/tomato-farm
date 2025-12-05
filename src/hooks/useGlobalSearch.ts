import { useMemo } from "react";
import { farms, warehouses, stores, buyOrders, sellOrders } from "@/services/mockData";
import { calculateSellOrderMetrics } from "@/features/orders/utils/orderCalculations";
import { format } from "date-fns";

export type SearchResultType = "farm" | "warehouse" | "store" | "buy-order" | "sell-order";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  description?: string;
  metadata?: string;
  url: string;
}

/**
 * Global search hook that searches across all entities
 * Searches: Farms, Warehouses, Stores, Buy Orders, Sell Orders
 */
export function useGlobalSearch(query: string) {
  const results = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Farms
    farms.forEach((farm) => {
      if (
        farm.name.toLowerCase().includes(searchTerm) ||
        farm.city.toLowerCase().includes(searchTerm) ||
        farm.id.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: farm.id,
          type: "farm",
          title: farm.name,
          subtitle: farm.city,
          description: "Farm",
          url: "/farms",
        });
      }
    });

    // Search Warehouses
    warehouses.forEach((warehouse) => {
      if (
        warehouse.name.toLowerCase().includes(searchTerm) ||
        warehouse.city.toLowerCase().includes(searchTerm) ||
        warehouse.id.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: warehouse.id,
          type: "warehouse",
          title: warehouse.name,
          subtitle: warehouse.city,
          description: "Warehouse",
          url: "/supply-chain",
        });
      }
    });

    // Search Stores
    stores.forEach((store) => {
      if (
        store.name.toLowerCase().includes(searchTerm) ||
        store.city.toLowerCase().includes(searchTerm) ||
        store.id.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: store.id,
          type: "store",
          title: store.name,
          subtitle: store.city,
          description: "Store",
          url: "/supply-chain",
        });
      }
    });

    // Search Buy Orders
    buyOrders.slice(0, 100).forEach((order) => {
      if (
        order.id.toLowerCase().includes(searchTerm) ||
        order.supplier.name.toLowerCase().includes(searchTerm) ||
        order.destination.name.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: order.id,
          type: "buy-order",
          title: `${order.supplier.name} → ${order.destination.name}`,
          subtitle: format(order.date, "MMM dd, yyyy"),
          description: "Buy Order",
          metadata: order.isContaminated ? "Contaminated" : "Clean",
          url: "/orders",
        });
      }
    });

    // Search Sell Orders
    sellOrders.slice(0, 100).forEach((order) => {
      const metrics = calculateSellOrderMetrics(order);
      if (
        order.id.toLowerCase().includes(searchTerm) ||
        order.destination.name.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: order.id,
          type: "sell-order",
          title: `Order to ${order.destination.name}`,
          subtitle: format(order.date, "MMM dd, yyyy"),
          description: "Sell Order",
          metadata: metrics.isContaminated ? "Contaminated" : "Clean",
          url: "/orders",
        });
      }
    });

    // Limit results
    return results.slice(0, 50);
  }, [query]);

  return {
    results,
    isSearching: query.trim().length >= 2,
    totalResults: results.length,
  };
}

