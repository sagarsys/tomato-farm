import { useQuery } from "@tanstack/react-query";
import { buyOrders, sellOrders } from "@/services/mockData";
import { BuyOrder, SellOrder } from "@/types";

/**
 * Custom hook to fetch buy and sell orders
 * Reusable across Orders page and other components
 */
export const useOrdersData = () => {
  const {
    data: buyOrdersData = [],
    isPending: isBuyOrdersPending,
    isError: isBuyOrdersError,
  } = useQuery<BuyOrder[]>({
    queryKey: ["buyOrders"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return buyOrders;
    },
  });

  const {
    data: sellOrdersData = [],
    isPending: isSellOrdersPending,
    isError: isSellOrdersError,
  } = useQuery<SellOrder[]>({
    queryKey: ["sellOrders"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sellOrders;
    },
  });

  return {
    buyOrders: buyOrdersData,
    sellOrders: sellOrdersData,
    isPending: isBuyOrdersPending || isSellOrdersPending,
    isError: isBuyOrdersError || isSellOrdersError,
  };
};

