-- Add telegram_chat_id column to jobs table (Missing from original migration)
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- Create index for faster lookups by telegram_chat_id
CREATE INDEX IF NOT EXISTS idx_jobs_telegram_chat_id ON public.jobs(telegram_chat_id);

-- Comment for documentation
COMMENT ON COLUMN public.jobs.telegram_chat_id IS 'Telegram Chat ID for sending responses back to the user';
