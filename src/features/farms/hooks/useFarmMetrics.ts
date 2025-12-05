import { useMemo } from "react";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import { Farm } from "@/types";

export interface FarmMetrics {
  farm: Farm;
  orderCount: number;
  totalVolume: number;
  contaminatedOrderCount: number;
  isContaminated: boolean;
  contaminationRate: number;
}

/**
 * Custom hook to calculate metrics per farm
 * Tracks order count, volume, and contamination status for each farm
 */
export const useFarmMetrics = () => {
  const { buyOrders, isPending, isError } = useOrdersData();

  // Calculate metrics for each farm
  const farmMetricsMap = useMemo(() => {
    const metricsMap = new Map<string, FarmMetrics>();

    buyOrders.forEach((order) => {
      const farmId = order.supplier.id;
      const existing = metricsMap.get(farmId);

      if (existing) {
        existing.orderCount += 1;
        existing.totalVolume += order.volume;
        if (order.isContaminated) {
          existing.contaminatedOrderCount += 1;
        }
      } else {
        metricsMap.set(farmId, {
          farm: order.supplier,
          orderCount: 1,
          totalVolume: order.volume,
          contaminatedOrderCount: order.isContaminated ? 1 : 0,
          isContaminated: order.isContaminated,
          contaminationRate: 0,
        });
      }
    });

    // Calculate contamination rate for each farm
    metricsMap.forEach((metrics) => {
      metrics.contaminationRate =
        (metrics.contaminatedOrderCount / metrics.orderCount) * 100;
      // Mark farm as contaminated if any orders are contaminated
      metrics.isContaminated = metrics.contaminatedOrderCount > 0;
    });

    return metricsMap;
  }, [buyOrders]);

  // Get top contaminated farms
  const topContaminatedFarms = useMemo(() => {
    return Array.from(farmMetricsMap.values())
      .filter((metrics) => metrics.isContaminated)
      .sort((a, b) => b.contaminatedOrderCount - a.contaminatedOrderCount)
      .slice(0, 10);
  }, [farmMetricsMap]);

  // Get metrics for a specific farm
  const getFarmMetrics = (farmId: string): FarmMetrics | undefined => {
    return farmMetricsMap.get(farmId);
  };

  return {
    farmMetricsMap,
    topContaminatedFarms,
    getFarmMetrics,
    isPending,
    isError,
  };
};

