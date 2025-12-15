-- Create default admin user with specific credentials
-- Email: admin@sunehriluxurystyle.com
-- Password: sunehriluxurystyle@123
-- Name: sunehriluxurystyle

-- Update the trigger to check for the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
  should_be_admin BOOLEAN := false;
BEGIN
  -- Count existing profiles
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Make first user admin OR specific admin email an admin
  IF user_count = 0 THEN
    should_be_admin := true;
  ELSIF NEW.email = 'admin@sunehriluxurystyle.com' THEN
    should_be_admin := true;
  END IF;
  
  -- Insert profile with admin status if applicable
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.email = 'admin@sunehriluxurystyle.com' THEN 'sunehriluxurystyle'
      ELSE COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    END,
    should_be_admin
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
