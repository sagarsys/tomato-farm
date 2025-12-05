import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Farm } from "../data/types";
import { formatVolume } from "../utils/orderCalculations";
import Loader from "../common/Loader";
import { useQuery } from "@tanstack/react-query";
import { farms } from "../data/mockData";
import { useFarmMetrics } from "../hooks/useFarmMetrics";
import { TopContaminatedFarmsWidget } from "../components/TopContaminatedFarmsWidget";

// Create columns function that receives farmMetricsMap
export const createColumns = (
  getFarmMetrics: (farmId: string) => any
): ColumnDef<Farm>[] => [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Farm Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    id: "orderCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Orders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume (kg)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = getFarmMetrics(row.original.id);
      return (
        <div className="text-right font-medium">
          {metrics ? formatVolume(metrics.totalVolume) : "0"}
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metrics = getFarmMetrics(row.original.id);
      if (!metrics) {
        return <Badge variant="outline">No Orders</Badge>;
      }
      return metrics.isContaminated ? (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Contaminated
        </Badge>
      ) : (
        <Badge variant="default">Clean</Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      const metricsA = getFarmMetrics(rowA.original.id);
      const metricsB = getFarmMetrics(rowB.original.id);
      return (metricsA?.isContaminated ? 1 : 0) - (metricsB?.isContaminated ? 1 : 0);
    },
  },
  {
    id: "contaminationRate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contamination Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Farms = () => {
  const {
    data = [],
    isPending,
    isError,
  } = useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return farms;
    },
  });

  const {
    getFarmMetrics,
    topContaminatedFarms,
    isPending: isMetricsPending,
  } = useFarmMetrics();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showOnlyContaminated, setShowOnlyContaminated] = React.useState(false);
  const [showOnlyClean, setShowOnlyClean] = React.useState(false);

  // Filter farms based on contamination status
  const filteredData = React.useMemo(() => {
    if (!showOnlyContaminated && !showOnlyClean) return data;

    return data.filter((farm) => {
      const metrics = getFarmMetrics(farm.id);
      if (!metrics) return false;

      if (showOnlyContaminated) {
        return metrics.isContaminated;
      }
      if (showOnlyClean) {
        return !metrics.isContaminated;
      }
      return true;
    });
  }, [data, showOnlyContaminated, showOnlyClean, getFarmMetrics]);

  const columns = React.useMemo(
    () => createColumns(getFarmMetrics),
    [getFarmMetrics]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isPending || isMetricsPending) {
    return <Loader />;
  }

  return (
    <>
      <div className="w-full space-y-4">
        {/* Top Contaminated Farms Widget */}
        {topContaminatedFarms.length > 0 && (
          <TopContaminatedFarmsWidget farms={topContaminatedFarms} />
        )}

        <div className="flex items-center gap-4 py-4 flex-wrap">
          <Input
            placeholder="Filter farms..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Checkbox
              id="contaminated-farms"
              checked={showOnlyContaminated}
              onCheckedChange={(checked) => {
                setShowOnlyContaminated(!!checked);
                if (checked) setShowOnlyClean(false);
              }}
            />
            <label
              htmlFor="contaminated-farms"
              className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3 text-red-600" />
              Contaminated only
            </label>
          </div>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Checkbox
              id="clean-farms"
              checked={showOnlyClean}
              onCheckedChange={(checked) => {
                setShowOnlyClean(!!checked);
                if (checked) setShowOnlyContaminated(false);
              }}
            />
            <label
              htmlFor="clean-farms"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Clean only
            </label>
          </div>
          {(showOnlyContaminated || showOnlyClean) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowOnlyContaminated(false);
                setShowOnlyClean(false);
              }}
            >
              Clear Filters
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Farms;
