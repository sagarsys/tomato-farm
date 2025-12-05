import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContaminationData } from "../hooks/useContaminationData";
import {  } from "@/features/orders/utils/orderCalculations";
import Loader from "@/components/Loader";

/**
 * Contamination Impact Card component
 * Displays contamination metrics including lost revenue, affected stores, and contaminated farms
 */
export const ContaminationImpactCard = () => {
  const { contaminationMetrics, isPending, isError } = useContaminationData();

  if (isPending) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Contamination Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Contamination Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Error loading contamination data
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    contaminatedOrderCount,
    totalOrderCount,
    lostRevenue,
    affectedStoresCount,
    contaminatedFarmsCount,
    contaminationPercentage,
  } = contaminationMetrics;

  const cleanOrderCount = totalOrderCount - contaminatedOrderCount;

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Contamination Impact
        </CardTitle>
        <Badge variant="destructive" className="text-lg px-3 py-1">
          {contaminationPercentage.toFixed(1)}% Contaminated
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Primary Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold text-red-600">
                {(lostRevenue)}
              </p>
              <CardDescription className="text-sm font-medium">
                Lost Revenue (Cannot Be Sold)
              </CardDescription>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {totalOrderCount.toLocaleString()}
              </p>
              <CardDescription className="text-sm font-medium">
                Total Sell Orders
              </CardDescription>
            </div>
          </div>

          {/* Order Breakdown */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {contaminatedOrderCount.toLocaleString()}
                </p>
                <CardDescription className="text-xs">
                  Contaminated Orders
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {cleanOrderCount.toLocaleString()}
                </p>
                <CardDescription className="text-xs">
                  Clean Orders
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Supporting Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-lg font-semibold">{affectedStoresCount}</p>
              <CardDescription className="text-xs">
                Stores Cannot Receive Orders
              </CardDescription>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {contaminatedFarmsCount}
              </p>
              <CardDescription className="text-xs">
                Farms with Contamination
              </CardDescription>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

