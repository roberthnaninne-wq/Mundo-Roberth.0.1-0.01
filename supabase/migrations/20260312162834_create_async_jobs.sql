-- Habilitar extensão para Webhooks (Acionamento Assíncrono via pg_net)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Tabela 1: COMMANDS (A intenção crua recebida do portal)
CREATE TABLE public.commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    payload JSONB NOT NULL, -- ex: todo o body da mensagem do telegram
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela 2: JOBS (A unidade de trabalho agendada na fila principal)
CREATE TYPE public.job_status AS ENUM ('pending', 'running', 'completed', 'failed');

CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID REFERENCES public.commands(id) ON DELETE CASCADE,
    status public.job_status NOT NULL DEFAULT 'pending',
    result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela 3: JOB_EVENTS (A fita de auditoria rastreável obrigatória)
CREATE TABLE public.job_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    status public.job_status NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rastrear updated_at on jobs
CREATE TRIGGER jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Segurança (RLS Limitado)
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_events ENABLE ROW LEVEL SECURITY;

-- As inserções em jobs/commands serão feitas server-side pelas funções de sistema (service_role).
-- Futuramente, se houver painel público para usuários verem seus comandos, criaremos:
CREATE POLICY "Users view own commands" ON public.commands FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users view own jobs" ON public.jobs FOR SELECT TO authenticated USING (command_id IN (SELECT id FROM public.commands WHERE user_id = auth.uid()));
CREATE POLICY "Users view own job_events" ON public.job_events FOR SELECT TO authenticated USING (job_id IN (SELECT id FROM public.jobs WHERE command_id IN (SELECT id FROM public.commands WHERE user_id = auth.uid())));

-- Triggers de Delegação Assíncrona via pg_net (Supabase Database Webhooks)
-- Quando um JOB entrar pendente, dispare uma chamada POST silenciosa pra Functions.
-- Usaremos uma função PL/pgSQL encapsulando a chamada usando pg_net
CREATE OR REPLACE FUNCTION public.invoke_process_intent_webhook()
RETURNS TRIGGER AS $$
DECLARE
  url TEXT := current_setting('app.settings.process_intent_url', true);
  secret TEXT := current_setting('app.settings.webhook_secret', true);
  payload JSONB;
BEGIN
  -- Cria o payload minimalista apenas com o ID do trabalho
  payload := jsonb_build_object('record', row_to_json(NEW));

  -- Como o ambiente local muda a URL, usaremos o env caso exista, 
  -- caso contrário o código Deno fará pooling ou injetaremos a trigger de prod.
  -- Usaremos a abordagem agnóstica de delegar a própria chamada ao Supabase Dashboard.
  
  -- (Esta base prepara o DB. Na PRD configuramos o Webhook real per console para maior segurança
  -- ou usamos chamadas diretas).
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
