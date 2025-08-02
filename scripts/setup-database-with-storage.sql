-- Create the pledges table with photo support
CREATE TABLE IF NOT EXISTS pledges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view pledges" ON pledges
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert pledges" ON pledges
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for pledge photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pledge-photos', 'pledge-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for pledge photos
CREATE POLICY "Anyone can upload pledge photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pledge-photos');

CREATE POLICY "Anyone can view pledge photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'pledge-photos');

-- Insert sample data
INSERT INTO pledges (name, amount, message) VALUES
  ('Sarah & Michael', 50000, 'Wishing you both endless love and happiness! 💕'),
  ('The Johnson Family', 100000, 'May your love story be as beautiful as today! 🌹'),
  ('Grace & David', 50000, 'Congratulations on this special day! ✨')
ON CONFLICT DO NOTHING;
