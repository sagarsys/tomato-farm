import { Tractor, Warehouse, Store, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SupplyChainFlowCard } from "../components/SupplyChainFlowCard";
import { FlowArrow } from "../components/FlowArrow";
import { MetricCard } from "../components/MetricCard";
import { SupplyChainRoutesWidget } from "../components/SupplyChainRoutesWidget";
import { useSupplyChainMetrics } from "../hooks/useSupplyChainMetrics";
import { formatVolume } from "../utils/orderCalculations";
import Loader from "../common/Loader";

export default function SupplyChain() {
  const {
    uniqueFarms,
    uniqueWarehouses,
    uniqueStores,
    buyOrderCount,
    sellOrderCount,
    volumePurchased,
    volumeSold,
    volumeLoss,
    contaminationMetrics,
    topRoutes,
    isPending,
  } = useSupplyChainMetrics();

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Supply Chain Overview</h1>
        <p className="text-muted-foreground mt-1">
          Visualize the flow of tomatoes from farms through warehouses to stores
        </p>
      </div>

      {/* Section 1: Visual Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Flow</CardTitle>
          <CardDescription>
            Tomato distribution across the supply chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <SupplyChainFlowCard
              title="Farms"
              count={uniqueFarms}
              volume={volumePurchased}
              icon={Tractor}
              iconColor="text-green-600"
              description="Tomato Suppliers"
            />
            <FlowArrow
              label={`${buyOrderCount.toLocaleString()} orders`}
              sublabel="Buy Orders"
            />
            <SupplyChainFlowCard
              title="Warehouses"
              count={uniqueWarehouses}
              volume={volumePurchased}
              icon={Warehouse}
              iconColor="text-blue-600"
              description="Distribution Centers"
            />
            <FlowArrow
              label={`${sellOrderCount.toLocaleString()} orders`}
              sublabel="Sell Orders"
            />
            <SupplyChainFlowCard
              title="Stores"
              count={uniqueStores}
              volume={volumeSold}
              icon={Store}
              iconColor="text-purple-600"
              description="Retail Outlets"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Flow Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Volume Purchased"
          value={`${formatVolume(volumePurchased)} kg`}
          subtitle="From farms"
          icon={Tractor}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Volume in Storage"
          value={`${formatVolume(volumePurchased)} kg`}
          subtitle="In warehouses"
          icon={Warehouse}
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Volume Sold"
          value={`${formatVolume(volumeSold)} kg`}
          subtitle="To stores"
          icon={Store}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Volume Loss"
          value={`${formatVolume(volumeLoss)} kg`}
          subtitle="Contamination/Waste"
          icon={AlertTriangle}
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
      </div>

      {/* Section 3: Contamination Impact on Supply Chain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Contamination Impact on Supply Chain
          </CardTitle>
          <CardDescription>
            How contamination flows through the distribution network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium">At Farm Level</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {contaminationMetrics.contaminatedFarmsCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Farms with contamination
              </p>
              <p className="text-sm text-muted-foreground">
                {contaminationMetrics.contaminatedBuyOrderCount.toLocaleString()}{" "}
                contaminated buy orders
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium">At Warehouse Level</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {contaminationMetrics.contaminatedWarehousesCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Warehouses with contaminated stock
              </p>
              <p className="text-sm text-muted-foreground">
                Cannot distribute contaminated inventory
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium">At Store Level</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {contaminationMetrics.affectedStoresCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Stores cannot receive orders
              </p>
              <p className="text-sm text-muted-foreground">
                Affected by contaminated supply
              </p>
            </div>
            <div className="space-y-2 border-l pl-6">
              <p className="text-sm font-medium">Flow Breakdown</p>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Clean Flow</span>
                    <span className="font-medium">
                      {(
                        ((buyOrderCount -
                          contaminationMetrics.contaminatedBuyOrderCount) /
                          buyOrderCount) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{
                        width: `${
                          ((buyOrderCount -
                            contaminationMetrics.contaminatedBuyOrderCount) /
                            buyOrderCount) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      Contaminated Flow
                    </span>
                    <span className="font-medium">
                      {(
                        (contaminationMetrics.contaminatedBuyOrderCount /
                          buyOrderCount) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600"
                      style={{
                        width: `${
                          (contaminationMetrics.contaminatedBuyOrderCount /
                            buyOrderCount) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Top Supply Routes */}
      <SupplyChainRoutesWidget routes={topRoutes} />
    </div>
  );
}

