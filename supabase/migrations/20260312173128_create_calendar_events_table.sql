-- Create Calendar Events Table (Sprint 6 - Expansion of Consciousness)
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_from_job_id UUID UNIQUE REFERENCES public.jobs(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    all_day BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'tentative', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Admin Access Policy (Sovereign Access)
CREATE POLICY "Admin full access to calendar_events" 
ON public.calendar_events 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'roberth.naninne@gmail.com');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.calendar_events IS 'Stores scheduled events created by the AI or manually via the dashboard.';
COMMENT ON COLUMN public.calendar_events.created_from_job_id IS 'Idempotency key linking the event to the job that created it.';
