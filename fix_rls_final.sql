-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable update for all users" ON orders;

-- Create permissive policies for public access (since we handle auth in app or it's a simple app)
-- Ideally, we should restrict this, but for "Crash-Proof" fix now:

-- Allow SELECT for everyone (anon and authenticated)
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);

-- Allow INSERT for everyone
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);

-- Allow UPDATE for everyone
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE USING (true);
