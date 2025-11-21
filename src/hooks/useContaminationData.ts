import { useQuery } from "@tanstack/react-query";
import { sellOrders } from "../data/mockData";
import { SellOrder } from "../data/types";
import { calculateContaminationImpact } from "../utils/orderCalculations";

/**
 * Custom hook to fetch and calculate contamination impact metrics
 * Reusable across Dashboard and other pages
 */
export const useContaminationData = () => {
  const {
    data: sellOrdersData = [],
    isPending,
    isError,
    error,
  } = useQuery<SellOrder[]>({
    queryKey: ["sellOrders"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sellOrders;
    },
  });

  const contaminationMetrics = calculateContaminationImpact(sellOrdersData);

  return {
    contaminationMetrics,
    isPending,
    isError,
    error,
  };
};

