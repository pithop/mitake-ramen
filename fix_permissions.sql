-- Enable Row Level Security on the orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Enable update for all users" ON orders;

-- Policy to allow anyone (anon and authenticated) to SELECT orders
-- This is necessary for the Realtime subscription to work for the kitchen/delivery dashboards
CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (true);

-- Policy to allow anyone (anon and authenticated) to INSERT orders
-- This is CRITICAL for the client to be able to place an order without being logged in
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);

-- Policy to allow anyone (anon and authenticated) to UPDATE orders
-- This is necessary for the kitchen/delivery/manager to update order status
CREATE POLICY "Enable update for all users" ON orders FOR UPDATE USING (true);
