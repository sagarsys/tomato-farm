import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyDataPoint } from "../hooks/useOrdersAnalytics";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type MetricType = "revenue" | "profit" | "volume" | "orders";

interface OrdersTrendChartProps {
  dailyData: DailyDataPoint[];
  previousDailyData: DailyDataPoint[];
  periodDays: number;
}

/**
 * Interactive trend chart with metric toggle and period comparison
 */
export function OrdersTrendChart({
  dailyData,
  previousDailyData,
  periodDays,
}: OrdersTrendChartProps) {
  const [metric, setMetric] = useState<MetricType>("revenue");

  // Combine current and previous data for comparison
  const chartData = dailyData.map((current, index) => {
    const previous = previousDailyData[index];
    return {
      label: current.dateStr,
      current: getMetricValue(current, metric),
      previous: previous ? getMetricValue(previous, metric) : 0,
    };
  });

  const metricConfig = {
    revenue: { label: "Revenue", color: "hsl(142, 76%, 36%)", format: formatCurrency },
    profit: { label: "Profit", color: "hsl(221, 83%, 53%)", format: formatCurrency },
    volume: { label: "Volume (kg)", color: "hsl(262, 83%, 58%)", format: (v: number) => `${(v / 1000).toFixed(1)}k` },
    orders: { label: "Orders", color: "hsl(25, 95%, 53%)", format: (v: number) => v.toLocaleString() },
  };

  const config = metricConfig[metric];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-lg">Trend Analysis</CardTitle>
          <div className="flex gap-1 bg-muted p-1 rounded-md">
            {(["revenue", "profit", "volume", "orders"] as MetricType[]).map((m) => (
              <Button
                key={m}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs h-6 px-2 capitalize",
                  metric === m && "bg-background shadow-sm"
                )}
                onClick={() => setMetric(m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Current period vs previous {periodDays} days
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => config.format(value)}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              formatter={(value: number, name: string) => [
                config.format(value),
                name === "current" ? "Current Period" : "Previous Period",
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "current" ? "Current Period" : "Previous Period"
              }
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="hsl(var(--muted))"
              fillOpacity={0.3}
              name="previous"
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke={config.color}
              strokeWidth={2}
              fill={config.color}
              fillOpacity={0.2}
              name="current"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Get the metric value from a data point
 */
function getMetricValue(data: DailyDataPoint, metric: MetricType): number {
  switch (metric) {
    case "revenue":
      return data.revenue;
    case "profit":
      return data.profit;
    case "volume":
      return data.volume;
    case "orders":
      return data.orderCount;
  }
}
