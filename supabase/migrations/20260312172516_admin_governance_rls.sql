-- RLS Policies for Admin Governance (Sprint 5)

-- 1. Enable RLS on all core tables (already enabled on user_profiles, jobs, job_events, tasks)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_events ENABLE ROW LEVEL SECURITY;

-- 2. Define Admin Access (Sovereign Access)
-- Only 'roberth.naninne@gmail.com' can read and update management data

-- TASKS Policies
DROP POLICY IF EXISTS "Allow service role full access" ON public.tasks;
CREATE POLICY "Admin full access to tasks" 
ON public.tasks 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com');

-- JOBS Policies
CREATE POLICY "Admin can read and update jobs" 
ON public.jobs 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com');

-- JOB_EVENTS Policies
CREATE POLICY "Admin can read job_events" 
ON public.job_events 
FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com');

-- 3. Allow anonymous user check session (needed for login/callback flows)
-- This is handled by Supabase default settings, but keeping it in mind.

-- 4. Audit Log for Governance: Update trigger to track completion date?
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.handle_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = now();
  ELSIF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_task_completion_timestamp
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_task_status_change();
