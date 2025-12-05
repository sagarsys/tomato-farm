import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  } from "@/features/orders/utils/orderCalculations";

interface TopFarm {
  name: string;
  city: string;
  totalVolume: number;
  orderCount: number;
}

interface TopFarmsWidgetProps {
  farms: TopFarm[];
}

/**
 * Widget displaying top performing farms by volume
 */
export const TopFarmsWidget = ({ farms }: TopFarmsWidgetProps) => {
  if (farms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Farms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Performing Farms
        </CardTitle>
        <CardDescription>Highest volume suppliers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {farms.map((farm, index) => (
            <div key={`${farm.name}-${index}`} className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{farm.name}</p>
                <p className="text-xs text-muted-foreground">{farm.city}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {(farm.totalVolume)} kg
                </p>
                <p className="text-xs text-muted-foreground">
                  {farm.orderCount} orders
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

