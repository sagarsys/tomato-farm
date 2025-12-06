import { RemediationRecord, RemediationStatus, RemediationHistoryEntry } from "@/types/remediation";

/**
 * In-memory remediation service
 * 
 * NOTE: This is intentionally in-memory only (no localStorage) because
 * the mock data is randomly generated on each page load. Persisting 
 * remediation records would result in orphaned farmIds that don't exist
 * in the newly generated data.
 * 
 * In a real app with a backend API, this would persist to a database.
 */
class RemediationService {
  private records: Map<string, RemediationRecord> = new Map();
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  /**
   * Get remediation record for a farm
   */
  getRecord(farmId: string): RemediationRecord | undefined {
    return this.records.get(farmId);
  }

  /**
   * Get all remediation records
   */
  getAllRecords(): RemediationRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get farms by remediation status
   */
  getByStatus(status: RemediationStatus): RemediationRecord[] {
    return this.getAllRecords().filter(r => r.status === status);
  }

  /**
   * Start remediation for a contaminated farm
   */
  startRemediation(params: {
    farmId: string;
    assignedTo?: string;
    notes: string;
    priority: "low" | "medium" | "high" | "critical";
    targetCompletionDate?: Date;
  }): RemediationRecord {
    const record: RemediationRecord = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      farmId: params.farmId,
      status: RemediationStatus.UnderRemediation,
      startedAt: new Date(),
      targetCompletionDate: params.targetCompletionDate,
      assignedTo: params.assignedTo,
      notes: params.notes,
      priority: params.priority,
      history: [
        {
          timestamp: new Date(),
          status: RemediationStatus.UnderRemediation,
          notes: `Remediation started: ${params.notes}`,
          updatedBy: params.assignedTo || "System",
        },
      ],
    };

    this.records.set(params.farmId, record);
    this.notify();
    return record;
  }

  /**
   * Update remediation status
   */
  updateStatus(
    farmId: string,
    newStatus: RemediationStatus,
    notes: string,
    updatedBy: string = "System"
  ): RemediationRecord | null {
    const record = this.records.get(farmId);
    if (!record) return null;

    // Add history entry
    record.history.push({
      timestamp: new Date(),
      status: newStatus,
      notes,
      updatedBy,
    });

    // Update status
    record.status = newStatus;

    // If completed, set completion date
    if (newStatus === RemediationStatus.Clean) {
      record.completedAt = new Date();
    }

    this.records.set(farmId, record);
    this.notify();
    return record;
  }

  /**
   * Add notes to existing remediation
   */
  addNotes(farmId: string, notes: string, updatedBy: string = "System"): boolean {
    const record = this.records.get(farmId);
    if (!record) return false;

    record.notes += `\n${new Date().toISOString()}: ${notes}`;
    record.history.push({
      timestamp: new Date(),
      status: record.status,
      notes,
      updatedBy,
    });

    this.notify();
    return true;
  }

  /**
   * Calculate remediation stats
   */
  getStats() {
    const all = this.getAllRecords();
    return {
      total: all.length,
      underRemediation: all.filter(r => r.status === RemediationStatus.UnderRemediation).length,
      testing: all.filter(r => r.status === RemediationStatus.Testing).length,
      completed: all.filter(r => r.status === RemediationStatus.Clean).length,
      avgDuration: this.calculateAvgDuration(),
    };
  }

  private calculateAvgDuration(): number {
    const completed = this.getAllRecords().filter(r => r.completedAt);
    if (completed.length === 0) return 0;

    const totalDays = completed.reduce((sum, r) => {
      const duration = r.completedAt!.getTime() - r.startedAt.getTime();
      return sum + (duration / (1000 * 60 * 60 * 24));
    }, 0);

    return Math.round(totalDays / completed.length);
  }
}

// Singleton instance
export const remediationService = new RemediationService();

