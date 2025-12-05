import { Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  } from "@/features/orders/utils/orderCalculations";

interface RecentOrder {
  id: string;
  date: Date;
  destination: {
    name: string;
    city: string;
  };
  metrics: {
    revenue: number;
    profit: number;
    isContaminated: boolean;
  };
}

interface RecentOrdersWidgetProps {
  orders: RecentOrder[];
}

/**
 * Widget displaying recent sell orders
 */
export const RecentOrdersWidget = ({ orders }: RecentOrdersWidgetProps) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No orders available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Orders
        </CardTitle>
        <CardDescription>Latest 5 sell orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {order.destination.name}
                  </p>
                  {order.metrics.isContaminated && (
                    <Badge variant="destructive" className="text-xs px-1 py-0">
                      <AlertTriangle className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.destination.city}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(order.date, "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-green-600">
                  {(order.metrics.revenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Profit: {(order.metrics.profit)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

