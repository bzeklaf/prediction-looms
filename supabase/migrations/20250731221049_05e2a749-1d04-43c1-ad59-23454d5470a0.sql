
-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  bio text,
  avatar_url text,
  alpha_score integer DEFAULT 50,
  total_signals integer DEFAULT 0,
  accuracy_rate decimal(5,4) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create signals table
CREATE TABLE public.signals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  prediction text NOT NULL,
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  stake_amount decimal(10,2) NOT NULL,
  stake_token text NOT NULL DEFAULT 'USDC',
  category text NOT NULL CHECK (category IN ('crypto', 'macro', 'rwa')),
  time_horizon text NOT NULL,
  resolution_time timestamp with time zone NOT NULL,
  is_locked boolean DEFAULT true,
  unlock_price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  resolution_result boolean,
  resolution_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create signal unlocks table (track who unlocked which signals)
CREATE TABLE public.signal_unlocks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES public.signals ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  unlock_price decimal(10,2) NOT NULL,
  unlocked_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(signal_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_unlocks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Signals policies
CREATE POLICY "All signals are viewable by everyone" 
  ON public.signals FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own signals" 
  ON public.signals FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own signals" 
  ON public.signals FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Signal unlocks policies
CREATE POLICY "Users can view their own unlocks" 
  ON public.signal_unlocks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create unlock records" 
  ON public.signal_unlocks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update alpha scores (called when signals are resolved)
CREATE OR REPLACE FUNCTION public.update_user_alpha_score(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
DECLARE
  total_resolved integer;
  correct_predictions integer;
  new_accuracy decimal(5,4);
  new_alpha_score integer;
BEGIN
  -- Count total resolved signals for user
  SELECT COUNT(*) INTO total_resolved
  FROM public.signals
  WHERE creator_id = user_uuid AND status = 'resolved';
  
  -- Count correct predictions
  SELECT COUNT(*) INTO correct_predictions
  FROM public.signals
  WHERE creator_id = user_uuid AND status = 'resolved' AND resolution_result = true;
  
  -- Calculate accuracy rate
  IF total_resolved > 0 THEN
    new_accuracy := correct_predictions::decimal / total_resolved::decimal;
  ELSE
    new_accuracy := 0;
  END IF;
  
  -- Calculate alpha score (base 50 + accuracy bonus + volume bonus)
  new_alpha_score := 50 + (new_accuracy * 40)::integer + LEAST(total_resolved, 10);
  new_alpha_score := GREATEST(0, LEAST(100, new_alpha_score));
  
  -- Update profile
  UPDATE public.profiles
  SET 
    total_signals = total_resolved,
    accuracy_rate = new_accuracy,
    alpha_score = new_alpha_score,
    updated_at = now()
  WHERE id = user_uuid;
END;
$$;
