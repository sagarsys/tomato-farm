import { useRef } from "react";
import { Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TractorIcon } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { Farm } from "@/types";

interface FarmsTableProps {
  table: TanstackTable<Farm>;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

// Responsive grid columns: minmax(min, percentage)
// select | name | city | orders | volume | status | rate | actions
const GRID_COLS = "minmax(40px, 4%) minmax(120px, 18%) minmax(100px, 14%) minmax(70px, 8%) minmax(90px, 12%) minmax(110px, 14%) minmax(120px, 16%) minmax(50px, 5%)";

/**
 * Virtualized farms table using CSS Grid for proper alignment
 */
export function FarmsTable({
  table,
  hasActiveFilters,
  onClearFilters,
}: FarmsTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const isEmpty = rows.length === 0;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  if (isEmpty) {
    return (
      <div className="rounded-md border p-8">
        <EmptyState
          icon={TractorIcon}
          title="No farms found"
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters to see more results."
              : "There are no farms available at the moment."
          }
          actionLabel={hasActiveFilters ? "Clear filters" : undefined}
          onAction={hasActiveFilters ? onClearFilters : undefined}
        />
      </div>
    );
  }

  return (
    <div className="rounded-md border w-full">
      {/* Header - using standard table header for better button support */}
      <div
        className="grid border-b bg-muted/50 sticky top-0 z-20 w-full"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              className="px-2 py-3 text-left text-sm font-medium text-muted-foreground flex items-center"
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))
        )}
      </div>

      {/* Virtualized Body */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: "600px" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="grid absolute w-full border-b hover:bg-muted/50 data-[state=selected]:bg-muted"
                style={{
                  gridTemplateColumns: GRID_COLS,
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="px-2 py-3 flex items-center text-sm overflow-hidden"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <span>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </span>
        <span>
          Showing {rowVirtualizer.getVirtualItems().length} of {rows.length} farms
        </span>
      </div>
    </div>
  );
}
