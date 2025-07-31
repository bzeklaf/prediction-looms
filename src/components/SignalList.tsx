
import { useState } from 'react';
import { SignalCard } from './SignalCard';
import { UnlockModal } from './UnlockModal';
import { AuthModal } from './AuthModal';
import { useSignals, useUnlockedSignals, useUnlockSignal, Signal } from '@/hooks/useSignals';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SignalList = () => {
  const { data: signals, isLoading, error } = useSignals();
  const { data: unlockedSignalIds = [] } = useUnlockedSignals();
  const unlockSignal = useUnlockSignal();
  const { user } = useAuth();
  
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleUnlock = (signalId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const signal = signals?.find(s => s.id === signalId);
    if (signal) {
      setSelectedSignal(signal);
      setShowUnlockModal(true);
    }
  };

  const handleConfirmUnlock = async () => {
    if (!selectedSignal) return;

    await unlockSignal.mutateAsync({
      signalId: selectedSignal.id,
      unlockPrice: selectedSignal.unlock_price,
    });

    setShowUnlockModal(false);
    setSelectedSignal(null);
  };

  const handleView = (signalId: string) => {
    console.log('View signal:', signalId);
    // TODO: Navigate to signal detail page
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4 p-6 rounded-lg border">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load signals. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!signals || signals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No signals available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {signals.map((signal) => {
          const isUnlocked = unlockedSignalIds.includes(signal.id) || signal.creator_id === user?.id;
          const transformedSignal = {
            id: signal.id,
            creator: signal.profiles?.username || 'Anonymous',
            title: signal.title,
            description: signal.description,
            prediction: signal.prediction,
            confidence: signal.confidence,
            stake: signal.stake_amount,
            stakeToken: signal.stake_token,
            resolutionTime: new Date(signal.resolution_time),
            category: signal.category,
            isLocked: signal.is_locked && !isUnlocked,
            unlockPrice: signal.unlock_price,
            alphaScore: signal.profiles?.alpha_score || 50,
            timeHorizon: signal.time_horizon,
            status: signal.status,
            accuracy: signal.resolution_result !== null ? (signal.resolution_result ? 1 : 0) : undefined,
          };

          return (
            <SignalCard
              key={signal.id}
              signal={transformedSignal}
              onUnlock={handleUnlock}
              onView={handleView}
            />
          );
        })}
      </div>

      {selectedSignal && (
        <UnlockModal
          isOpen={showUnlockModal}
          onClose={() => {
            setShowUnlockModal(false);
            setSelectedSignal(null);
          }}
          onConfirm={handleConfirmUnlock}
          signal={{
            id: selectedSignal.id,
            title: selectedSignal.title,
            creator: selectedSignal.creator_id,
            creatorAlpha: selectedSignal.profiles?.alpha_score || 50,
            unlockPrice: selectedSignal.unlock_price,
            confidence: selectedSignal.confidence,
            stake: selectedSignal.stake_amount,
            stakeToken: selectedSignal.stake_token,
            category: selectedSignal.category,
            timeHorizon: selectedSignal.time_horizon,
          }}
          isLoading={unlockSignal.isPending}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
