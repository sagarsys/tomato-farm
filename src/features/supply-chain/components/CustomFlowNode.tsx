import { Handle, Position } from "@xyflow/react";
import { Tractor, Warehouse, Store, AlertTriangle } from "lucide-react";
import { FlowNodeData } from "../hooks/useSupplyChainFlow";
import { formatVolume } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const icons = {
  farm: Tractor,
  warehouse: Warehouse,
  store: Store,
};

const colors = {
  farm: "text-green-600",
  warehouse: "text-blue-600",
  store: "text-purple-600",
};

const bgColors = {
  farm: "bg-green-50 dark:bg-green-950/20",
  warehouse: "bg-blue-50 dark:bg-blue-950/20",
  store: "bg-purple-50 dark:bg-purple-950/20",
};

/**
 * Custom node component for React Flow
 * Displays entity info with icon, name, stats
 */
export function CustomFlowNode({ data }: { data: FlowNodeData }) {
  const Icon = icons[data.type];
  const color = colors[data.type];
  const bgColor = bgColors[data.type];

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-md min-w-[200px] ${bgColor} ${
        data.isContaminated
          ? "border-red-500 dark:border-red-600"
          : "border-border"
      }`}
    >
      {/* Handles for connections */}
      {data.type === "farm" && (
        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      )}
      {data.type === "warehouse" && (
        <>
          <Handle type="target" position={Position.Left} className="w-3 h-3" />
          <Handle type="source" position={Position.Right} className="w-3 h-3" />
        </>
      )}
      {data.type === "store" && (
        <Handle type="target" position={Position.Left} className="w-3 h-3" />
      )}

      {/* Node Content */}
      <div className="flex items-start gap-2">
        <Icon className={`h-5 w-5 ${color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate flex items-center gap-2">
            {data.label}
            {data.isContaminated && (
              <AlertTriangle className="h-3 w-3 text-red-600 shrink-0" />
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {data.city}
          </div>
          <div className="flex gap-2 mt-1 text-xs">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {data.orderCount} orders
            </Badge>
            {data.volume > 0 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {formatVolume(data.volume)} kg
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

