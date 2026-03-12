-- O pgmq nativamente interage através da schema pgmq. No entanto, PostgREST 
-- (a API Data do Supabase via client-js) pode não ter acesso direto a pgmq.read
-- Para que o Deno Edge Function possa extrair os itens com facilidade através do `rpc()`,
-- criamos wrappers que operam sob SECURITY DEFINER.

-- 1. Ler da Fila Durável
CREATE OR REPLACE FUNCTION public.pop_intent_job_from_queue(lock_seconds INT DEFAULT 30)
RETURNS TABLE (
   msg_id BIGINT,
   read_ct INT,
   enqueued_at TIMESTAMPTZ,
   vt TIMESTAMPTZ,
   message JSONB
) AS $$
BEGIN
   -- Usamos pgmq.read(queue_name, visibility_timeout_in_sec, qty_max_msgs)
   RETURN QUERY SELECT * FROM pgmq.read('intent_jobs', lock_seconds, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Arquivar (ACK) da Fila
CREATE OR REPLACE FUNCTION public.archive_intent_job(p_msg_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
   success BOOLEAN;
BEGIN
   -- Move a mensagem para tabela de arquivo histórico da própria extensão
   SELECT pgmq.archive('intent_jobs', p_msg_id) INTO success;
   RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
