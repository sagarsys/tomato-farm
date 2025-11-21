import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatVolume } from "../utils/orderCalculations";

interface SupplyChainFlowCardProps {
  title: string;
  count: number;
  volume: number;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

/**
 * Large card component for supply chain flow visualization
 * Displays a stage in the supply chain (Farms, Warehouses, or Stores)
 */
export const SupplyChainFlowCard = ({
  title,
  count,
  volume,
  icon: Icon,
  iconColor = "text-primary",
  description,
}: SupplyChainFlowCardProps) => {
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <div
            className={`h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ${iconColor}`}
          >
            <Icon className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <div>
          <p className="text-4xl font-bold">{count.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total {title}</p>
        </div>
        <div className="pt-2 border-t">
          <p className="text-2xl font-semibold text-primary">
            {formatVolume(volume)} kg
          </p>
          <p className="text-xs text-muted-foreground">Total Volume</p>
        </div>
      </CardContent>
    </Card>
  );
};

