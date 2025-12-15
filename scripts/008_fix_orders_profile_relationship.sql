-- The orders table references auth.users(id) but we need to join with profiles
-- Since profiles.id also references auth.users(id), we need to ensure the relationship exists

-- First, ensure all users have profiles (this should already be handled by triggers)
-- But we'll add any missing ones just in case
INSERT INTO profiles (id, full_name, is_admin, created_at, updated_at)
SELECT id, email, false, NOW(), NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Now we need to handle the foreign key properly
-- The issue is that orders.user_id references auth.users(id), not profiles(id)
-- But PostgREST needs a direct relationship to join tables

-- Drop the old foreign key constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add a new foreign key that references profiles instead
-- This works because profiles.id is a foreign key to auth.users(id) 
-- So the relationship is transitive
ALTER TABLE orders 
  ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Do the same for cart_items
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE cart_items 
  ADD CONSTRAINT cart_items_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- And wishlist
ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey;
ALTER TABLE wishlist 
  ADD CONSTRAINT wishlist_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;
