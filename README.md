# Mundo Roberth.0.1

Bem-vindo ao Mundo Roberth.0.1.
Este é um repositório monorepo soberano, projetado para operar sob regras estritas de arquitetura limpa, independência de front-end, e forte integração assíncrona.

## Visão Geral
O Mundo Roberth não é um simples aplicativo web. É um ecossistema coordenado onde o Telegram atua como portal único de entrada de dados, o Supabase age como soberania de estado (banco, auth e filas), e a interface web serve apenas como um dashboard analítico ("Biblioteca e Palácio de Configurações").

## Primeiros Passos (Onboarding)

### Pré-requisitos
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Deno (para desenvolvimento local das Edge Functions)
- Node.js / pnpm (para o monorepo web/core)

### Iniciando o Ambiente Local
```bash
# Clone o repositório
git clone https://github.com/roberthnaninne-wq/Mundo-Roberth.0.1-0.01.git

# Inicialize o Supabase local conectando às migrações existentes
supabase start

# O Edge Function webhook pode ser testado com
supabase functions serve
```

## Estrutura do Monorepo
- `apps/web`: (Pendente) Interface Next.js para o Dashboard Administrativo.
- `packages/*`: (Pendente) Bibliotecas core e UI da aplicação.
- `supabase/`: Camada da soberania. Contém Auth, PostgreSQL Migrations, Storage config e Edge Functions.
- `scripts/`: Utilitários de DEVOPS e manutenção de filas.
- `docs/`: Leia a Constituição antes de alterar qualquer código.

## Governança
Nenhuma decisão técnica pode violar a Constituição do projeto.
Leia: [Constituição do Mundo Roberth.0.1](docs/constituicao/CONSTITUICAO_MUNDO_ROBERTH_0_1.md).
