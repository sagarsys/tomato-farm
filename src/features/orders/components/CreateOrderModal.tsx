import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { farms, warehouses, stores } from "@/services/mockData";

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderType: "buy" | "sell";
}

/**
 * Modal for creating new buy or sell orders
 * Buy orders: Farm → Warehouse
 * Sell orders: Warehouse → Store
 */
export function CreateOrderModal({
  open,
  onOpenChange,
  orderType,
}: CreateOrderModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [supplier, setSupplier] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [volume, setVolume] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [isContaminated, setIsContaminated] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!supplier || !destination || !volume || !pricePerUnit) {
      toast.error("Please fill in all required fields");
      return;
    }

    const volumeNum = parseFloat(volume);
    const priceNum = parseFloat(pricePerUnit);

    if (isNaN(volumeNum) || volumeNum <= 0) {
      toast.error("Volume must be a positive number");
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    // Create order data
    const orderData = {
      date: format(date, "yyyy-MM-dd"),
      supplier,
      destination,
      volume: volumeNum,
      pricePerUnit: priceNum,
      ...(orderType === "buy" && { isContaminated }),
    };

    // TODO: In a real app, this would call an API
    console.log("Creating order:", orderData);

    toast.success(
      `${orderType === "buy" ? "Buy" : "Sell"} order created successfully!`
    );

    // Reset form
    handleReset();
    onOpenChange(false);
  };

  // Reset form fields
  const handleReset = () => {
    setSupplier("");
    setDestination("");
    setVolume("");
    setPricePerUnit("");
    setIsContaminated(false);
    setDate(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Create {orderType === "buy" ? "Buy" : "Sell"} Order
          </DialogTitle>
          <DialogDescription>
            {orderType === "buy"
              ? "Purchase tomatoes from a farm to store in a warehouse"
              : "Sell tomatoes from a warehouse to a store"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Order Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Supplier (Farm or Warehouse) */}
          <div className="space-y-2">
            <Label htmlFor="supplier">
              {orderType === "buy" ? "Farm (Supplier)" : "Warehouse (Supplier)"}{" "}
              *
            </Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${orderType === "buy" ? "farm" : "warehouse"}`}
                />
              </SelectTrigger>
              <SelectContent>
                {orderType === "buy"
                  ? farms.slice(0, 50).map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name} - {farm.city}
                      </SelectItem>
                    ))
                  : warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} - {warehouse.city}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination (Warehouse or Store) */}
          <div className="space-y-2">
            <Label htmlFor="destination">
              {orderType === "buy"
                ? "Warehouse (Destination)"
                : "Store (Destination)"}{" "}
              *
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${orderType === "buy" ? "warehouse" : "store"}`}
                />
              </SelectTrigger>
              <SelectContent>
                {orderType === "buy"
                  ? warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} - {warehouse.city}
                      </SelectItem>
                    ))
                  : stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} - {store.city}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label htmlFor="volume">Volume (kg) *</Label>
            <Input
              id="volume"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter volume in kg"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>

          {/* Price Per Unit */}
          <div className="space-y-2">
            <Label htmlFor="price">Price Per Unit ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price per kg"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
            />
          </div>

          {/* Contamination Checkbox (Buy Orders Only) */}
          {orderType === "buy" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contaminated"
                checked={isContaminated}
                onCheckedChange={(checked) => setIsContaminated(!!checked)}
              />
              <Label
                htmlFor="contaminated"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mark as contaminated
              </Label>
            </div>
          )}

          {/* Calculated Total */}
          {volume && pricePerUnit && (
            <div className="rounded-lg border p-3 bg-muted">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Cost:
                </span>
                <span className="text-lg font-semibold">
                  ${(parseFloat(volume) * parseFloat(pricePerUnit)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

