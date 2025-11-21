import { FaPlus } from "react-icons/fa";
import { useMemo, useState } from "react";
import { format, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon, AlertTriangle } from "lucide-react";

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

type OrderType = "buy" | "sell";

export default function Orders() {
  const [orderType, setOrderType] = useState<OrderType>("sell");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isFiltering, setIsFiltering] = useState(false);
  const [showOnlyContaminated, setShowOnlyContaminated] = useState(false);
  const [showOnlyClean, setShowOnlyClean] = useState(false);

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

  // Display first 50 orders for performance
  const displayedBuyOrders = filteredBuyOrders.slice(0, 50);
  const displayedSellOrders = filteredSellOrders.slice(0, 50);

  const handleFilter = () => {
    setIsFiltering(true);
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIsFiltering(false);
    setShowOnlyContaminated(false);
    setShowOnlyClean(false);
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
        <Button variant="default" className="gap-2">
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
            {displayedSellOrders.length < filteredSellOrders.length && (
              <CardDescription className="text-sm italic">
                Showing first 50 of {filteredSellOrders.length.toLocaleString()} orders
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Volume (kg)</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedSellOrders.map((order) => {
                  const metrics = calculateSellOrderMetrics(order);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.destination.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.destination.city}
                        </div>
                      </TableCell>
                      <TableCell>{format(order.date, "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        {formatVolume(metrics.totalVolume)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(metrics.totalCost)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        {formatCurrency(metrics.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600 font-semibold">
                        {formatCurrency(metrics.profit)}
                      </TableCell>
                      <TableCell>
                        {metrics.isContaminated ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Contaminated
                          </Badge>
                        ) : (
                          <Badge variant="default">Clean</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
            {displayedBuyOrders.length < filteredBuyOrders.length && (
              <CardDescription className="text-sm italic">
                Showing first 50 of {filteredBuyOrders.length.toLocaleString()} orders
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Farm</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Volume (kg)</TableHead>
                  <TableHead className="text-right">Price/Unit</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedBuyOrders.map((order) => {
                  const metrics = calculateBuyOrderMetrics(order);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.supplier.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.supplier.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.destination.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.destination.city}
                        </div>
                      </TableCell>
                      <TableCell>{format(order.date, "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        {formatVolume(metrics.volume)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.pricePerUnit}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(metrics.totalCost)}
                      </TableCell>
                      <TableCell>
                        {metrics.isContaminated ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Contaminated
                          </Badge>
                        ) : (
                          <Badge variant="default">Clean</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
