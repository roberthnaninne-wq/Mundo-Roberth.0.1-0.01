# ARQUITETURA DE FILAS E JOBS (QUEUE & JOBS)

## Princípio do Mundo Roberth.0.1
*A Lei 9 diz: Procure Jobs Assíncronos em detrimento de requisições HTTPS blocantes.*

## A Trilha de Documentação
1. **`commands`**: Grava o input bruto (JSON do Telegram).
2. **`jobs`**: Unidade operacional. Agora inclui `telegram_chat_id` para fechamento do rito.
3. **`job_events`**: Auditoria de passos (pending -> running -> completed).

## Evolução Arquitetural: Ativação Industrial (pg_net)

**O Modelo Anterior (Sprint 1.5):**
O Webhook chamava o Consumer via `invoke()`. Embora funcional, dependia que a rede estivesse 100% no exato momento da "passagem de bastão".

**O Modelo Atual (Sprint 1.6 - Ativação via pg_net):**
Implementamos o **Database Webhook Nativo**:
1. O Frontal (`telegram-webhook`) apenas insere o registro na tabela `public.jobs`.
2. Um Trigger de PostgreSQL (`trigger_activate_worker_on_job_insert`) entra em ação.
3. Este trigger usa a extensão **`pg_net`** para disparar um HTTP POST assíncrono para a Edge Function de processamento.
4. **Resiliência**: O banco de dados gerencia a requisição de saída. Se a função estiver em cold-start, o pg_net garante o início do processo sem onerar o tempo de resposta do webhook frontal.

## Fechamento de Rito (Response Loop)
Diferente das fases anteriores onde o usuário ficava apenas com o "Processando...", agora o Worker (`process-intent`) tem autonomia total:
- Ele busca o `telegram_chat_id` diretamente do Job.
- Após o processamento (sucesso ou falha), ele utiliza o Bot API para enviar a **Resposta Final** formatada em Markdown com o resultado do serviço.

## Políticas de Retry
- Se o worker falhar, a mensagem permanece no `pgmq` protegida pelo Visibility Timeout.
- Como o `pg_net` dispara apenas no `INSERT`, retentativas manuais ou via `pg_cron` podem ser necessárias para re-escanear jobs que ficaram "presos" em `pending` sem uma ativação bem-sucedida.
