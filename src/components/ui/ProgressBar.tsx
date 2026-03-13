import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  total?: number;
  className?: string;
  height?: number;
  color?: "primary" | "warning" | "danger" | "success";
  showLabel?: boolean;
}

export const ProgressBar = ({
  value,
  total = 100,
  className,
  height = 8,
  color = "primary",
  showLabel = false,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / total) * 100, 0), 100);

  const colorClasses = {
    primary: "bg-primary",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    success: "bg-green-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="w-full bg-secondary rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-sm", colorClasses[color])}
        />
      </div>
    </div>
  );
};
