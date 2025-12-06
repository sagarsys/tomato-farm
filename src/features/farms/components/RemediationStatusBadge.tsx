import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { remediationService } from "@/services/remediationService";
import { RemediationStatus } from "@/types/remediation";
import { useRemediationStatus } from "../hooks/useRemediationStatus";
import { AlertTriangle, CheckCircle, ChevronDown, FlaskConical, Wrench } from "lucide-react";
import toast from "react-hot-toast";

interface RemediationStatusBadgeProps {
  farmId: string;
}

/**
 * Badge showing remediation status with dropdown to progress to next status
 */
export function RemediationStatusBadge({ farmId }: RemediationStatusBadgeProps) {
  const status = useRemediationStatus(farmId);
  /**
   * Handle status change
   */
  const handleStatusChange = (newStatus: RemediationStatus) => {
    const statusLabels: Record<RemediationStatus, string> = {
      [RemediationStatus.None]: "None",
      [RemediationStatus.Contaminated]: "Contaminated",
      [RemediationStatus.UnderRemediation]: "Under Remediation",
      [RemediationStatus.Testing]: "Testing",
      [RemediationStatus.Clean]: "Clean",
    };

    remediationService.updateStatus(
      farmId,
      newStatus,
      `Status changed to ${statusLabels[newStatus]}`,
      "System"
    );
    toast.success(`Status updated to ${statusLabels[newStatus]}`);
  };

  // Status configuration - using shorter labels to fit in table
  const statusConfig: Record<
    RemediationStatus,
    { label: string; shortLabel: string; icon: React.ReactNode; className: string; nextStatuses: RemediationStatus[] }
  > = {
    [RemediationStatus.None]: {
      label: "None",
      shortLabel: "None",
      icon: null,
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      nextStatuses: [],
    },
    [RemediationStatus.Contaminated]: {
      label: "Contaminated",
      shortLabel: "Contaminated",
      icon: <AlertTriangle className="h-3 w-3" />,
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      nextStatuses: [RemediationStatus.UnderRemediation],
    },
    [RemediationStatus.UnderRemediation]: {
      label: "Under Remediation",
      shortLabel: "Remediation",
      icon: <Wrench className="h-3 w-3" />,
      className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      nextStatuses: [RemediationStatus.Testing],
    },
    [RemediationStatus.Testing]: {
      label: "Testing",
      shortLabel: "Testing",
      icon: <FlaskConical className="h-3 w-3" />,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      nextStatuses: [RemediationStatus.Clean, RemediationStatus.UnderRemediation],
    },
    [RemediationStatus.Clean]: {
      label: "Clean",
      shortLabel: "Clean",
      icon: <CheckCircle className="h-3 w-3" />,
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      nextStatuses: [],
    },
  };

  const config = statusConfig[status];
  const hasNextStatuses = config.nextStatuses.length > 0;

  // If no next statuses available, just show a badge
  if (!hasNextStatuses) {
    return (
      <Badge className={`gap-1 text-xs ${config.className}`}>
        {config.icon}
        {config.shortLabel}
      </Badge>
    );
  }

  // Show dropdown with next status options
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.className} hover:opacity-80 cursor-pointer`}
        >
          {config.icon}
          {config.shortLabel}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4} className="z-[100]">
        <DropdownMenuLabel className="text-xs">Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {config.nextStatuses.map((nextStatus) => {
          const nextConfig = statusConfig[nextStatus];
          return (
            <DropdownMenuItem
              key={nextStatus}
              onSelect={() => handleStatusChange(nextStatus)}
              className="gap-2 text-xs cursor-pointer"
            >
              {nextConfig.icon}
              {nextConfig.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

