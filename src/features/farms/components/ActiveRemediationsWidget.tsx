import { useState, useEffect, useCallback } from "react";
import { Activity, Clock, FlaskConical, Wrench, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { remediationService } from "@/services/remediationService";
import { RemediationStatus, RemediationRecord } from "@/types/remediation";
import { farms } from "@/services/mockData";

/**
 * Widget displaying active remediation summary and list
 */
export function ActiveRemediationsWidget() {
  const [stats, setStats] = useState(() => remediationService.getStats());
  const [activeRecords, setActiveRecords] = useState<RemediationRecord[]>([]);

  // Subscribe to remediation updates
  useEffect(() => {
    const updateData = () => {
      setStats(remediationService.getStats());
      setActiveRecords(
        remediationService.getAllRecords().filter(
          (r) => r.status !== RemediationStatus.Clean && r.status !== RemediationStatus.None
        )
      );
    };

    // Initial load
    updateData();

    // Subscribe to changes
    const unsubscribe = remediationService.subscribe(updateData);
    return unsubscribe;
  }, []);

  // Get farm names for display
  const getFarmName = useCallback((farmId: string) => {
    const farm = farms.find((f) => f.id === farmId);
    return farm?.name || "Unknown Farm";
  }, []);

  const getFarmCity = useCallback((farmId: string) => {
    const farm = farms.find((f) => f.id === farmId);
    return farm?.city || "";
  }, []);

  // Format date relative to now
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const statusConfig: Record<RemediationStatus, { icon: React.ReactNode; color: string }> = {
    [RemediationStatus.None]: { icon: null, color: "bg-gray-100" },
    [RemediationStatus.Contaminated]: { icon: <Activity className="h-3 w-3" />, color: "bg-red-100 text-red-800" },
    [RemediationStatus.UnderRemediation]: { icon: <Wrench className="h-3 w-3" />, color: "bg-orange-100 text-orange-800" },
    [RemediationStatus.Testing]: { icon: <FlaskConical className="h-3 w-3" />, color: "bg-blue-100 text-blue-800" },
    [RemediationStatus.Clean]: { icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-green-100 text-green-800" },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-orange-500" />
          Active Remediations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats summary - vertical compact rows */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">In Progress</span>
            </div>
            <span className="text-lg font-bold text-orange-700">{stats.underRemediation}</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Testing</span>
            </div>
            <span className="text-lg font-bold text-blue-700">{stats.testing}</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Completed</span>
            </div>
            <span className="text-lg font-bold text-green-700">{stats.completed}</span>
          </div>
        </div>

        {/* Active list */}
        {activeRecords.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">In Progress</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeRecords.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{getFarmName(record.farmId)}</span>
                    <span className="text-xs text-muted-foreground">{getFarmCity(record.farmId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`gap-1 text-xs ${statusConfig[record.status].color}`}>
                      {statusConfig[record.status].icon}
                      {record.status === RemediationStatus.UnderRemediation ? "Remediation" : record.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(record.startedAt)}
                    </div>
                  </div>
                </div>
              ))}
              {activeRecords.length > 5 && (
                <div className="text-xs text-center text-muted-foreground py-1">
                  +{activeRecords.length - 5} more
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active remediations. Start one from a contaminated farm.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
