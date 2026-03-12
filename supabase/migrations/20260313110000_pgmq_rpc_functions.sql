-- PGMQ Queue Management Functions
-- These functions are needed by the process-intent Edge Function

-- Drop existing functions first
DROP FUNCTION IF EXISTS public.pop_intent_job_from_queue(INTEGER);
DROP FUNCTION IF EXISTS public.archive_intent_job(BIGINT);

-- Function to pop a job from the intent_jobs queue
CREATE OR REPLACE FUNCTION public.pop_intent_job_from_queue(lock_seconds INTEGER DEFAULT 30)
RETURNS TABLE(msg_id BIGINT, message JSONB) AS $$
BEGIN
  -- Pop message from the queue with a lock
  RETURN QUERY
  SELECT * FROM pgmq.read('intent_jobs', 1, lock_seconds);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to archive (delete) a processed message
CREATE OR REPLACE FUNCTION public.archive_intent_job(p_msg_id BIGINT)
RETURNS VOID AS $$
BEGIN
  PERFORM pgmq.archive('intent_jobs', p_msg_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.pop_intent_job_from_queue TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_intent_job TO authenticated;
