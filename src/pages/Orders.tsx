import { FaPlus } from "react-icons/fa";
import { useMemo, useState } from "react";
import { format, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, AlertTriangle, ArrowUpDown, PackageX } from "lucide-react";
import toast from "react-hot-toast";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { SellOrder } from "../data/types";
import {
  calculateBuyOrderMetrics,
  calculateBuyOrderTotals,
  calculateSellOrderMetrics,
  calculateSellOrderTotals,
  formatCurrency,
  formatVolume,
} from "../utils/orderCalculations";
import { useOrdersData } from "../hooks/useOrdersData";
import Loader from "../common/Loader";
import { BuyOrder } from "../data/types";
import { EmptyState } from "../components/EmptyState";

type OrderType = "buy" | "sell";

// Define columns for Sell Orders
const sellOrderColumns: ColumnDef<SellOrder>[] = [
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

// Define columns for Buy Orders
const buyOrderColumns: ColumnDef<BuyOrder>[] = [
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

export default function Orders() {
  const [orderType, setOrderType] = useState<OrderType>("sell");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isFiltering, setIsFiltering] = useState(false);
  const [showOnlyContaminated, setShowOnlyContaminated] = useState(false);
  const [showOnlyClean, setShowOnlyClean] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch orders data
  const {
    buyOrders: buyOrdersData,
    sellOrders: sellOrdersData,
    isPending,
  } = useOrdersData();

  // Filter orders by date range and contamination status
  const filteredBuyOrders = useMemo(() => {
    let filtered = buyOrdersData;

    // Apply date filtering
    if (isFiltering && (startDate || endDate)) {
      filtered = filtered.filter((order) => {
        if (startDate && endDate) {
          return isWithinInterval(order.date, { start: startDate, end: endDate });
        }
        if (startDate) {
          return order.date >= startDate;
        }
        if (endDate) {
          return order.date <= endDate;
        }
        return true;
      });
    }

    // Apply contamination filtering
    if (showOnlyContaminated) {
      filtered = filtered.filter((order) => order.isContaminated);
    }
    if (showOnlyClean) {
      filtered = filtered.filter((order) => !order.isContaminated);
    }

    return filtered;
  }, [buyOrdersData, startDate, endDate, isFiltering, showOnlyContaminated, showOnlyClean]);

  const filteredSellOrders = useMemo(() => {
    let filtered = sellOrdersData;

    // Apply date filtering
    if (isFiltering && (startDate || endDate)) {
      filtered = filtered.filter((order) => {
        if (startDate && endDate) {
          return isWithinInterval(order.date, { start: startDate, end: endDate });
        }
        if (startDate) {
          return order.date >= startDate;
        }
        if (endDate) {
          return order.date <= endDate;
        }
        return true;
      });
    }

    // Apply contamination filtering
    if (showOnlyContaminated) {
      filtered = filtered.filter((order) => {
        const metrics = calculateSellOrderMetrics(order);
        return metrics.isContaminated;
      });
    }
    if (showOnlyClean) {
      filtered = filtered.filter((order) => {
        const metrics = calculateSellOrderMetrics(order);
        return !metrics.isContaminated;
      });
    }

    return filtered;
  }, [sellOrdersData, startDate, endDate, isFiltering, showOnlyContaminated, showOnlyClean]);

  // Calculate totals
  const buyOrderTotals = useMemo(
    () => calculateBuyOrderTotals(filteredBuyOrders),
    [filteredBuyOrders]
  );

  const sellOrderTotals = useMemo(
    () => calculateSellOrderTotals(filteredSellOrders),
    [filteredSellOrders]
  );

  // Initialize TanStack Table for Sell Orders
  const sellOrdersTable = useReactTable({
    data: filteredSellOrders,
    columns: sellOrderColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  // Initialize TanStack Table for Buy Orders
  const buyOrdersTable = useReactTable({
    data: filteredBuyOrders,
    columns: buyOrderColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  const handleFilter = () => {
    setIsFiltering(true);
    toast.success("Filters applied");
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIsFiltering(false);
    setShowOnlyContaminated(false);
    setShowOnlyClean(false);
    toast.success("Filters cleared");
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex gap-4 justify-between flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy Orders</SelectItem>
              <SelectItem value="sell">Sell Orders</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-52 justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-52 justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Checkbox
              id="contaminated"
              checked={showOnlyContaminated}
              onCheckedChange={(checked) => {
                setShowOnlyContaminated(!!checked);
                if (checked) setShowOnlyClean(false);
              }}
            />
            <label
              htmlFor="contaminated"
              className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3 text-red-600" />
              Contaminated only
            </label>
          </div>
          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Checkbox
              id="clean"
              checked={showOnlyClean}
              onCheckedChange={(checked) => {
                setShowOnlyClean(!!checked);
                if (checked) setShowOnlyContaminated(false);
              }}
            />
            <label
              htmlFor="clean"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Clean only
            </label>
          </div>
          <Button variant="outline" onClick={handleFilter}>
            Filter
          </Button>
          {isFiltering && (
            <Button variant="ghost" onClick={handleClearFilter}>
              Clear Filter
            </Button>
          )}
        </div>
        <Button
          variant="default"
          className="gap-2"
          onClick={() => toast("Create order feature coming soon!", { icon: "🚧" })}
        >
          <FaPlus />
          Create Order
        </Button>
      </div>

      {orderType === "sell" ? (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Sell Orders</CardTitle>
            <div className="flex gap-4 flex-wrap">
              <CardDescription className="text-lg font-semibold text-green-600">
                Total Revenue: {formatCurrency(sellOrderTotals.totalRevenue)}
              </CardDescription>
              <CardDescription className="text-lg font-semibold text-blue-600">
                Total Profit: {formatCurrency(sellOrderTotals.totalProfit)}
              </CardDescription>
              <CardDescription className="text-lg font-semibold">
                Total Cost: {formatCurrency(sellOrderTotals.totalCost)}
              </CardDescription>
            </div>
            <div className="flex gap-4 flex-wrap text-sm">
              <CardDescription>
                Orders: {sellOrderTotals.orderCount.toLocaleString()}
              </CardDescription>
              <CardDescription>
                Volume: {formatVolume(sellOrderTotals.totalVolume)} kg
              </CardDescription>
              {sellOrderTotals.contaminatedCount > 0 && (
                <CardDescription className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Contaminated: {sellOrderTotals.contaminatedCount}
                </CardDescription>
              )}
            </div>
            {sellOrdersTable.getRowModel().rows.length < filteredSellOrders.length && (
              <CardDescription className="text-sm italic">
                Showing page {sellOrdersTable.getState().pagination.pageIndex + 1} of{" "}
                {sellOrdersTable.getPageCount()} ({filteredSellOrders.length.toLocaleString()} total orders)
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {sellOrdersTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {sellOrdersTable.getRowModel().rows.length ? (
                    sellOrdersTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
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
                      <TableCell colSpan={sellOrderColumns.length} className="p-0">
                        <EmptyState
                          icon={PackageX}
                          title="No orders found"
                          description={
                            isFiltering || showOnlyContaminated || showOnlyClean
                              ? "Try adjusting your filters to see more results."
                              : "There are no sell orders available at the moment."
                          }
                          actionLabel={isFiltering ? "Clear filters" : undefined}
                          onAction={isFiltering ? handleClearFilter : undefined}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sellOrdersTable.previousPage()}
                disabled={!sellOrdersTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sellOrdersTable.nextPage()}
                disabled={!sellOrdersTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Buy Orders</CardTitle>
            <div className="flex gap-4 flex-wrap">
              <CardDescription className="text-lg font-semibold">
                Total Cost: {formatCurrency(buyOrderTotals.totalCost)}
              </CardDescription>
              <CardDescription className="text-lg font-semibold">
                Total Volume: {formatVolume(buyOrderTotals.totalVolume)} kg
              </CardDescription>
            </div>
            <div className="flex gap-4 flex-wrap text-sm">
              <CardDescription>
                Orders: {buyOrderTotals.orderCount.toLocaleString()}
              </CardDescription>
              {buyOrderTotals.contaminatedCount > 0 && (
                <CardDescription className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Contaminated: {buyOrderTotals.contaminatedCount}
                </CardDescription>
              )}
            </div>
            {buyOrdersTable.getRowModel().rows.length < filteredBuyOrders.length && (
              <CardDescription className="text-sm italic">
                Showing page {buyOrdersTable.getState().pagination.pageIndex + 1} of{" "}
                {buyOrdersTable.getPageCount()} ({filteredBuyOrders.length.toLocaleString()} total orders)
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {buyOrdersTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {buyOrdersTable.getRowModel().rows.length ? (
                    buyOrdersTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
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
                      <TableCell colSpan={buyOrderColumns.length} className="p-0">
                        <EmptyState
                          icon={PackageX}
                          title="No orders found"
                          description={
                            isFiltering || showOnlyContaminated || showOnlyClean
                              ? "Try adjusting your filters to see more results."
                              : "There are no buy orders available at the moment."
                          }
                          actionLabel={isFiltering ? "Clear filters" : undefined}
                          onAction={isFiltering ? handleClearFilter : undefined}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => buyOrdersTable.previousPage()}
                disabled={!buyOrdersTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => buyOrdersTable.nextPage()}
                disabled={!buyOrdersTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
