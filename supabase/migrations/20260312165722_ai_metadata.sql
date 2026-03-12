-- Adicionar colunas para rastrear o modelo e provedor de IA utilizado no Job
ALTER TABLE public.jobs 
ADD COLUMN ai_model TEXT DEFAULT 'gemini-1.5-flash',
ADD COLUMN ai_provider TEXT DEFAULT 'google';
