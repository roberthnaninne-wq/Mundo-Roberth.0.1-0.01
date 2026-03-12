# 🚀 Guia de Deploy - Mundo Roberth.0.1

Este guia fornece instruções passo a passo para colocar o Mundo Roberth.0.1 para funcionar.

---

## Credenciais Fornecidas

### Supabase
- **URL**: `https://yddgsupelmmxjpvnustg.supabase.co`
- **Anon Key**: `sb_publishable_Yji31tbxEri0ow4NshASQw_FkuO7Ds6`
- **Service Role Key**: `sb_secret_lVmziZHLfVegx9hjuhe6rA_bBDSRovp`
- **Senha DB**: `Villa667.@Villa`

### Telegram
- **Bot**: `@MundoRoberth_bot`
- **Token**: `8486462185:AAFsuiEwOQUj_-FbdPFauSwAgkyyrstg6qI`

### OpenAI
- **API Key**: `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`

---

## Passo 1: Configurar o Banco de Dados

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto `roberth.naninne@gmail's Project`
3. Vá em **SQL Editor** e execute:

```sql
-- Adicionar coluna telegram_chat_id na tabela jobs
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_jobs_telegram_chat_id ON public.jobs(telegram_chat_id);

COMMENT ON COLUMN public.jobs.telegram_chat_id IS 'Telegram Chat ID for sending responses back to the user';
```

---

## Passo 2: Deploy das Edge Functions

### Opção A: Via Supabase CLI (Recomendado)

1. Instale o Supabase CLI:
```bash
npm install -g supabase
```

2. Faça login:
```bash
supabase login
```

3. Link ao projeto:
```bash
cd Mundo-Roberth.0.1-0.01
supabase link --project-ref yddgsupelmmxjpvnustg
```

4. Deploy das funções:
```bash
supabase functions deploy telegram-webhook
supabase functions deploy process-intent
```

5. Configure as variáveis de ambiente:
```bash
supabase secrets set MY_SUPABASE_URL=https://yddgsupelmmxjpvnustg.supabase.co
supabase secrets set MY_SUPABASE_SERVICE_ROLE_KEY=sb_secret_lVmziZHLfVegx9hjuhe6rA_bBDSRovp
supabase secrets set TELEGRAM_BOT_TOKEN=8486462185:AAFsuiEwOQUj_-FbdPFauSwAgkyyrstg6qI
supabase secrets set OPENAI_API_KEY=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
supabase secrets set WORLD_TIMEZONE=America/Sao_Paulo
```

### Opção B: Via Dashboard

1. Vá em **Edge Functions** no menu do Supabase
2. Crie duas funções:
   - `telegram-webhook` (use o código de `supabase/functions/telegram-webhook/index.ts`)
   - `process-intent` (use o código de `supabase/functions/process-intent/index.ts`)
3. Configure as variáveis de ambiente em cada função

---

## Passo 3: Configurar Webhook do Telegram

1. No Telegram, fale com @BotFather
2. Use o comando `/setwebhook`
3. Forneça a URL:
```
https://yddgsupelmmxjpvnustg.supabase.co/functions/v1/telegram-webhook
```

Ou use a API diretamente:
```
https://api.telegram.org/bot8486462185:AAFsuiEwOQUj_-FbdPFauSwAgkyyrstg6qI/setWebhook?url=https://yddgsupelmmxjpvnustg.supabase.co/functions/v1/telegram-webhook
```

---

## Passo 4: Deploy da Web App (Dashboard)

### Opção A: Vercel (Recomendado)

1. Crie uma conta em [Vercel](https://vercel.com)
2. Importe o repositório GitHub
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://yddgsupelmmxjpvnustg.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_Yji31tbxEri0ow4NshASQw_FkuO7Ds6`
4. Deploy automático

### Opção B: Netlify

1. Crie uma conta em [Netlify](https://netlify.com)
2. Arraste a pasta `apps/web` para deploy
3. Configure as variáveis de ambiente

---

## Como Testar

1. Envie uma mensagem para o bot @MundoRoberth_bot no Telegram:
   - "Criar tarefa: Comprar leite"
   - "Agendar reunião amanhã às 14h"
   - "Lembrar de ligar para João"

2. O bot deve responder confirmando o recebimento

3. Acesse o dashboard web para ver as tarefas e eventos criados

---

## Estrutura do Projeto

```
Mundo-Roberth.0.1-0.01/
├── apps/web/              # Dashboard Next.js
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── telegram-webhook/
│   │   └── process-intent/
│   └── migrations/        # Schema do banco
├── DOCUMENTO_DO_MUNDO.md  # Documentação completa
└── README.md
```

---

## Solução de Problemas

### Edge Function não responde
- Verifique se o webhook está configurado corretamente
- Verifique os logs da Edge Function no Supabase Dashboard

### AI não responde
- Verifique se a OPENAI_API_KEY está configurada
- Verifique se há créditos na conta OpenAI

### Banco de dados não cria registros
- Execute as migrações SQL no SQL Editor
- Verifique se as tabelas foram criadas

---

## Próximos Passos

Após o deploy funcionar, você pode:
1. Adicionar mais funcionalidades ao bot
2. Customizar as respostas da IA
3. Adicionar novos tipos de ações
4. Configurar notificações por email

---

*Guia elaborado em 13 de março de 2026*
