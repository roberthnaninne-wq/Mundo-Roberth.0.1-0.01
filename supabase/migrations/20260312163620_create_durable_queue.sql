-- Habilitar a extensão oficial de Message Queue (pgmq)
CREATE EXTENSION IF NOT EXISTS pgmq WITH SCHEMA public;

-- Criar a fila durável principal para os jobs de intenções
SELECT pgmq.create('intent_jobs');

-- Adicionar campos de controle e resultado estruturado na tabela `jobs`
ALTER TABLE public.jobs 
ADD COLUMN retry_count INT NOT NULL DEFAULT 0,
ADD COLUMN error_details TEXT;

-- Função (RPC) auxiliar para o Webhook publicar o Job na Fila Durável (pgmq).
-- Ela encapsula o envio para a fila com segurança pelo service_role.
CREATE OR REPLACE FUNCTION public.push_intent_job(p_job_id UUID)
RETURNS BIGINT AS $$
DECLARE
  v_msg_id BIGINT;
BEGIN
  -- Envia a mensagem (o ID do Job) para a fila `intent_jobs`
  -- pgmq.send retorna o message_id gerado na fila
  SELECT * INTO v_msg_id FROM pgmq.send('intent_jobs', jsonb_build_object('job_id', p_job_id));
  
  RETURN v_msg_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
