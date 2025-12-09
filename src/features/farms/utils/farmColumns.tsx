import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Wrench } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Farm } from "@/types";
import { FarmMetrics } from "../hooks/useFarmMetrics";
import { RemediationStatusBadge } from "../components/RemediationStatusBadge";

interface CreateColumnsParams {
  getFarmMetrics: (farmId: string) => FarmMetrics | undefined;
  onStartRemediation: (farm: Farm) => void;
}

/**
 * Creates column definitions for the farms table
 */
export const createFarmColumns = ({
  getFarmMetrics,
  onStartRemediation,
}: CreateColumnsParams): ColumnDef<Farm>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Farm Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    id: "orderCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Orders
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const metrics = getFarmMetrics(row.original.id);
      return (
        <div className="text-right font-medium">
          {metrics?.orderCount.toLocaleString() || 0}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const metricsA = getFarmMetrics(rowA.original.id);
      const metricsB = getFarmMetrics(rowB.original.id);
      return (metricsA?.orderCount || 0) - (metricsB?.orderCount || 0);
    },
  },
  {
    id: "volume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Volume (kg)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const metrics = getFarmMetrics(row.original.id);
      return (
        <div className="text-right font-medium">
          {metrics ? metrics.totalVolume : "0"}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const metricsA = getFarmMetrics(rowA.original.id);
      const metricsB = getFarmMetrics(rowB.original.id);
      return (metricsA?.totalVolume || 0) - (metricsB?.totalVolume || 0);
    },
  },
  {
    id: "contaminationStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const farmId = row.original.id;
      const metrics = getFarmMetrics(farmId);

      if (!metrics) {
        return <Badge variant="outline">No Orders</Badge>;
      }

      return <RemediationStatusBadge farmId={farmId} isContaminated={metrics.isContaminated} />;
    },
    sortingFn: (rowA, rowB) => {
      const metricsA = getFarmMetrics(rowA.original.id);
      const metricsB = getFarmMetrics(rowB.original.id);
      return (metricsA?.isContaminated ? 1 : 0) - (metricsB?.isContaminated ? 1 : 0);
    },
  },
  {
    id: "contaminationRate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contamination Rate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const metrics = getFarmMetrics(row.original.id);
      if (!metrics || metrics.orderCount === 0) {
        return <div className="text-right text-muted-foreground">N/A</div>;
      }
      return (
        <div className="text-right">
          <span
            className={
              metrics.contaminationRate > 50
                ? "text-red-600 font-semibold"
                : metrics.contaminationRate > 0
                ? "text-orange-600"
                : "text-green-600"
            }
          >
            {metrics.contaminationRate.toFixed(1)}%
          </span>
          <div className="text-xs text-muted-foreground">
            {metrics.contaminatedOrderCount}/{metrics.orderCount} orders
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const metricsA = getFarmMetrics(rowA.original.id);
      const metricsB = getFarmMetrics(rowB.original.id);
      return (metricsA?.contaminationRate || 0) - (metricsB?.contaminationRate || 0);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const farm = row.original;
      const metrics = getFarmMetrics(farm.id);
      const isContaminated = metrics?.isContaminated;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(farm.id);
                toast.success("Farm ID copied to clipboard!");
              }}
            >
              Copy farm ID
            </DropdownMenuItem>
            {isContaminated && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onStartRemediation(farm)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Start Remediation
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

