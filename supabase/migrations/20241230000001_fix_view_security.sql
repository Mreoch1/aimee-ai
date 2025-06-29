-- Fix Security Definer View Issue
-- This migration removes the problematic view and replaces it with a secure function
-- Views in PostgreSQL default to SECURITY DEFINER which is a security risk

-- Drop the existing view that has SECURITY DEFINER
DROP VIEW IF EXISTS user_dashboard_data;

-- Instead of a view, create a SECURITY INVOKER function that users can call
-- This ensures it runs with the caller's privileges, not elevated privileges
CREATE OR REPLACE FUNCTION get_user_dashboard_data(user_id_param UUID)
RETURNS TABLE (
    id UUID,
    email TEXT,
    phone TEXT,
    full_name TEXT,
    subscription_status TEXT,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    selected_plan TEXT,
    phone_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    message_count BIGINT,
    memory_count BIGINT,
    last_message_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY INVOKER  -- This ensures it runs with caller's privileges
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.phone,
        u.full_name,
        u.subscription_status,
        u.trial_ends_at,
        u.selected_plan,
        u.phone_verified,
        u.created_at,
        COUNT(DISTINCT m.id) as message_count,
        COUNT(DISTINCT mem.id) as memory_count,
        MAX(m.timestamp) as last_message_at
    FROM users u
    LEFT JOIN messages m ON u.phone = m.user_phone
    LEFT JOIN memories mem ON u.phone = mem.user_phone
    WHERE u.id = user_id_param
      AND (
          auth.uid() = u.id OR           -- User can see their own data
          auth.role() = 'service_role'   -- Service role can see all data
      )
    GROUP BY u.id, u.email, u.phone, u.full_name, u.subscription_status, 
             u.trial_ends_at, u.selected_plan, u.phone_verified, u.created_at;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_dashboard_data(UUID) TO authenticated, anon;

-- Add helpful comment
COMMENT ON FUNCTION get_user_dashboard_data(UUID) IS 'Secure function to get user dashboard data with SECURITY INVOKER'; 