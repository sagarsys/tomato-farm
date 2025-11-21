import { useMemo } from "react";
import { useOrdersData } from "./useOrdersData";
import { calculateSellOrderMetrics } from "../utils/orderCalculations";

/**
 * Custom hook to calculate supply chain metrics and track flow
 * Tracks Farms → Warehouses → Stores with volume and contamination
 */
export const useSupplyChainMetrics = () => {
  const { buyOrders, sellOrders, isPending, isError } = useOrdersData();

  // Count unique entities
  const uniqueFarms = useMemo(() => {
    const farmIds = new Set(buyOrders.map((order) => order.supplier.id));
    return farmIds.size;
  }, [buyOrders]);

  const uniqueWarehouses = useMemo(() => {
    const warehouseIds = new Set(
      buyOrders.map((order) => order.destination.id)
    );
    return warehouseIds.size;
  }, [buyOrders]);

  const uniqueStores = useMemo(() => {
    const storeIds = new Set(sellOrders.map((order) => order.destination.id));
    return storeIds.size;
  }, [sellOrders]);

  // Calculate volumes at each stage
  const volumePurchased = useMemo(() => {
    return buyOrders.reduce((sum, order) => sum + order.volume, 0);
  }, [buyOrders]);

  // Volume sold = only from clean (non-contaminated) sell orders
  const volumeSold = useMemo(() => {
    return sellOrders.reduce((sum, order) => {
      const metrics = calculateSellOrderMetrics(order);
      // Only count volume from clean orders (can actually be sold)
      if (!metrics.isContaminated) {
        return (
          sum + order.costs.reduce((costSum, cost) => costSum + cost.volume, 0)
        );
      }
      return sum;
    }, 0);
  }, [sellOrders]);

  // Volume loss = contaminated volume that was purchased but cannot be sold
  const volumeLoss = useMemo(() => {
    return sellOrders.reduce((sum, order) => {
      const metrics = calculateSellOrderMetrics(order);
      // Count volume from contaminated orders as loss
      if (metrics.isContaminated) {
        return (
          sum + order.costs.reduce((costSum, cost) => costSum + cost.volume, 0)
        );
      }
      return sum;
    }, 0);
  }, [sellOrders]);

  // Track contamination through supply chain
  const contaminationMetrics = useMemo(() => {
    const contaminatedBuyOrders = buyOrders.filter(
      (order) => order.isContaminated
    );
    const contaminatedFarms = new Set(
      contaminatedBuyOrders.map((order) => order.supplier.id)
    );
    const contaminatedWarehouses = new Set(
      contaminatedBuyOrders.map((order) => order.destination.id)
    );

    const contaminatedSellOrders = sellOrders.filter((order) => {
      const metrics = calculateSellOrderMetrics(order);
      return metrics.isContaminated;
    });
    const affectedStores = new Set(
      contaminatedSellOrders.map((order) => order.destination.id)
    );

    return {
      contaminatedBuyOrderCount: contaminatedBuyOrders.length,
      contaminatedFarmsCount: contaminatedFarms.size,
      contaminatedWarehousesCount: contaminatedWarehouses.size,
      affectedStoresCount: affectedStores.size,
    };
  }, [buyOrders, sellOrders]);

  // Calculate top supply routes
  const topRoutes = useMemo(() => {
    // Map to track routes: farm -> warehouse -> store
    const routeMap = new Map<
      string,
      {
        farm: { id: string; name: string; city: string };
        warehouse: { id: string; name: string; city: string };
        store: { id: string; name: string; city: string };
        volume: number;
        orderCount: number;
        isContaminated: boolean;
      }
    >();

    sellOrders.forEach((sellOrder) => {
      sellOrder.costs.forEach((buyOrder) => {
        const routeKey = `${buyOrder.supplier.id}-${buyOrder.destination.id}-${sellOrder.destination.id}`;
        const existing = routeMap.get(routeKey);

        if (existing) {
          existing.volume += buyOrder.volume;
          existing.orderCount += 1;
          existing.isContaminated =
            existing.isContaminated || buyOrder.isContaminated;
        } else {
          routeMap.set(routeKey, {
            farm: buyOrder.supplier,
            warehouse: buyOrder.destination,
            store: sellOrder.destination,
            volume: buyOrder.volume,
            orderCount: 1,
            isContaminated: buyOrder.isContaminated,
          });
        }
      });
    });

    return Array.from(routeMap.values())
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);
  }, [sellOrders]);

  // Calculate warehouse distribution
  const warehouseDistribution = useMemo(() => {
    const warehouseMap = new Map<
      string,
      { name: string; city: string; volume: number }
    >();

    buyOrders.forEach((order) => {
      const warehouseId = order.destination.id;
      const existing = warehouseMap.get(warehouseId);

      if (existing) {
        existing.volume += order.volume;
      } else {
        warehouseMap.set(warehouseId, {
          name: order.destination.name,
          city: order.destination.city,
          volume: order.volume,
        });
      }
    });

    return Array.from(warehouseMap.values())
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);
  }, [buyOrders]);

  return {
    // Entity counts
    uniqueFarms,
    uniqueWarehouses,
    uniqueStores,

    // Order counts
    buyOrderCount: buyOrders.length,
    sellOrderCount: sellOrders.length,

    // Volumes
    volumePurchased,
    volumeSold,
    volumeLoss,

    // Contamination
    contaminationMetrics,

    // Routes and distribution
    topRoutes,
    warehouseDistribution,

    // States
    isPending,
    isError,
  };
};

