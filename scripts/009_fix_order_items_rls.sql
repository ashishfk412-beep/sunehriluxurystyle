-- Fix RLS policies for order_items to allow INSERT

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;

-- Recreate SELECT policy
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Add INSERT policy to allow users to create order items for their own orders
CREATE POLICY "Users can insert order items for their orders" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Add UPDATE policy for admin purposes (optional)
CREATE POLICY "Users can update order items for their orders" ON order_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Add DELETE policy for admin purposes (optional)
CREATE POLICY "Users can delete order items for their orders" ON order_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
