-- Hardening RLS Governance (Sprint 7.5)
-- Purpose: Remove hardcoded emails from policies and centralize admin logic.

-- 1. Create a helper function to check if the user is the administrator
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Centralized administrator email (Sovereign of the Kingdom)
  RETURN (auth.jwt() ->> 'email') = 'roberth.naninne@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION auth.is_admin IS 'Returns true if the authenticated user matches the administrative email.';

-- 2. Refactor TASKS policies
DROP POLICY IF EXISTS "Admin full access to tasks" ON public.tasks;
CREATE POLICY "Admin full access to tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

-- 3. Refactor JOBS policies
DROP POLICY IF EXISTS "Admin can read and update jobs" ON public.jobs;
CREATE POLICY "Admin can read and update jobs"
ON public.jobs
FOR ALL
TO authenticated
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

-- 4. Refactor CALENDAR_EVENTS policies
DROP POLICY IF EXISTS "Admin full access to calendar_events" ON public.calendar_events;
CREATE POLICY "Admin full access to calendar_events"
ON public.calendar_events
FOR ALL
TO authenticated
USING (auth.is_admin())
WITH CHECK (auth.is_admin());

-- 5. Data Hygiene: Ensure no other policies exist that might expose data
-- (Manual audit of other tables like job_events might be needed, but they follow job_id cascade)

COMMENT ON TABLE public.tasks IS 'Kingdom tasks - Protected by auth.is_admin()';
COMMENT ON TABLE public.jobs IS 'Async execution jobs - Protected by auth.is_admin()';
COMMENT ON TABLE public.calendar_events IS 'Scheduled events - Protected by auth.is_admin()';
