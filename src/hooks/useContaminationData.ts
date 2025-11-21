import { calculateContaminationImpact } from "../utils/orderCalculations";
import { useOrdersData } from "./useOrdersData";

/**
 * Custom hook to fetch and calculate contamination impact metrics
 * Reusable across Dashboard and other pages
 * Leverages useOrdersData to share the same query cache
 */
export const useContaminationData = () => {
  const { sellOrders, isPending, isError } = useOrdersData();

  const contaminationMetrics = calculateContaminationImpact(sellOrders);

  return {
    contaminationMetrics,
    isPending,
    isError,
  };
};

