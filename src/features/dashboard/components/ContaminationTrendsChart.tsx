import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import { calculateSellOrderMetrics } from "@/features/orders/utils/orderCalculations";

/**
 * Bar chart showing contaminated vs clean orders over time
 * Displays last 14 days for better visibility
 */
export function ContaminationTrendsChart() {
  const { sellOrders, isPending } = useOrdersData();

  const chartData = useMemo(() => {
    // Get last 14 days
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 13 - i));
      return {
        date,
        dateStr: format(date, "MMM dd"),
        contaminated: 0,
        clean: 0,
      };
    });

    // Group orders by day
    sellOrders.forEach((order) => {
      const orderDate = startOfDay(order.date);
      const dayIndex = last14Days.findIndex(
        (day) => day.date.getTime() === orderDate.getTime()
      );

      if (dayIndex !== -1) {
        const metrics = calculateSellOrderMetrics(order);
        if (metrics.isContaminated) {
          last14Days[dayIndex].contaminated += 1;
        } else {
          last14Days[dayIndex].clean += 1;
        }
      }
    });

    return last14Days.map(({ dateStr, contaminated, clean }) => ({
      date: dateStr,
      contaminated,
      clean,
      total: contaminated + clean,
    }));
  }, [sellOrders]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contamination Trends</CardTitle>
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
        <CardTitle>Contamination Trends</CardTitle>
        <CardDescription>Clean vs Contaminated orders - Last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
            <Legend />
            <Bar
              dataKey="clean"
              fill="hsl(142, 76%, 36%)"
              name="Clean Orders"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="contaminated"
              fill="hsl(0, 84%, 60%)"
              name="Contaminated Orders"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

