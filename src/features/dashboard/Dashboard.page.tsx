import { DollarSign, TrendingUp, Package, Percent } from "lucide-react";
import { ContaminationImpactCard } from "./components/ContaminationImpactCard";
import { MetricCard } from "./components/MetricCard";
import { TopFarmsWidget } from "./components/TopFarmsWidget";
import { RecentOrdersWidget } from "./components/RecentOrdersWidget";
import { TrendsChart } from "./components/TrendsChart";
import { ContaminationTrendsChart } from "./components/ContaminationTrendsChart";
import { OrderStatusWidget } from "./components/OrderStatusWidget";
import { TopBuyersSuppliersWidget } from "./components/TopBuyersSuppliersWidget";
import { useDashboardMetrics } from "./hooks/useDashboardMetrics";
import { formatCurrency, formatVolume } from "@/lib/format";
import Loader from "@/components/Loader";

export function Dashboard() {
  const {
    totalRevenue,
    totalProfit,
    profitMargin,
    totalVolumeSold,
    topFarms,
    recentOrders,
    isPending,
  } = useDashboardMetrics();

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {/* Metric Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="From all sell orders"
          icon={DollarSign}
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
        <MetricCard
          title="Total Profit"
          value={formatCurrency(totalProfit)}
          subtitle="Revenue minus costs"
          icon={TrendingUp}
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          subtitle="Profit / Revenue"
          icon={Percent}
          iconColor="text-purple-600"
          valueColor="text-purple-600"
        />
        <MetricCard
          title="Total Volume Sold"
          value={`${formatVolume(totalVolumeSold)} kg`}
          subtitle="Total tomatoes sold"
          icon={Package}
          iconColor="text-orange-600"
          valueColor="text-orange-600"
        />
      </div>

      {/* Contamination Alert */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <ContaminationImpactCard />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <TrendsChart />
        <ContaminationTrendsChart />
      </div>

      {/* Widgets Row */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <TopFarmsWidget farms={topFarms} />
        <RecentOrdersWidget orders={recentOrders} />
      </div>

      {/* Order Analytics Row */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <OrderStatusWidget />
        <TopBuyersSuppliersWidget />
      </div>
    </div>
  );
}
