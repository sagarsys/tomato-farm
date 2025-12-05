import { ArrowRight } from "lucide-react";

interface FlowArrowProps {
  label: string;
  sublabel?: string;
  isContaminated?: boolean;
}

/**
 * Arrow component connecting supply chain flow stages
 * Shows order count and optional contamination indicator
 */
export const FlowArrow = ({
  label,
  sublabel,
  isContaminated = false,
}: FlowArrowProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 min-w-[120px]">
      <div className="flex items-center">
        <div className="h-0.5 w-8 bg-border"></div>
        <div
          className={`mx-2 p-2 rounded-full ${
            isContaminated
              ? "bg-red-100 text-red-600"
              : "bg-primary/10 text-primary"
          }`}
        >
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="h-0.5 w-8 bg-border"></div>
      </div>
      <div className="text-center mt-2">
        <p
          className={`text-sm font-semibold ${
            isContaminated ? "text-red-600" : "text-foreground"
          }`}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </div>
    </div>
  );
};

