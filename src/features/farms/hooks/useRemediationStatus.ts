import { useSyncExternalStore, useMemo } from "react";
import { remediationService } from "@/services/remediationService";
import { RemediationStatus } from "@/types/remediation";

/**
 * Subscribe to remediation status for a farm via remediationService
 */
export function useRemediationStatus(farmId: string) {
  const subscribe = (onStoreChange: () => void) =>
    remediationService.subscribe(onStoreChange);

  const getSnapshot = () =>
    remediationService.getRecord(farmId)?.status ?? RemediationStatus.None;

  const getServerSnapshot = getSnapshot;

  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => status, [status]);
}

