import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Farm } from "@/types";
import { farms } from "@/services/mockData";
import Loader from "@/components/Loader";

import { useFarmMetrics } from "./hooks/useFarmMetrics";
import { useFarmRemediation } from "./hooks/useFarmRemediation";
import { useFarmsTable } from "./hooks/useFarmsTable";
import { createFarmColumns } from "./utils/farmColumns";
import { FarmsTable } from "./components/FarmsTable";
import { FarmsToolbar } from "./components/FarmsToolbar";
import { TopContaminatedFarmsWidget } from "./components/TopContaminatedFarmsWidget";
import { StartRemediationModal } from "./components/StartRemediationModal";

/**
 * Farms page - displays all farms with filtering, sorting, and remediation actions
 */
const Farms = () => {
  // Data fetching
  const { data = [], isPending } = useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return farms;
    },
  });

  // Metrics
  const { getFarmMetrics, topContaminatedFarms, isPending: isMetricsPending } = useFarmMetrics();

  // Remediation
  const remediation = useFarmRemediation();

  // Column definitions
  const columns = useMemo(
    () =>
      createFarmColumns({
        getFarmMetrics,
        onStartRemediation: remediation.startRemediation,
      }),
    [getFarmMetrics, remediation.startRemediation]
  );

  // Table with filtering and export
  const farmsTable = useFarmsTable({ data, columns, getFarmMetrics });

  // Loading state
  if (isPending || isMetricsPending) {
    return <Loader />;
  }

  return (
    <>
      {/* Remediation Modal */}
      {remediation.selectedFarm && (
        <StartRemediationModal
          open={remediation.isModalOpen}
          onOpenChange={(open) => !open && remediation.closeModal()}
          farmId={remediation.selectedFarm.id}
          farmName={remediation.selectedFarm.name}
          farmCity={remediation.selectedFarm.city}
          onSuccess={remediation.onRemediationSuccess}
        />
      )}

      <div className="w-full space-y-4">
        {/* Top Contaminated Farms */}
        {topContaminatedFarms.length > 0 && (
          <TopContaminatedFarmsWidget farms={topContaminatedFarms} />
        )}

        {/* Toolbar */}
        <FarmsToolbar
          table={farmsTable.table}
          showOnlyContaminated={farmsTable.showOnlyContaminated}
          setShowOnlyContaminated={farmsTable.setShowOnlyContaminated}
          showOnlyClean={farmsTable.showOnlyClean}
          setShowOnlyClean={farmsTable.setShowOnlyClean}
          onExport={farmsTable.exportFarms}
        />

        {/* Table */}
        <FarmsTable
          table={farmsTable.table}
          hasActiveFilters={farmsTable.hasActiveFilters}
          onClearFilters={farmsTable.clearFilters}
        />
      </div>
    </>
  );
};

export default Farms;
