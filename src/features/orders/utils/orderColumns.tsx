import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SellOrder, BuyOrder } from "@/types";
import {
  calculateBuyOrderMetrics,
  calculateSellOrderMetrics,
} from "./orderCalculations";
import { formatCurrency, formatVolume } from "@/lib/format";

/**
 * Column definitions for Sell Orders table
 */
export const sellOrderColumns: ColumnDef<SellOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original.id.slice(0, 8)}...</div>
    ),
  },
  {
    id: "store",
    accessorFn: (row) => row.destination.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Store
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.destination.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.destination.city}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(row.original.date, "MMM dd, yyyy"),
  },
  {
    id: "volume",
    accessorFn: (row) => {
      const metrics = calculateSellOrderMetrics(row);
      return metrics.totalVolume;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Volume (kg)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = calculateSellOrderMetrics(row.original);
      return (
        <div className="text-right">{formatVolume(metrics.totalVolume)}</div>
      );
    },
  },
  {
    id: "cost",
    accessorFn: (row) => {
      const metrics = calculateSellOrderMetrics(row);
      return metrics.totalCost;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = calculateSellOrderMetrics(row.original);
      return (
        <div className="text-right">{formatCurrency(metrics.totalCost)}</div>
      );
    },
  },
  {
    id: "revenue",
    accessorFn: (row) => {
      const metrics = calculateSellOrderMetrics(row);
      return metrics.revenue;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = calculateSellOrderMetrics(row.original);
      return (
        <div className="text-right text-green-600 font-semibold">
          {formatCurrency(metrics.revenue)}
        </div>
      );
    },
  },
  {
    id: "profit",
    accessorFn: (row) => {
      const metrics = calculateSellOrderMetrics(row);
      return metrics.profit;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Profit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = calculateSellOrderMetrics(row.original);
      return (
        <div className="text-right text-blue-600 font-semibold">
          {formatCurrency(metrics.profit)}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const metrics = calculateSellOrderMetrics(row.original);
      return metrics.isContaminated ? (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Contaminated
        </Badge>
      ) : (
        <Badge variant="default">Clean</Badge>
      );
    },
  },
];

/**
 * Column definitions for Buy Orders table
 */
export const buyOrderColumns: ColumnDef<BuyOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original.id.slice(0, 8)}...</div>
    ),
  },
  {
    id: "farm",
    accessorFn: (row) => row.supplier.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Farm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.supplier.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.supplier.city}
        </div>
      </div>
    ),
  },
  {
    id: "warehouse",
    accessorFn: (row) => row.destination.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Warehouse
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.destination.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.destination.city}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(row.original.date, "MMM dd, yyyy"),
  },
  {
    accessorKey: "volume",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Volume (kg)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = calculateBuyOrderMetrics(row.original);
      return (
        <div className="text-right">{formatVolume(metrics.volume)}</div>
      );
    },
  },
  {
    accessorKey: "pricePerUnit",
    header: () => <div className="text-right">Price/Unit</div>,
    cell: ({ row }) => (
      <div className="text-right">${row.original.pricePerUnit}</div>
    ),
  },
  {
    id: "totalCost",
    accessorFn: (row) => {
      const metrics = calculateBuyOrderMetrics(row);
      return metrics.totalCost;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-medium"
        >
          Total Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = calculateBuyOrderMetrics(row.original);
      return (
        <div className="text-right font-semibold">
          {formatCurrency(metrics.totalCost)}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const metrics = calculateBuyOrderMetrics(row.original);
      return metrics.isContaminated ? (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Contaminated
        </Badge>
      ) : (
        <Badge variant="default">Clean</Badge>
      );
    },
  },
];

