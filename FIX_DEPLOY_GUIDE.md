# 🚀 Guia de Deploy - Mundo Roberth.0.1

## Problema Identificado

O sistema tinha um problema crítico: **o trigger via pg_net não estava funcionando**, então os Jobs eram criados mas nunca eram processados pela Edge Function `process-intent`.

### O que foi corrigido:

1. **telegram-webhook**: Agora chama diretamente a Edge Function `process-intent` após criar o job (em vez de depender do trigger)
2. **process-intent**: Agora aceita o `job_id` diretamente do corpo da requisição (fallback para fila PGMQ)

## Status Atual

### ✅ Deployado:
- Edge Function `telegram-webhook`
- Edge Function `process-intent`

### ⚠️ Pendente:
- Dashboard Web (Vercel)

---

## Próximos Passos

### 1. Reconectar o Vercel (Dashboard)

O deploy anterior não existe mais (erro 404). Você precisa reconectar:

1. Acesse: https://vercel.com/
2. Delete o projeto antigo se existir
3. Importe o repositório GitHub: `roberthnaninne-wq/Mundo-Roberth.0.1-0.01`
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://yddgsupelmmxjpvnustg.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_secret_lVmziZHLfVegx9hjuhe6rA_bBDSRovp`
5. Framework Preset: **Next.js**
6. Build Command: `pnpm build` ou `npm run build`

### 2. Testar o Telegram

Após o deploy do dashboard, teste novamente:
- Envie uma mensagem para o bot: `/start` ou "Olá"
- O bot deve responder com a mensagem de confirmação E depois com a resposta da IA

---

## URLs do Sistema

| Serviço | URL |
|---------|-----|
| **Telegram Webhook** | https://yddgsupelmmxjpvnustg.supabase.co/functions/v1/telegram-webhook |
| **Process Intent** | https://yddgsupelmmxjpvnustg.supabase.co/functions/v1/process-intent |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/yddgsupelmmxjpvnustg |

---

## Como Testar

1. Envie uma mensagem no Telegram para o bot
2. Você deve receber DUAS respostas:
   - Primeira: "Sua mensagem foi recebida! Vou processá-la agora. 🤖"
   - Segunda: A resposta da IA do Mundo Roberth.0.1
3. Acesse o dashboard para ver os Jobs/Tarefas/Eventos criados
