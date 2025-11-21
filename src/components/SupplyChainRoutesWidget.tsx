import { Route, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "../utils/orderCalculations";

interface SupplyRoute {
  farm: { name: string; city: string };
  warehouse: { name: string; city: string };
  store: { name: string; city: string };
  volume: number;
  orderCount: number;
  isContaminated: boolean;
}

interface SupplyChainRoutesWidgetProps {
  routes: SupplyRoute[];
}

/**
 * Widget displaying top supply chain routes from farms through warehouses to stores
 */
export const SupplyChainRoutesWidget = ({
  routes,
}: SupplyChainRoutesWidgetProps) => {
  if (routes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Top Supply Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No routes available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Top Supply Routes
        </CardTitle>
        <CardDescription>
          Highest volume Farm → Warehouse → Store paths
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routes.map((route, index) => (
            <div
              key={`route-${index}`}
              className="border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {index + 1}
                  </div>
                  {route.isContaminated && (
                    <Badge variant="destructive" className="text-xs px-2 py-0">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Contaminated
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatVolume(route.volume)} kg
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {route.orderCount} orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1">
                  <p className="font-medium">{route.farm.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {route.farm.city}
                  </p>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex-1">
                  <p className="font-medium">{route.warehouse.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {route.warehouse.city}
                  </p>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex-1">
                  <p className="font-medium">{route.store.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {route.store.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

