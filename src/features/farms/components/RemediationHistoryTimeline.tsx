import { useState, useEffect } from "react";
import { History, Wrench, FlaskConical, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { remediationService } from "@/services/remediationService";
import { RemediationStatus, RemediationHistoryEntry } from "@/types/remediation";
import { farms } from "@/services/mockData";

interface RemediationHistoryTimelineProps {
  farmId?: string; // If provided, shows history for specific farm; otherwise shows all
  maxItems?: number;
}

/**
 * Timeline showing remediation history entries with status updates
 */
export function RemediationHistoryTimeline({ farmId, maxItems = 10 }: RemediationHistoryTimelineProps) {
  const [displayEntries, setDisplayEntries] = useState<Array<RemediationHistoryEntry & { farmId: string; farmName: string }>>([]);

  // Get farm name for display
  const getFarmName = (id: string) => {
    const farm = farms.find((f) => f.id === id);
    return farm?.name || "Unknown Farm";
  };

  // Subscribe to remediation updates
  useEffect(() => {
    const updateData = () => {
      const allRecords = remediationService.getAllRecords();
      const filteredRecords = farmId
        ? allRecords.filter((r) => r.farmId === farmId)
        : allRecords;

      // Collect all history entries with farm context
      const historyEntries: Array<RemediationHistoryEntry & { farmId: string; farmName: string }> = [];

      filteredRecords.forEach((record) => {
        record.history.forEach((entry) => {
          historyEntries.push({
            ...entry,
            farmId: record.farmId,
            farmName: getFarmName(record.farmId),
          });
        });
      });

      // Sort by timestamp descending and limit
      historyEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setDisplayEntries(historyEntries.slice(0, maxItems));
    };

    // Initial load
    updateData();

    // Subscribe to changes
    const unsubscribe = remediationService.subscribe(updateData);
    return unsubscribe;
  }, [farmId, maxItems]);

  // Format timestamp
  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status icon and color config
  const statusConfig: Record<RemediationStatus, { icon: React.ReactNode; bgColor: string; borderColor: string }> = {
    [RemediationStatus.None]: {
      icon: <AlertTriangle className="h-4 w-4 text-gray-500" />,
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    },
    [RemediationStatus.Contaminated]: {
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      bgColor: "bg-red-100",
      borderColor: "border-red-400",
    },
    [RemediationStatus.UnderRemediation]: {
      icon: <Wrench className="h-4 w-4 text-orange-600" />,
      bgColor: "bg-orange-100",
      borderColor: "border-orange-400",
    },
    [RemediationStatus.Testing]: {
      icon: <FlaskConical className="h-4 w-4 text-blue-600" />,
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
    },
    [RemediationStatus.Clean]: {
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-blue-500" />
          {farmId ? "Remediation History" : "Recent Activity"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No remediation activity yet.
          </p>
        ) : (
        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />

          {/* Timeline entries */}
          <div className="space-y-4">
            {displayEntries.map((entry, idx) => {
              const config = statusConfig[entry.status];
              return (
                <div key={`${entry.farmId}-${idx}`} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.bgColor} ${config.borderColor}`}
                  >
                    {config.icon}
                  </div>

                  {/* Entry content */}
                  <div className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{entry.farmName}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    </div>
                    {entry.updatedBy && (
                      <p className="text-xs text-muted-foreground mt-1">by {entry.updatedBy}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
