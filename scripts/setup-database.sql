-- Create the pledges table
CREATE TABLE IF NOT EXISTS pledges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read pledges
CREATE POLICY "Anyone can view pledges" ON pledges
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert pledges
CREATE POLICY "Anyone can insert pledges" ON pledges
  FOR INSERT WITH CHECK (true);

-- Insert some sample data
INSERT INTO pledges (name, amount, message) VALUES
  ('Sarah & Michael', 50000, 'Wishing you both endless love and happiness! 💕'),
  ('The Johnson Family', 100000, 'May your love story be as beautiful as today! 🌹'),
  ('Grace & David', 50000, 'Congratulations on this special day! ✨');
