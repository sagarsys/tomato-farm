import { useState, useCallback } from "react";
import { Farm } from "@/types";

/**
 * Hook to manage farm remediation modal state
 */
export function useFarmRemediation() {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const startRemediation = useCallback((farm: Farm) => {
    setSelectedFarm(farm);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedFarm(null);
  }, []);

  const onRemediationSuccess = useCallback(() => {
    setSelectedFarm(null);
  }, []);

  return {
    selectedFarm,
    isModalOpen: !!selectedFarm,
    startRemediation,
    closeModal,
    onRemediationSuccess,
  };
}
