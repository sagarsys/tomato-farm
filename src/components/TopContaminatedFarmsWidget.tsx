import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVolume } from "../utils/orderCalculations";
import { FarmMetrics } from "../hooks/useFarmMetrics";

interface TopContaminatedFarmsWidgetProps {
  farms: FarmMetrics[];
}

/**
 * Widget displaying farms with highest contamination issues
 */
export const TopContaminatedFarmsWidget = ({
  farms,
}: TopContaminatedFarmsWidgetProps) => {
  if (farms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <AlertTriangle className="h-5 w-5" />
            Top Contaminated Farms
          </CardTitle>
          <CardDescription>Great news - no contaminated farms!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Top Contaminated Farms
        </CardTitle>
        <CardDescription>
          Farms with the most contamination issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {farms.map((farmMetrics, index) => (
            <div
              key={farmMetrics.farm.id}
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {farmMetrics.farm.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {farmMetrics.farm.city}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="destructive" className="text-xs">
                      {farmMetrics.contaminatedOrderCount} contaminated orders
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {farmMetrics.contaminationRate.toFixed(1)}% rate
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1 flex-shrink-0">
                <p className="text-sm font-semibold">
                  {formatVolume(farmMetrics.totalVolume)} kg
                </p>
                <p className="text-xs text-muted-foreground">
                  {farmMetrics.orderCount} total orders
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

