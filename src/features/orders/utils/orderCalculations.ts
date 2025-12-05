import { BuyOrder, SellOrder } from "@/types";

/**
 * Calculate financial metrics for a single sell order
 */
export const calculateSellOrderMetrics = (sellOrder: SellOrder) => {
  // Total cost = sum of all buy orders (volume × pricePerUnit)
  const totalCost = sellOrder.costs.reduce(
    (sum, buyOrder) => sum + buyOrder.volume * buyOrder.pricePerUnit,
    0
  );

  // Total volume = sum of all buy order volumes
  const totalVolume = sellOrder.costs.reduce(
    (sum, buyOrder) => sum + buyOrder.volume,
    0
  );

  // Revenue = total volume × sell price per unit
  const revenue = totalVolume * sellOrder.pricePerUnit;

  // Profit = revenue - cost
  const profit = revenue - totalCost;

  // Check if any buy orders are contaminated
  const isContaminated = sellOrder.costs.some(
    (buyOrder) => buyOrder.isContaminated
  );

  return {
    totalCost,
    totalVolume,
    revenue,
    profit,
    isContaminated,
  };
};

/**
 * Calculate financial metrics for a single buy order
 */
export const calculateBuyOrderMetrics = (buyOrder: BuyOrder) => {
  const totalCost = buyOrder.volume * buyOrder.pricePerUnit;

  return {
    totalCost,
    volume: buyOrder.volume,
    isContaminated: buyOrder.isContaminated,
  };
};

/**
 * Calculate aggregate metrics for multiple sell orders
 */
export const calculateSellOrderTotals = (sellOrders: SellOrder[]) => {
  let totalRevenue = 0;
  let totalCost = 0;
  let totalVolume = 0;
  let contaminatedCount = 0;

  sellOrders.forEach((order) => {
    const metrics = calculateSellOrderMetrics(order);
    totalRevenue += metrics.revenue;
    totalCost += metrics.totalCost;
    totalVolume += metrics.totalVolume;
    if (metrics.isContaminated) {
      contaminatedCount++;
    }
  });

  const totalProfit = totalRevenue - totalCost;

  return {
    totalRevenue,
    totalCost,
    totalProfit,
    totalVolume,
    contaminatedCount,
    orderCount: sellOrders.length,
  };
};

/**
 * Calculate aggregate metrics for multiple buy orders
 */
export const calculateBuyOrderTotals = (buyOrders: BuyOrder[]) => {
  let totalCost = 0;
  let totalVolume = 0;
  let contaminatedCount = 0;

  buyOrders.forEach((order) => {
    const metrics = calculateBuyOrderMetrics(order);
    totalCost += metrics.totalCost;
    totalVolume += metrics.volume;
    if (metrics.isContaminated) {
      contaminatedCount++;
    }
  });

  return {
    totalCost,
    totalVolume,
    contaminatedCount,
    orderCount: buyOrders.length,
  };
};


/**
 * Calculate contamination impact across all sell orders
 */
export const calculateContaminationImpact = (sellOrders: SellOrder[]) => {
  const contaminatedOrders = sellOrders.filter((order) => {
    const metrics = calculateSellOrderMetrics(order);
    return metrics.isContaminated;
  });

  // Calculate lost revenue from contaminated orders
  let lostRevenue = 0;
  const affectedStoresSet = new Set<string>();
  const contaminatedFarmsSet = new Set<string>();

  contaminatedOrders.forEach((order) => {
    const metrics = calculateSellOrderMetrics(order);
    lostRevenue += metrics.revenue;
    affectedStoresSet.add(order.destination.id);

    // Collect all contaminated farms from buy orders
    order.costs.forEach((buyOrder) => {
      if (buyOrder.isContaminated) {
        contaminatedFarmsSet.add(buyOrder.supplier.id);
      }
    });
  });

  const contaminationPercentage =
    sellOrders.length > 0
      ? (contaminatedOrders.length / sellOrders.length) * 100
      : 0;

  return {
    contaminatedOrderCount: contaminatedOrders.length,
    totalOrderCount: sellOrders.length,
    lostRevenue,
    affectedStoresCount: affectedStoresSet.size,
    contaminatedFarmsCount: contaminatedFarmsSet.size,
    contaminationPercentage,
  };
};

