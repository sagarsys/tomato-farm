import { useMemo } from "react";
import { CheckCircle2, Clock, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import { formatCurrency } from "@/lib/format";
import { calculateSellOrderMetrics } from "@/features/orders/utils/orderCalculations";

/**
 * Widget showing order status breakdown (pending vs completed)
 * Orders with dates in the future are considered pending
 */
export function OrderStatusWidget() {
  const { sellOrders, buyOrders, isPending } = useOrdersData();

  const stats = useMemo(() => {
    const now = new Date();
    
    // Sell orders stats
    let completedSellOrders = 0;
    let pendingSellOrders = 0;
    let completedRevenue = 0;
    let pendingRevenue = 0;

    sellOrders.forEach((order) => {
      const metrics = calculateSellOrderMetrics(order);
      if (order.date <= now) {
        completedSellOrders++;
        completedRevenue += metrics.revenue;
      } else {
        pendingSellOrders++;
        pendingRevenue += metrics.revenue;
      }
    });

    // Buy orders stats
    let completedBuyOrders = 0;
    let pendingBuyOrders = 0;

    buyOrders.forEach((order) => {
      if (order.date <= now) {
        completedBuyOrders++;
      } else {
        pendingBuyOrders++;
      }
    });

    const totalSellOrders = completedSellOrders + pendingSellOrders;
    const completionRate = totalSellOrders > 0 
      ? (completedSellOrders / totalSellOrders) * 100 
      : 0;

    return {
      completedSellOrders,
      pendingSellOrders,
      completedBuyOrders,
      pendingBuyOrders,
      completedRevenue,
      pendingRevenue,
      completionRate,
    };
  }, [sellOrders, buyOrders]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">Loading...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion Rate */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Completion Rate</span>
          </div>
          <span className="text-lg font-bold text-blue-700">
            {stats.completionRate.toFixed(1)}%
          </span>
        </div>

        {/* Sell Orders */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Sell Orders</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Completed</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-700">
                  {stats.completedSellOrders.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  {formatCurrency(stats.completedRevenue)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">Pending</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-orange-700">
                  {stats.pendingSellOrders.toLocaleString()}
                </div>
                <div className="text-xs text-orange-600">
                  {formatCurrency(stats.pendingRevenue)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Orders */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Buy Orders</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Completed</span>
              </div>
              <span className="text-sm font-bold text-green-700">
                {stats.completedBuyOrders.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">Pending</span>
              </div>
              <span className="text-sm font-bold text-orange-700">
                {stats.pendingBuyOrders.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
