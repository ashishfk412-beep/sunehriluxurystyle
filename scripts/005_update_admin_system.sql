-- Update admin system to work with any first user or specific email

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS set_admin_trigger ON profiles;
DROP FUNCTION IF EXISTS set_admin_user();

-- Make sure is_admin column exists and has default false
ALTER TABLE profiles ALTER COLUMN is_admin SET DEFAULT false;

-- Update existing users: make any user with admin email an admin
UPDATE profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@elegantthreads.com'
);

-- If no admin exists, make the first user an admin
DO $$
DECLARE
  admin_count INTEGER;
  first_user_id UUID;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE is_admin = true;
  
  IF admin_count = 0 THEN
    SELECT id INTO first_user_id FROM profiles ORDER BY created_at LIMIT 1;
    IF first_user_id IS NOT NULL THEN
      UPDATE profiles SET is_admin = true WHERE id = first_user_id;
    END IF;
  END IF;
END $$;
