import { Table } from "@tanstack/react-table";
import { AlertTriangle, ChevronDown, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Farm } from "@/types";

interface FarmsToolbarProps {
  table: Table<Farm>;
  showOnlyContaminated: boolean;
  setShowOnlyContaminated: (value: boolean) => void;
  showOnlyClean: boolean;
  setShowOnlyClean: (value: boolean) => void;
  onExport: () => void;
}

/**
 * Toolbar with filters, search, and export for farms table
 */
export function FarmsToolbar({
  table,
  showOnlyContaminated,
  setShowOnlyContaminated,
  showOnlyClean,
  setShowOnlyClean,
  onExport,
}: FarmsToolbarProps) {
  const hasActiveFilters = showOnlyContaminated || showOnlyClean;

  const handleClearFilters = () => {
    setShowOnlyContaminated(false);
    setShowOnlyClean(false);
  };

  return (
    <div className="flex items-center gap-4 py-4 flex-wrap">
      {/* Search Input */}
      <Input
        placeholder="Filter farms..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      {/* Contaminated Filter */}
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

      {/* Clean Filter */}
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

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      )}

      {/* Export Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="gap-2 ml-auto"
        disabled={table.getFilteredRowModel().rows.length === 0}
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>

      {/* Column Visibility */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

