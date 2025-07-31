import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, DollarSign, TrendingUp, Clock, User } from "lucide-react";
import { AlphaScoreBadge } from "./AlphaScoreBadge";

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  signal: {
    id: string;
    title: string;
    creator: string;
    creatorAlpha: number;
    unlockPrice: number;
    confidence: number;
    stake: number;
    stakeToken: string;
    category: string;
    timeHorizon: string;
  };
  isLoading?: boolean;
}

export const UnlockModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  signal, 
  isLoading = false 
}: UnlockModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  const protocolFee = signal.unlockPrice * 0.1;
  const creatorFee = signal.unlockPrice * 0.9;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Unlock Signal
          </DialogTitle>
          <DialogDescription>
            Purchase access to this premium signal and prediction details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Signal Preview */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h3 className="font-semibold text-foreground mb-2">{signal.title}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{signal.category.toUpperCase()}</Badge>
              <Badge variant="outline" className="text-success">
                {signal.confidence}% confidence
              </Badge>
              <Badge variant="outline">
                {signal.stake} {signal.stakeToken} staked
              </Badge>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Creator:</span>
              <span className="text-sm font-medium text-foreground">
                {signal.creator.slice(0, 6)}...{signal.creator.slice(-4)}
              </span>
            </div>
            <AlphaScoreBadge score={signal.creatorAlpha} />
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-medium">Pricing Breakdown</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signal Access</span>
                <span className="font-medium">${signal.unlockPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>• Protocol Fee (10%)</span>
                <span>${protocolFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>• Creator Fee (90%)</span>
                <span>${creatorFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">${signal.unlockPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <div className="text-sm font-medium text-primary mb-2">You'll get access to:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Complete prediction details and reasoning</li>
              <li>• Creator's analysis and methodology</li>
              <li>• Real-time resolution tracking</li>
              <li>• Historical performance data</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button 
            variant="premium" 
            onClick={handleConfirm} 
            disabled={isConfirming}
            className="min-w-[120px]"
          >
            {isConfirming ? "Processing..." : `Unlock for $${signal.unlockPrice}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};