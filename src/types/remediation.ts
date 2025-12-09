/**
 * Remediation status for contaminated farms
 */
export enum RemediationStatus {
  None = "none",
  Contaminated = "contaminated",
  UnderRemediation = "under_remediation",
  Testing = "testing",
  Clean = "clean",
}

/**
 * Remediation record tracking cleanup efforts
 */
export interface RemediationRecord {
  id: string;
  farmId: string;
  status: RemediationStatus;
  startedAt: Date;
  targetCompletionDate?: Date;
  completedAt?: Date;
  assignedTo?: string;
  notes: string;
  priority: "low" | "medium" | "high" | "critical";
  history: RemediationHistoryEntry[];
}

/**
 * History entry for status changes
 */
export interface RemediationHistoryEntry {
  timestamp: Date;
  status: RemediationStatus;
  notes: string;
  updatedBy: string;
}
