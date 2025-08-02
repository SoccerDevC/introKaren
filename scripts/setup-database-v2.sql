-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the pledges table with better error handling
CREATE TABLE IF NOT EXISTS public.pledges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  message TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view pledges" ON public.pledges;
DROP POLICY IF EXISTS "Anyone can insert pledges" ON public.pledges;

-- Create policies for public access
CREATE POLICY "Anyone can view pledges" ON public.pledges
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert pledges" ON public.pledges
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for pledge photos (if needed later)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pledge-photos', 'pledge-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DO $$ 
BEGIN
  -- Check if policies exist before creating them
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can upload pledge photos'
  ) THEN
    CREATE POLICY "Anyone can upload pledge photos" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'pledge-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view pledge photos'
  ) THEN
    CREATE POLICY "Anyone can view pledge photos" ON storage.objects
      FOR SELECT USING (bucket_id = 'pledge-photos');
  END IF;
END $$;

-- Insert sample data (only if table is empty)
INSERT INTO public.pledges (name, amount, message) 
SELECT * FROM (VALUES
  ('Sarah & Michael', 50000, 'Wishing you both endless love and happiness! 💕'),
  ('The Johnson Family', 100000, 'May your love story be as beautiful as today! 🌹'),
  ('Grace & David', 75000, 'Congratulations on this special day! ✨'),
  ('Auntie Rose', 200000, 'Karen, you are a blessing to our family! 👑'),
  ('Best Friends Forever', 150000, 'We love you so much Karen! Can''t wait to celebrate! 💖')
) AS sample_data(name, amount, message)
WHERE NOT EXISTS (SELECT 1 FROM public.pledges);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_pledges_created_at ON public.pledges(created_at DESC);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.pledges TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
