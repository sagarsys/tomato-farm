import { useMemo, useState } from "react";
import { Store, Truck, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import { formatCurrency, formatVolume } from "@/lib/format";
import { calculateSellOrderMetrics } from "@/features/orders/utils/orderCalculations";
import { cn } from "@/lib/utils";

type ViewType = "buyers" | "suppliers";

interface RankedEntity {
  id: string;
  name: string;
  city: string;
  orderCount: number;
  totalVolume: number;
  totalValue: number;
}

/**
 * Widget showing top buyers (stores) and suppliers (farms) by volume/revenue
 */
export function TopBuyersSuppliersWidget() {
  const [view, setView] = useState<ViewType>("buyers");
  const { sellOrders, buyOrders, isPending } = useOrdersData();

  // Calculate top buyers (stores from sell orders)
  const topBuyers = useMemo((): RankedEntity[] => {
    const storeMap = new Map<string, RankedEntity>();

    sellOrders.forEach((order) => {
      const metrics = calculateSellOrderMetrics(order);
      const existing = storeMap.get(order.destination.id);
      
      if (existing) {
        existing.orderCount++;
        existing.totalVolume += metrics.totalVolume;
        existing.totalValue += metrics.revenue;
      } else {
        storeMap.set(order.destination.id, {
          id: order.destination.id,
          name: order.destination.name,
          city: order.destination.city,
          orderCount: 1,
          totalVolume: metrics.totalVolume,
          totalValue: metrics.revenue,
        });
      }
    });

    return Array.from(storeMap.values())
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  }, [sellOrders]);

  // Calculate top suppliers (farms from buy orders)
  const topSuppliers = useMemo((): RankedEntity[] => {
    const farmMap = new Map<string, RankedEntity>();

    buyOrders.forEach((order) => {
      const totalCost = order.volume * order.pricePerUnit;
      const existing = farmMap.get(order.supplier.id);
      
      if (existing) {
        existing.orderCount++;
        existing.totalVolume += order.volume;
        existing.totalValue += totalCost;
      } else {
        farmMap.set(order.supplier.id, {
          id: order.supplier.id,
          name: order.supplier.name,
          city: order.supplier.city,
          orderCount: 1,
          totalVolume: order.volume,
          totalValue: totalCost,
        });
      }
    });

    return Array.from(farmMap.values())
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 5);
  }, [buyOrders]);

  const data = view === "buyers" ? topBuyers : topSuppliers;
  const maxValue = data.length > 0 ? data[0].totalValue : 1;

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Buyers & Suppliers</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">Loading...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {view === "buyers" ? (
              <Store className="h-5 w-5 text-purple-500" />
            ) : (
              <Truck className="h-5 w-5 text-green-500" />
            )}
            Top {view === "buyers" ? "Buyers" : "Suppliers"}
          </CardTitle>
          <div className="flex gap-1 bg-muted p-1 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs h-6 px-2",
                view === "buyers" && "bg-background shadow-sm"
              )}
              onClick={() => setView("buyers")}
            >
              <Store className="h-3 w-3 mr-1" />
              Buyers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs h-6 px-2",
                view === "suppliers" && "bg-background shadow-sm"
              )}
              onClick={() => setView("suppliers")}
            >
              <Truck className="h-3 w-3 mr-1" />
              Suppliers
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {view === "buyers" 
            ? "Stores by revenue from sell orders" 
            : "Farms by volume from buy orders"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((entity, index) => (
            <div key={entity.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <div>
                    <span className="text-sm font-medium">{entity.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{entity.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {view === "buyers" 
                      ? formatCurrency(entity.totalValue)
                      : formatVolume(entity.totalVolume) + " kg"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entity.orderCount} orders
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    view === "buyers" ? "bg-purple-500" : "bg-green-500"
                  )}
                  style={{ width: `${(entity.totalValue / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
