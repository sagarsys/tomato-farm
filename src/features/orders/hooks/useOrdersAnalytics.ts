import { useMemo } from "react";
import { subDays, startOfDay, isWithinInterval } from "date-fns";
import { SellOrder, BuyOrder } from "@/types";
import {
  calculateSellOrderMetrics,
  calculateBuyOrderMetrics,
} from "../utils/orderCalculations";

export interface PeriodMetrics {
  revenue: number;
  profit: number;
  cost: number;
  volume: number;
  orderCount: number;
  contaminatedCount: number;
  contaminationRate: number;
}

export interface PeriodComparison {
  current: PeriodMetrics;
  previous: PeriodMetrics;
  changes: {
    revenue: { value: number; percent: number };
    profit: { value: number; percent: number };
    volume: { value: number; percent: number };
    orderCount: { value: number; percent: number };
    contaminationRate: { value: number; percent: number };
  };
}

export interface DailyDataPoint {
  date: Date;
  dateStr: string;
  revenue: number;
  profit: number;
  volume: number;
  orderCount: number;
  contaminatedCount: number;
}

/**
 * Hook for calculating order analytics with period comparisons
 * Compares current period (last N days) vs previous period (N-2N days ago)
 */
export const useOrdersAnalytics = (
  sellOrders: SellOrder[],
  buyOrders: BuyOrder[],
  periodDays: number = 30
) => {
  // Calculate period boundaries
  const periods = useMemo(() => {
    const now = new Date();
    const currentStart = startOfDay(subDays(now, periodDays - 1));
    const currentEnd = now;
    const previousStart = startOfDay(subDays(now, periodDays * 2 - 1));
    const previousEnd = startOfDay(subDays(now, periodDays));

    return { currentStart, currentEnd, previousStart, previousEnd };
  }, [periodDays]);

  // Filter orders by period
  const filterByPeriod = useMemo(() => {
    const isInCurrentPeriod = (date: Date) =>
      isWithinInterval(date, { start: periods.currentStart, end: periods.currentEnd });
    
    const isInPreviousPeriod = (date: Date) =>
      isWithinInterval(date, { start: periods.previousStart, end: periods.previousEnd });

    return {
      currentSellOrders: sellOrders.filter((o) => isInCurrentPeriod(o.date)),
      previousSellOrders: sellOrders.filter((o) => isInPreviousPeriod(o.date)),
      currentBuyOrders: buyOrders.filter((o) => isInCurrentPeriod(o.date)),
      previousBuyOrders: buyOrders.filter((o) => isInPreviousPeriod(o.date)),
    };
  }, [sellOrders, buyOrders, periods]);

  // Calculate metrics for a set of sell orders
  const calculatePeriodMetrics = (orders: SellOrder[]): PeriodMetrics => {
    let revenue = 0;
    let profit = 0;
    let cost = 0;
    let volume = 0;
    let contaminatedCount = 0;

    orders.forEach((order) => {
      const metrics = calculateSellOrderMetrics(order);
      revenue += metrics.revenue;
      profit += metrics.profit;
      cost += metrics.totalCost;
      volume += metrics.totalVolume;
      if (metrics.isContaminated) contaminatedCount++;
    });

    return {
      revenue,
      profit,
      cost,
      volume,
      orderCount: orders.length,
      contaminatedCount,
      contaminationRate: orders.length > 0 ? (contaminatedCount / orders.length) * 100 : 0,
    };
  };

  // Calculate period comparison
  const comparison = useMemo((): PeriodComparison => {
    const current = calculatePeriodMetrics(filterByPeriod.currentSellOrders);
    const previous = calculatePeriodMetrics(filterByPeriod.previousSellOrders);

    const calcChange = (curr: number, prev: number) => ({
      value: curr - prev,
      percent: prev !== 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0,
    });

    return {
      current,
      previous,
      changes: {
        revenue: calcChange(current.revenue, previous.revenue),
        profit: calcChange(current.profit, previous.profit),
        volume: calcChange(current.volume, previous.volume),
        orderCount: calcChange(current.orderCount, previous.orderCount),
        contaminationRate: calcChange(current.contaminationRate, previous.contaminationRate),
      },
    };
  }, [filterByPeriod]);

  // Generate daily data for charts (current period)
  const dailyData = useMemo((): DailyDataPoint[] => {
    const days: DailyDataPoint[] = [];
    
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      days.push({
        date,
        dateStr: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: 0,
        profit: 0,
        volume: 0,
        orderCount: 0,
        contaminatedCount: 0,
      });
    }

    // Aggregate sell orders by day
    filterByPeriod.currentSellOrders.forEach((order) => {
      const orderDate = startOfDay(order.date);
      const dayIndex = days.findIndex((d) => d.date.getTime() === orderDate.getTime());
      
      if (dayIndex !== -1) {
        const metrics = calculateSellOrderMetrics(order);
        days[dayIndex].revenue += metrics.revenue;
        days[dayIndex].profit += metrics.profit;
        days[dayIndex].volume += metrics.totalVolume;
        days[dayIndex].orderCount += 1;
        if (metrics.isContaminated) days[dayIndex].contaminatedCount += 1;
      }
    });

    return days;
  }, [filterByPeriod.currentSellOrders, periodDays]);

  // Generate daily data for previous period (for comparison overlay)
  const previousDailyData = useMemo((): DailyDataPoint[] => {
    const days: DailyDataPoint[] = [];
    
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), periodDays + i));
      days.push({
        date,
        dateStr: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: 0,
        profit: 0,
        volume: 0,
        orderCount: 0,
        contaminatedCount: 0,
      });
    }

    filterByPeriod.previousSellOrders.forEach((order) => {
      const orderDate = startOfDay(order.date);
      const dayIndex = days.findIndex((d) => d.date.getTime() === orderDate.getTime());
      
      if (dayIndex !== -1) {
        const metrics = calculateSellOrderMetrics(order);
        days[dayIndex].revenue += metrics.revenue;
        days[dayIndex].profit += metrics.profit;
        days[dayIndex].volume += metrics.totalVolume;
        days[dayIndex].orderCount += 1;
        if (metrics.isContaminated) days[dayIndex].contaminatedCount += 1;
      }
    });

    return days;
  }, [filterByPeriod.previousSellOrders, periodDays]);

  return {
    comparison,
    dailyData,
    previousDailyData,
    periods,
    periodDays,
  };
};
