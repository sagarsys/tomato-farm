import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import {
  calculateSellOrderMetrics,
  calculateSellOrderTotals,
} from "@/features/orders/utils/orderCalculations";

interface ChartDataPoint {
  date: string;
  revenue: number;
  profit: number;
  contaminated: number;
  clean: number;
}

/**
 * Time-series chart showing revenue, profit, and contamination trends
 * Groups orders by day for the last 30 days
 */
export function TrendsChart() {
  const { sellOrders, isPending } = useOrdersData();

  const chartData = useMemo((): ChartDataPoint[] => {
    // Get last 30 days of data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i));
      return {
        date,
        dateStr: format(date, "MMM dd"),
        revenue: 0,
        profit: 0,
        contaminated: 0,
        clean: 0,
      };
    });

    // Group orders by day
    sellOrders.forEach((order) => {
      const orderDate = startOfDay(order.date);
      const dayIndex = last30Days.findIndex(
        (day) => day.date.getTime() === orderDate.getTime()
      );

      if (dayIndex !== -1) {
        const metrics = calculateSellOrderMetrics(order);
        last30Days[dayIndex].revenue += metrics.revenue;
        last30Days[dayIndex].profit += metrics.profit;
        
        if (metrics.isContaminated) {
          last30Days[dayIndex].contaminated += 1;
        } else {
          last30Days[dayIndex].clean += 1;
        }
      }
    });

    return last30Days.map(({ dateStr, revenue, profit, contaminated, clean }) => ({
      date: dateStr,
      revenue: Math.round(revenue),
      profit: Math.round(profit),
      contaminated,
      clean,
    }));
  }, [sellOrders]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Trends</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Profit Trends</CardTitle>
        <CardDescription>Last 30 days of financial performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              name="Revenue"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              name="Profit"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

