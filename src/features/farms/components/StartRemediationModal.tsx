import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { remediationService } from "@/services/remediationService";

interface StartRemediationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmId: string;
  farmName: string;
  farmCity: string;
  onSuccess?: (farmId: string) => void; // Callback after successful remediation start
}

/**
 * Modal for starting remediation process on a contaminated farm
 * Allows setting priority, assignee, target date, and initial notes
 */
export function StartRemediationModal({
  open,
  onOpenChange,
  farmId,
  farmName,
  farmCity,
  onSuccess,
}: StartRemediationModalProps) {
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [targetDate, setTargetDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Simulate API delay for realistic UX
   */
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      toast.error("Please add notes about the remediation plan");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay (800ms)
      await delay(800);

      // Start remediation
      remediationService.startRemediation({
        farmId,
        assignedTo: assignedTo || undefined,
        notes: notes.trim(),
        priority,
        targetCompletionDate: targetDate,
      });

      toast.success(`Remediation started for ${farmName}`);
      
      // Reset form
      handleReset();
      onOpenChange(false);

      // Notify parent to update UI state (no reload needed!)
      onSuccess?.(farmId);
    } catch (error) {
      toast.error("Failed to start remediation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPriority("medium");
    setAssignedTo("");
    setNotes("");
    setTargetDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Start Remediation
          </DialogTitle>
          <DialogDescription>
            Initiate cleanup process for {farmName} ({farmCity})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor contamination</SelectItem>
                <SelectItem value="medium">Medium - Moderate risk</SelectItem>
                <SelectItem value="high">High - Significant risk</SelectItem>
                <SelectItem value="critical">Critical - Immediate action required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              placeholder="Enter name or team"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          {/* Target Completion Date */}
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Completion Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Remediation Plan & Notes *</Label>
            <Textarea
              id="notes"
              placeholder="Describe the remediation plan, actions to be taken, expected timeline..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters required
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Remediation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

