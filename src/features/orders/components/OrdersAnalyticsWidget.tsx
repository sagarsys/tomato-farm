import { TrendingUp, TrendingDown, Minus, DollarSign, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodComparison } from "../hooks/useOrdersAnalytics";
import { formatCurrency, formatVolume } from "@/lib/format";

interface OrdersAnalyticsWidgetProps {
  comparison: PeriodComparison;
  periodDays: number;
}

interface MetricCardProps {
  title: string;
  currentValue: string;
  previousValue: string;
  change: { value: number; percent: number };
  icon: React.ReactNode;
  formatChange?: (value: number) => string;
  invertColor?: boolean; // For metrics where decrease is good (like contamination)
}

/**
 * Individual metric card with comparison
 */
function MetricCard({
  title,
  currentValue,
  previousValue,
  change,
  icon,
  formatChange,
  invertColor = false,
}: MetricCardProps) {
  const isPositive = invertColor ? change.percent < 0 : change.percent > 0;
  const isNegative = invertColor ? change.percent > 0 : change.percent < 0;
  const isNeutral = change.percent === 0;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral
    ? "text-gray-500"
    : isPositive
    ? "text-green-600"
    : "text-red-600";
  const bgColor = isNeutral
    ? "bg-gray-50"
    : isPositive
    ? "bg-green-50"
    : "bg-red-50";

  const formattedChange = formatChange
    ? formatChange(Math.abs(change.value))
    : Math.abs(change.value).toLocaleString();

  return (
    <div className={`p-4 rounded-lg ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{title}</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{Math.abs(change.percent).toFixed(1)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold">{currentValue}</div>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <span>vs {previousValue}</span>
        <span className={trendColor}>
          ({change.value >= 0 ? "+" : "-"}{formattedChange})
        </span>
      </div>
    </div>
  );
}

/**
 * Widget displaying period-over-period comparison metrics
 */
export function OrdersAnalyticsWidget({ comparison, periodDays }: OrdersAnalyticsWidgetProps) {
  const { current, previous, changes } = comparison;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Period Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Last {periodDays} days vs previous {periodDays} days
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetricCard
            title="Revenue"
            currentValue={formatCurrency(current.revenue)}
            previousValue={formatCurrency(previous.revenue)}
            change={changes.revenue}
            icon={<DollarSign className="h-4 w-4" />}
            formatChange={(v) => formatCurrency(v)}
          />
          <MetricCard
            title="Profit"
            currentValue={formatCurrency(current.profit)}
            previousValue={formatCurrency(previous.profit)}
            change={changes.profit}
            icon={<DollarSign className="h-4 w-4" />}
            formatChange={(v) => formatCurrency(v)}
          />
          <MetricCard
            title="Volume"
            currentValue={formatVolume(current.volume)}
            previousValue={formatVolume(previous.volume)}
            change={changes.volume}
            icon={<Package className="h-4 w-4" />}
            formatChange={(v) => formatVolume(v)}
          />
          <MetricCard
            title="Orders"
            currentValue={current.orderCount.toLocaleString()}
            previousValue={previous.orderCount.toLocaleString()}
            change={changes.orderCount}
            icon={<ShoppingCart className="h-4 w-4" />}
          />
        </div>
        
        {/* Contamination rate - separate for emphasis */}
        <div className="mt-3 pt-3 border-t">
          <MetricCard
            title="Contamination Rate"
            currentValue={`${current.contaminationRate.toFixed(1)}%`}
            previousValue={`${previous.contaminationRate.toFixed(1)}%`}
            change={changes.contaminationRate}
            icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
            formatChange={(v) => `${v.toFixed(1)}%`}
            invertColor // Decrease in contamination is good
          />
        </div>
      </CardContent>
    </Card>
  );
}
