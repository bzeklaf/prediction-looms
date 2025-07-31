import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Signal {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  stake_amount: number;
  stake_token: string;
  category: 'crypto' | 'macro' | 'rwa';
  time_horizon: string;
  resolution_time: string;
  is_locked: boolean;
  unlock_price: number;
  status: 'active' | 'resolved' | 'cancelled';
  resolution_result?: boolean;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    alpha_score: number;
  };
}

export interface CreateSignalData {
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  stake_amount: number;
  stake_token: string;
  category: 'crypto' | 'macro' | 'rwa';
  time_horizon: string;
  resolution_time: string;
  unlock_price: number;
}

export const useSignals = () => {
  return useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signals')
        .select(`
          *,
          profiles!creator_id (
            username,
            alpha_score
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Signal[];
    },
  });
};

export const useCreateSignal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (signalData: CreateSignalData) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('signals')
        .insert([
          {
            ...signalData,
            creator_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
      toast.success('Signal created successfully!');
    },
    onError: (error) => {
      console.error('Error creating signal:', error);
      toast.error('Failed to create signal');
    },
  });
};

export const useUnlockSignal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ signalId, unlockPrice }: { signalId: string; unlockPrice: number }) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('signal_unlocks')
        .insert([
          {
            signal_id: signalId,
            user_id: user.id,
            unlock_price: unlockPrice,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signals'] });
      queryClient.invalidateQueries({ queryKey: ['unlocked-signals'] });
      toast.success('Signal unlocked successfully!');
    },
    onError: (error) => {
      console.error('Error unlocking signal:', error);
      toast.error('Failed to unlock signal');
    },
  });
};

export const useUnlockedSignals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['unlocked-signals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('signal_unlocks')
        .select('signal_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(unlock => unlock.signal_id);
    },
    enabled: !!user,
  });
};
