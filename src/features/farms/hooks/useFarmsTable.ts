import { useState, useMemo, useCallback } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import toast from "react-hot-toast";

import { Farm } from "@/types";
import { exportToCSV } from "@/lib/csvExport";
import { FarmMetrics } from "./useFarmMetrics";

interface UseFarmsTableParams {
  data: Farm[];
  columns: ColumnDef<Farm>[];
  getFarmMetrics: (farmId: string) => FarmMetrics | undefined;
}

/**
 * Hook to manage farms table state, filtering, and export
 */
export function useFarmsTable({ data, columns, getFarmMetrics }: UseFarmsTableParams) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Filter state
  const [showOnlyContaminated, setShowOnlyContaminated] = useState(false);
  const [showOnlyClean, setShowOnlyClean] = useState(false);

  // Computed: has active filters
  const hasActiveFilters = showOnlyContaminated || showOnlyClean || columnFilters.length > 0;

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setShowOnlyContaminated(false);
    setShowOnlyClean(false);
    setColumnFilters([]);
  }, []);

  /**
   * Filter data based on contamination status
   */
  const filteredData = useMemo(() => {
    if (!showOnlyContaminated && !showOnlyClean) return data;

    return data.filter((farm) => {
      const metrics = getFarmMetrics(farm.id);
      if (!metrics) return false;
      if (showOnlyContaminated) return metrics.isContaminated;
      if (showOnlyClean) return !metrics.isContaminated;
      return true;
    });
  }, [data, showOnlyContaminated, showOnlyClean, getFarmMetrics]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  /**
   * Export filtered farms to CSV
   */
  const exportFarms = useCallback(() => {
    const exportData = table.getFilteredRowModel().rows.map((row) => {
      const farm = row.original;
      const metrics = getFarmMetrics(farm.id);
      return {
        "Farm ID": farm.id,
        Name: farm.name,
        City: farm.city,
        "Total Orders": metrics?.orderCount || 0,
        "Total Volume (kg)": metrics?.totalVolume.toFixed(2) || "0",
        Status: metrics?.isContaminated ? "Contaminated" : "Clean",
        "Contamination Rate (%)": metrics?.contaminationRate.toFixed(1) || "0",
        "Contaminated Orders": metrics?.contaminatedOrderCount || 0,
      };
    });

    exportToCSV(exportData, `farms-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success(`Exported ${exportData.length} farms`);
  }, [table, getFarmMetrics]);

  return {
    // Table instance
    table,
    
    // Filter state
    showOnlyContaminated,
    setShowOnlyContaminated,
    showOnlyClean,
    setShowOnlyClean,
    hasActiveFilters,
    clearFilters,
    
    // Actions
    exportFarms,
  };
}

