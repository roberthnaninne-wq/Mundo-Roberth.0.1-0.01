# SPRINT 1: Reconciliação do Telegram com Filas e Jobs

## Contexto do Próximo Ciclo (O que será feito)
O Mundo Roberth.0.1 tem o seu portal de entrada operante (o webhook do Telegram captura o `user_profile`). Contudo, atualmente, a `telegram-webhook` edge function só realiza o UPSERT e devolve o ok.

O próximo passo lógico sob as nossas leias constitucionais é transitar desse processamento síncrono para o assíncrono. Queremos que a mensagem inteira de "prompt" ou "comando" não seja inferida ali dentro da recepção do webhook. Ela precisa virar um Job.

## Objetivos da Sprint 1
1. **Configuração da Queue:** Ativar pg_cron e estabelecer a extensão pgmq (Message Queue) no banco Supabase.
2. **Nova Entidade (Postgres):** Criar `job_events` e as tabelas subjacentes para auditar todas as ações geradas na rede.
3. **Refatoração Estratégica:** A Edge Function `telegram-webhook` passará a validar o usuário (`user_profiles`) e, imediatamente, inserir a mensagem de input na Fila, liberando a conexão HTTP do Telegram. Ela devolverá "ok" ou "processando".
4. **Edge Function Process-Intent:** Criar o *Worker* que drena essa fila, interpreta a intenção (via IA/Antigravity) e decide os fluxos.

## Critério de Sucesso
- Nenhuma mensagem recebida via Telegram deve falhar por timeout no webhook.
- O banco de dados (PGMQ) deve registrar as intenções recebidas de forma persistente.
- A arquitetura ganha tração para processamento infinito e escalável.
