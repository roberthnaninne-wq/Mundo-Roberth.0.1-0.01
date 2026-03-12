# GOVERNANÇA WEB E AUTENTICAÇÃO SEGURA

## Visão Geral
Este documento detalha o endurecimento da segurança e a introdução de ferramentas de governo na interface web (`apps/web`) do Mundo Roberth.0.1. Transicionamos de um modelo de acesso livre com chave privilegiada para um modelo de **Autenticação Soberana**.

## Estratégia de Autenticação (SSR)
Implementamos o padrão oficial de **Server-Side Rendering (SSR)** do Supabase para Next.js:
- **Cookies**: A sessão é gerida inteiramente via cookies seguros.
- **Middleware**: Todas as rotas (exceto login/auth) são protegidas. Se não houver sessão, o usuário é redirecionado para o login.
- **Allowlist Administrativa**: O acesso ao dashboard é restrito ao email cadastrado como administrador (`roberth.naninne@gmail.com`). Qualquer outro usuário autenticado não verá dados devido às políticas de RLS.

## Componentes de Infraestrutura
1. **`src/utils/supabase/server.ts`**: Cliente para Server Components e Server Actions.
2. **`src/utils/supabase/client.ts`**: Cliente para interações no navegador.
3. **`src/utils/supabase/middleware.ts`**: Lógica de proteção de rotas e renovação de sessão.

## Fluxo de Login (Magic Link)
- O acesso é feito via email.
- O sistema envia um **Magic Link** (link de login único) para o email administrativo.
- Isso elimina a necessidade de gestão de senhas e aumenta a segurança.

## Ação de Governança: Status de Tarefa
Implementamos a primeira ferramenta ativa de governo no dashboard:
- **Interface**: Dropdown interativo na listagem de tarefas.
- **Estados**: Pendente, Concluída e Cancelada.
- **Sincronismo**: A alteração é feita via Server Action, garantindo que o banco de dados seja atualizado com integridade total.
- **Auditoria**: O banco agora registra automaticamente o `completed_at` quando uma tarefa é marcada como concluída.

## Políticas de RLS (Banco de Dados)
- `TASKS`: Acesso total apenas para o email do administrador autenticado.
- `JOBS`: Leitura restrita apenas para o email do administrador autenticado.
- `SERVICE_ROLE`: Mantida apenas para processos internos do worker, isolada da trilha web.

## Próximos Passos
- Implementar edição de conteúdo de tarefas.
- Adicionar filtros e busca avançada no Palácio.
- Expandir a governança para gestão de Jobs (ex: cancelar job na fila).
