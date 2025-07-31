import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlphaScoreBadgeProps {
  score: number;
  accuracy?: number;
  totalSignals?: number;
  className?: string;
  showDetails?: boolean;
}

export const AlphaScoreBadge = ({ 
  score, 
  accuracy, 
  totalSignals, 
  className, 
  showDetails = false 
}: AlphaScoreBadgeProps) => {
  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: "legendary", color: "bg-gradient-premium", icon: Award };
    if (score >= 75) return { level: "expert", color: "bg-gradient-alpha", icon: Star };
    if (score >= 60) return { level: "skilled", color: "bg-success", icon: TrendingUp };
    if (score >= 40) return { level: "novice", color: "bg-warning", icon: TrendingUp };
    return { level: "learning", color: "bg-muted", icon: TrendingDown };
  };

  const { level, color, icon: Icon } = getScoreLevel(score);

  if (showDetails) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <Badge className={cn(color, "text-foreground font-semibold px-3 py-1")}>
            <Icon className="w-3 h-3 mr-1" />
            {score} Alpha Score
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {level}
          </span>
        </div>
        
        {(accuracy !== undefined || totalSignals !== undefined) && (
          <div className="text-xs text-muted-foreground space-y-1">
            {accuracy !== undefined && (
              <div>Accuracy: {Math.round(accuracy * 100)}%</div>
            )}
            {totalSignals !== undefined && (
              <div>Total Signals: {totalSignals}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Badge className={cn(color, "text-foreground font-semibold", className)}>
      <Icon className="w-3 h-3 mr-1" />
      {score}
    </Badge>
  );
};