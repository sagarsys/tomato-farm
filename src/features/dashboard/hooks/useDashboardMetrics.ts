import { useMemo } from "react";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import {
  calculateSellOrderMetrics,
  calculateSellOrderTotals,
  calculateBuyOrderTotals,
} from "@/features/orders/utils/orderCalculations";

/**
 * Custom hook to calculate dashboard business metrics
 * Aggregates data for revenue, profit, top farms, recent orders
 */
export const useDashboardMetrics = () => {
  const { buyOrders, sellOrders, isPending, isError } = useOrdersData();

  // Calculate overall totals
  const sellOrderTotals = useMemo(
    () => calculateSellOrderTotals(sellOrders),
    [sellOrders]
  );

  const buyOrderTotals = useMemo(
    () => calculateBuyOrderTotals(buyOrders),
    [buyOrders]
  );

  // Get top performing farms by total volume sold
  const topFarms = useMemo(() => {
    const farmVolumeMap = new Map<
      string,
      { name: string; city: string; totalVolume: number; orderCount: number }
    >();

    buyOrders.forEach((order) => {
      const farmId = order.supplier.id;
      const existing = farmVolumeMap.get(farmId);

      if (existing) {
        existing.totalVolume += order.volume;
        existing.orderCount += 1;
      } else {
        farmVolumeMap.set(farmId, {
          name: order.supplier.name,
          city: order.supplier.city,
          totalVolume: order.volume,
          orderCount: 1,
        });
      }
    });

    return Array.from(farmVolumeMap.values())
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5);
  }, [buyOrders]);

  // Get most recent orders
  const recentOrders = useMemo(() => {
    return [...sellOrders]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        date: order.date,
        destination: order.destination,
        metrics: calculateSellOrderMetrics(order),
      }));
  }, [sellOrders]);

  // Calculate profit margin percentage
  const profitMargin = useMemo(() => {
    if (sellOrderTotals.totalRevenue === 0) return 0;
    return (sellOrderTotals.totalProfit / sellOrderTotals.totalRevenue) * 100;
  }, [sellOrderTotals.totalProfit, sellOrderTotals.totalRevenue]);

  return {
    // Totals
    totalRevenue: sellOrderTotals.totalRevenue,
    totalProfit: sellOrderTotals.totalProfit,
    totalCost: buyOrderTotals.totalCost,
    profitMargin,

    // Volumes
    totalVolumeSold: sellOrderTotals.totalVolume,
    totalVolumePurchased: buyOrderTotals.totalVolume,

    // Orders
    sellOrderCount: sellOrderTotals.orderCount,
    buyOrderCount: buyOrderTotals.orderCount,

    // Top performers
    topFarms,
    recentOrders,

    // States
    isPending,
    isError,
  };
};

