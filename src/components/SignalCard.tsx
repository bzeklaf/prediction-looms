
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, DollarSign, Lock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  creator: string;
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  stake: number;
  stakeToken: string;
  resolutionTime: Date;
  category: "crypto" | "macro" | "rwa";
  isLocked: boolean;
  unlockPrice: number;
  alphaScore: number;
  timeHorizon: string;
  status: "active" | "resolved" | "cancelled";
  accuracy?: number;
}

interface SignalCardProps {
  signal: Signal;
  onUnlock?: (signalId: string) => void;
  onView?: (signalId: string) => void;
  className?: string;
}

export const SignalCard = ({ signal, onUnlock, onView, className }: SignalCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crypto": return "bg-primary text-primary-foreground";
      case "macro": return "bg-warning text-warning-foreground";
      case "rwa": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/20 text-success border-success/30";
      case "resolved": return "bg-muted/20 text-muted-foreground border-muted/30";
      case "cancelled": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "Expired";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-300 hover:shadow-glow border-border/50 bg-card/80 backdrop-blur-glass",
      signal.status === "resolved" && signal.accuracy && signal.accuracy > 0.8 && "border-success/30",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(signal.category)}>
                {signal.category.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getStatusColor(signal.status)}>
                {signal.status}
              </Badge>
              {signal.accuracy && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  {Math.round(signal.accuracy * 100)}% accurate
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {signal.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {signal.description}
            </p>
          </div>
          {signal.isLocked && (
            <Lock className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">Prediction:</div>
          <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded border">
            {signal.prediction}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              Confidence
            </div>
            <div className={cn("font-semibold", getConfidenceColor(signal.confidence))}>
              {signal.confidence}%
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              Stake
            </div>
            <div className="font-semibold text-foreground">
              {signal.stake} {signal.stakeToken}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              Time Left
            </div>
            <div className="font-semibold text-foreground">
              {formatTimeRemaining(signal.resolutionTime)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              Alpha Score
            </div>
            <div className="font-semibold text-primary">
              {signal.alphaScore}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {signal.isLocked ? (
            <Button 
              variant="premium" 
              className="flex-1"
              onClick={() => onUnlock?.(signal.id)}
            >
              Unlock for ${signal.unlockPrice}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onView?.(signal.id)}
            >
              View Signal
            </Button>
          )}
          <Button variant="ghost" size="sm">
            Creator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
