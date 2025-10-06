-- Create quick_matches table for storing match data
CREATE TABLE public.quick_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('team_sort', 'score_record')),
  team_a JSONB NOT NULL,
  team_b JSONB NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration INTEGER, -- em minutos
  location TEXT,
  notes TEXT,
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
CREATE OR REPLACE FUNCTION public.update_quick_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quick_matches_updated_at
BEFORE UPDATE ON public.quick_matches
FOR EACH ROW
EXECUTE FUNCTION public.update_quick_matches_updated_at();