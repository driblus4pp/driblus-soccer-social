-- Create table for quick matches
CREATE TABLE public.quick_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('team_sort', 'score_record')),
  team_a JSONB NOT NULL,
  team_b JSONB NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quick_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own quick matches" 
ON public.quick_matches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quick matches" 
ON public.quick_matches 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick matches" 
ON public.quick_matches 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick matches" 
ON public.quick_matches 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quick_matches_updated_at
  BEFORE UPDATE ON public.quick_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to clean old matches (older than 2 months)
CREATE OR REPLACE FUNCTION public.clean_old_quick_matches()
RETURNS void AS $$
BEGIN
  DELETE FROM public.quick_matches 
  WHERE created_at < (now() - interval '2 months');
END;
$$ LANGUAGE plpgsql;

-- Create function to limit matches per user to 3
CREATE OR REPLACE FUNCTION public.limit_quick_matches_per_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete oldest matches if user already has 3 or more
  DELETE FROM public.quick_matches 
  WHERE user_id = NEW.user_id 
  AND id NOT IN (
    SELECT id FROM public.quick_matches 
    WHERE user_id = NEW.user_id 
    ORDER BY created_at DESC 
    LIMIT 2
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to limit matches per user
CREATE TRIGGER limit_user_quick_matches
  AFTER INSERT ON public.quick_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.limit_quick_matches_per_user();