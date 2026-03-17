-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Assign admin role to the specific user
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'leonirgoulart39@gmail.com';

-- Ensure role is updated in case email was only present in auth.users
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE auth.users.id = profiles.id AND auth.users.email = 'leonirgoulart39@gmail.com';

-- Remove Admin.S from the database
DELETE FROM auth.users 
WHERE email = 'admin@sintonia.arte' 
   OR id IN (
       SELECT id 
       FROM public.profiles 
       WHERE full_name = 'Admin S.' 
          OR full_name = 'Admin.S'
   );
