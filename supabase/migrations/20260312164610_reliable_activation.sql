-- 1. Schema Update: Adicionar telegram_chat_id na tabela de jobs
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- 2. Garantir que a extensão pg_net esteja disponível
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 3. Função para disparar a Edge Function via pg_net (Database Webhook)
CREATE OR REPLACE FUNCTION public.invoke_process_intent_via_pg_net()
RETURNS TRIGGER AS $$
BEGIN
  -- Dispara o POST assíncrono para a Edge Function
  -- Nota: O corpo é oco ou contém o record, mas o worker lê do pgmq.
  -- Usamos a URL interna ou externa. Em edge functions o ideal é a oficial.
  PERFORM
    net.http_post(
      url := 'https://yddgsupelmmxjpvnustg.functions.supabase.co/process-intent',
      headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object('job_id', NEW.id)
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger: Ativação automática ao inserir um Job pendente
CREATE OR REPLACE TRIGGER trigger_activate_worker_on_job_insert
AFTER INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.invoke_process_intent_via_pg_net();

-- 5. Atualizar RPC de push_intent_job para aceitar chat_id (Opcional, mas recomendado)
-- Vamos criar uma versão 2 ou substituir a anterior se possível.
CREATE OR REPLACE FUNCTION public.push_intent_job(p_job_id UUID, p_chat_id BIGINT DEFAULT NULL)
RETURNS BIGINT AS $$
DECLARE
  v_msg_id BIGINT;
BEGIN
  -- Atualiza o chat_id no job caso fornecido
  IF p_chat_id IS NOT NULL THEN
    UPDATE public.jobs SET telegram_chat_id = p_chat_id WHERE id = p_job_id;
  END IF;

  -- Envia para a fila PGMQ
  SELECT * INTO v_msg_id FROM pgmq.send('intent_jobs', jsonb_build_object('job_id', p_job_id));
  
  RETURN v_msg_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
