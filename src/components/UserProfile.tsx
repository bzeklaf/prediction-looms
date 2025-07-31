
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AlphaScoreBadge } from './AlphaScoreBadge';
import { Wallet, LogOut } from 'lucide-react';

interface UserProfileProps {
  userAlphaScore?: number;
  userBalance?: number;
  onAuthClick: () => void;
}

export const UserProfile = ({ 
  userAlphaScore = 67, 
  userBalance = 1250, 
  onAuthClick 
}: UserProfileProps) => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={onAuthClick}>
        <Wallet className="w-4 h-4 mr-2" />
        Connect
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-3">
        <AlphaScoreBadge score={userAlphaScore} />
        <div className="flex items-center gap-1 text-sm">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">${userBalance}</span>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        <LogOut className="w-4 h-4" />
        <span className="hidden md:inline ml-2">Sign Out</span>
      </Button>
    </div>
  );
};
