# DOCUMENTO DO MUNDO — MUNDO ROBERTH.0.1

## Visão Geral e Propósito

O Mundo Roberth.0.1 representa um ecossistema digital soberano e autônomo, projetado para operar sob princípios rigorosos de arquitetura limpa, independência de front-end e forte integração assíncrona. Este não é um simples aplicativo web ou chatbot, mas sim um mundo digital completo onde a inteligência artificial atua como operária central, processando intenções dos usuários através de um fluxo automatizado e respondendo de forma inteligente.

A filosofia fundamental deste mundo digital baseia-se no princípio de que o dado pertence ao banco de dados, não existindo lógica de negócios sensível flutuando em JavaScript no navegador do cliente. O front-end serve exclusivamente como ferramenta de visualização e input superficial, enquanto o motor que decide os destinos, que dispara notificações, que gera respostas contextuais e que executa ações reside exclusivamente no backend serverless proporcionado pelo Supabase.

O desenvolvimento deste mundo é guiado pelo Agente Mestre de Engenharia (referido como Antigravity), que impõe o rigor arquitetural necessário e não permite atalhos ou empilhamento de soluções improvisadas. Cada nova funcionalidade deve ser decomposta em seis fases distintas: Entendimento, Planejamento, Decomposição, Execução, Validação e Relatório.

---

## Arquitetura do Sistema

### Visão Arquitetural de Alto Nível

O Mundo Roberth.0.1 utiliza uma arquitetura de monorepo soberano com separação clara de responsabilidades entre as camadas de apresentação, processamento e persistência. Esta arquitetura foi projetada para garantir escalabilidade horizontal, manutenibilidade do código e resiliência operacional.

A camada de apresentação consiste em uma aplicação web Next.js que funciona como dashboard administrativo e ferramenta de visualização. Esta camada não possui lógica de negócios complexa, servindo apenas para exibir métricas, gerenciar tarefas manualmente e visualizar o histórico de operações do sistema.

A camada de processamento é composta por Edge Functions do Supabase escritas em Deno, que executam em ambiente serverless com baixa latência. Esta camada é responsável por receber mensagens do Telegram, processar intenções utilizando inteligência artificial e executar ações específicas baseadas nas decisões da IA.

A camada de persistência é fornecida pelo Supabase, que oferece PostgreSQL como banco de dados relacional, filas de mensagens duráveis através de PGMQ, autenticação nativa e armazenamento de arquivos quando necessário. O Supabase atua como a soberania absoluta dos dados, garantindo integridade e segurança em todas as operações.

### Fluxo de Dados Principal

O fluxo de dados do ecossistema opera através de um pipeline assíncrono robusto que garante processamento confiável mesmo sob alta carga de mensagens. O processo inicia quando um usuário envia uma mensagem através do Telegram para o bot MundoRoberth. Esta mensagem é recebida pela Edge Function denominada telegram-webhook, que executa em resposta ao webhook configurado na API do Telegram.

Ao receber a mensagem, a Edge Function realiza uma série de operações críticas. Primeiramente, extrai as informações do usuário, incluindo ID do Telegram, nome, sobrenome, username e código de idioma. Em seguida, realiza um UPSERT na tabela user_profiles, criando ou atualizando o perfil do usuário conforme necessário. O comando original é então armazenado na tabela commands com o payload completo da mensagem, preservando todos os dados para auditoria futura.

Um novo registro é criado na tabela jobs com status pendente, incluindo o chat_id do Telegram para permitir resposta posterior ao usuário. Um evento inicial é registrado na tabela job_events documentando o recebimento do job. O job é então enfileirado na fila durável PGMQ através de chamada RPC, garantindo processamento assíncrono confiável. Finalmente, uma confirmação imediata é enviada ao usuário via Telegram, informando que sua mensagem foi recebida e está sendo processada.

O processamento efetivo ocorre na Edge Function denominada process-intent, que atua como worker de processamento cognitivo. Esta função consome jobs da fila PGMQ, analisa a intenção do usuário utilizando OpenAI GPT, decide qual ação executar e responde ao usuário com o resultado. O processamento é realizado de forma assíncrona, permitindo que o sistema mantenha响应 rápida mesmo sob alta carga.

### Stack Tecnológico

O backend do Mundo Roberth.0.1 utiliza as seguintes tecnologias principais. O Supabase fornece a plataforma completa, incluindo PostgreSQL para o banco de dados relacional com extensões PGMQ para filas de mensagens, Edge Functions escritas em Deno para processamento serverless, autenticação nativa com suporte a Magic Link, Row Level Security para segurança no nível de linha e Storage para armazenamento de arquivos quando necessário.

A camada de apresentação foi desenvolvida com Next.js versão 15.1.6 utilizando React 19.2.3, integração SSR do Supabase para gerenciamento de sessões e autenticação, Lucide React para ícones visuais, e design personalizado com estética glassmorphism e efeitos de brilho.

A comunicação com o Telegram é realizada através da API oficial do Telegram Bot, permitindo envio e recebimento de mensagens, criação de keyboards inline e gerenciamento de comandos. A inteligência artificial utilizada é a API OpenAI GPT, processando intents e gerando respostas contextuais e naturais.

---

## Estrutura do Banco de Dados

### Tabelas Principais e Seus Papéis

O banco de dados PostgreSQL do Mundo Roberth.0.1 contém um conjunto cuidadosamente projetado de tabelas que sustentam toda a operação do ecossistema. Cada tabela possui um propósito específico e está relacionada às demais através de chaves estrangeiras que garantem integridade referencial.

A tabela user_profiles armazena os perfis dos usuários provenientes do Telegram, servindo como registro canônico de todos os usuários que interagiram com o bot. Os campos incluem id como UUID único gerado automaticamente, telegram_id como identificador único do Telegram em formato BIGINT, first_name para o primeiro nome, last_name para o sobrenome opcional, username para o username do Telegram, language_code para o código de idioma do usuário, created_at para a data de criação e updated_at para a última atualização. Esta tabela possui políticas RLS que permitem que usuários autenticados vejam apenas seus próprios perfis, garantindo privacidade.

A tabela commands registra todas as intenções brutas recebidas do portal Telegram. Cada mensagem recebida pelo webhook resulta em um novo registro nesta tabela, permitindo auditoria completa de todas as interações. Os campos incluem id como UUID primário, user_id como referência para user_profiles, payload como JSONB contendo a mensagem completa do Telegram, e created_at para registro temporal.

A tabela jobs representa a unidade de trabalho agendada na fila principal do sistema. Cada comando recebido resulta em um job que é processado de forma assíncrona. Os campos incluem id como UUID primário, command_id como referência para commands, status como tipo enumerado com valores pending, running, completed e failed, result como JSONB para armazenar o resultado do processamento, created_at e updated_at para timestamps automáticos.

A tabela job_events mantém uma fita de auditoria completa para cada job, registrando cada mudança de estado e evento relevante. Esta tabela é fundamental para debugging e monitoramento do sistema. Os campos incluem id como UUID primário, job_id como referência para jobs, status para o estado do job no momento do evento, message para descrição textual do evento e created_at para o timestamp.

A tabela tasks armazena tarefas criadas a partir de intenções analisadas pela inteligência artificial. Quando a IA determina que a intenção do usuário corresponde a uma tarefa, um registro é criado nesta tabela. Os campos incluem id como UUID primário, created_from_job_id como referência única para jobs garantindo idempotência, title para o título da tarefa, description para descrição opcional, status com valores pending, running, completed e cancelled, due_at para prazo opcional, created_at e updated_at para timestamps.

A tabela calendar_events armazena eventos de calendário criados pela IA ou manualmente através do dashboard. Os campos incluem id como UUID primário, created_from_job_id como referência única para jobs, title para o título do evento, description para descrição opcional, start_at como data/hora de início obrigatória, end_at como data/hora de término opcional, all_day como booleano para eventos de dia inteiro, status com valores confirmed, tentative e cancelled, created_at e updated_at para timestamps.

### Extensões e Recursos Especiais

O banco de dados utiliza extensões PostgreSQL que fornecem capacidades avançadas necessárias para o funcionamento do ecossistema. A extensão pg_net permite webhooks assíncronos, possibilitando acionamento automático de Edge Functions quando novos jobs são inseridos. A extensão PGMQ (Persistent Queue Message Queue) fornece filas de mensagens duráveis que garantem processamento confiável mesmo em caso de falhas temporárias.

Funções PL/pgSQL auxiliares são definidas para operações comuns. A função handle_updated_at() automatiza a atualização do campo updated_at em todas as tabelas que necessitam desta funcionalidade. A função invoke_process_intent_webhook() encapsula a lógica de acionamento do worker de processamento.

---

## Edge Functions (Backend)

### Telegram Webhook (telegram-webhook)

A Edge Function telegram-webhook é o ponto de entrada principal do ecossistema, responsável por receber todas as mensagens provenientes do Telegram e iniciar o fluxo de processamento. Esta função foi escrita em Deno e executa no ambiente serverless do Supabase com tempos de resposta extremamente rápidos.

O funcionamento da função pode ser descrito em seis etapas sequenciais. Na primeira etapa, a função verifica se a mensagem recebida contém dados válidos do usuário Telegram. Na segunda etapa, realiza um UPSERT na tabela user_profiles usando o telegram_id como chave de conflito, garantindo que o perfil do usuário seja sempre mantido atualizado. Na terceira etapa, armazena o comando original na tabela commands preservando o payload completo da mensagem.

Na quarta etapa, cria um novo registro na tabela jobs com status pendente e o chat_id do Telegram para permitir resposta posterior. Na quinta etapa, registra um evento inicial na tabela job_events documentando o recebimento do job. Na sexta etapa, envia o job para a fila durável PGMQ através da função RPC push_intent_job. Finalmente, envia uma confirmação imediata ao usuário via Telegram API.

A função utiliza a Service Role Key do Supabase para operar no modo server-side, desviando das políticas RLS e garantindo acesso completo ao banco de dados para todas as operações de criação e atualização necessárias.

### Process Intent (process-intent)

A Edge Function process-intent atua como o worker de processamento cognitivo do ecossistema, consumindo jobs da fila e executando ações baseadas em análise de inteligência artificial. Esta é a função central que diferencia o Mundo Roberth.0.1 de um simples chatbot.

O fluxo de execução da função inicia com o consumo de um job da fila PGMQ através da função RPC pop_intent_job_from_queue, com um lock de 45 segundos para evitar processamento duplicado em caso de falhas. Em seguida, busca os detalhes do job e do comando original na tabela jobs para obter a mensagem enviada pelo usuário.

O job é marcado como running na tabela jobs e um evento correspondente é registrado na tabela job_events documentando o início do processamento. A função então invoca a API OpenAI GPT para analisar a intenção do usuário, enviando instruções do sistema que definem o contexto temporal, as ações disponíveis e o formato de resposta esperado.

A inteligência artificial retorna um objeto JSON estruturado contendo a intenção identificada, a confiança da análise, a ação recomendada e os payloads necessários para execução. Com base na ação recomendada, a função insere uma nova tarefa na tabela tasks ou um novo evento na tabela calendar_events, utilizando o created_from_job_id para manter rastreabilidade e garantir idempotência.

Finalmente, o job é marcado como completed com o resultado armazenado, uma mensagem de resposta é enviada ao usuário via Telegram, e a mensagem é arquivada na fila PGMQ. Em caso de qualquer erro durante o processamento, o job é marcado como failed com os detalhes do erro documentados para auditoria.

---

## Credenciais e Integrações

### Credenciais do Supabase

O projeto está configurado para conectar ao projeto Supabase denominado roberth.naninne@gmail's Project, localizado na região Americanas. As credenciais necessárias para integração são as seguintes:

A URL do projeto é https://yddgsupelmmxjpvnustg.supabase.co. A chave pública (anon key) para uso no browser é sb_publishable_Yji31tbxEri0ow4NshASQw_FkuO7Ds6. A chave secreta para uso em servidores e funções é sb_secret_lVmziZHLfVegx9hjuhe6rA_bBDSRovp. A chave JWT anon legado é eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZGdzdXBlbG1teGpwdm51c3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjgzNTgsImV4cCI6MjA4ODkwNDM1OH0.o68aok28Ougg-Mo3nHm6RyepMxAoWoZOjGtErxTtMiU. A chave JWT service_role legado é eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZGdzdXBlbG1teGpwdm51c3RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMyODM1OCwiZXhwIjoyMDg4OTA0MzU4fQ.Q4KWwicut3wsuwRtA9CA6LORcKvC8Sv7JCXXim_ZjcQ. A senha do banco de dados é Villa667.@Villa.

### Credenciais do Telegram

O bot do Telegram foi criado com o nome MundoRoberth e está disponível em t.me/MundoRoberth_bot. O token de acesso à API do Telegram é 8486462185:AAFsuiEwOQUj_-FbdPFauSwAgkyyrstg6qI. Este token deve ser mantido em segurança e nunca exposto em código client-side.

### Credenciais da OpenAI

A chave de API da OpenAI para processamento de inteligência artificial é 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. Esta chave deve ser utilizada nas Edge Functions para processamento de intents através do modelo GPT.

---

## Análise de Deploy da Aplicação Web

### Opções de Deploy Consideradas

Para o deploy da aplicação web do Mundo Roberth.0.1, existem várias opções disponíveis no mercado, cada uma com suas características distintas de custo, facilidade de configuração, desempenho e integração com o ecossistema Supabase.

A primeira opção é o Vercel, que é a plataforma nativa do Next.js e oferece integração primária com a tecnologia. As vantagens incluem deploy automático a partir do GitHub com preview branches para cada commit, edge functions integradas que complementam as Edge Functions do Supabase, otimizações automática de performance e imagens, analytics integrados, e suporte nativo a Next.js com zero configuração. As desvantagens incluem custos que podem aumentar com uso intensivo de serverless functions, e limits de build time no plano gratuito.

A segunda opção é o Netlify, que oferece excelente suporte a Next.js através de plugins e configuração flexível. As vantagens incluem deploy automático com pré-visualização, forms nativos que podem complementar o sistema, edge functions para processamento distribuído, e plano generoso no tier gratuito. As desvantagens incluem configuração inicial mais complexa que o Vercel para Next.js, e performance de edge functions inferior ao Vercel.

A terceira opção é o Cloudflare Pages, que oferece excelente performance global com custo muito baixo. As vantagens incluem bandwidth ilimitado no plano gratuito, edge functions com execução extremamente rápida na rede Cloudflare, integração com Workers para lógica adicional, e custo muito competitivo. As desvantagens incluem suporte a Next.js menos nativo, algumas funcionalidades de Next.js podem não funcionar nativamente, e curva de aprendizado para configuração ideal.

A quarta opção é o Supabase Frontend Hosting, que permite hospedar o frontend diretamente na infraestrutura do Supabase. As vantagens incluem integração nativa com o ecossistema Supabase, configuração simplificada através do dashboard, e gerenciamento unificado de todos os componentes. As desvantagens incluem menos opções de customização comparado às plataformas especializadas, e funcionalidades de deploy menos robustas.

### Recomendação de Deploy

Após análise detalhada das opções disponíveis, a recomendação é utilizar o Vercel como plataforma de deploy principal pelos seguintes motivos. A integração nativa com Next.js garante funcionamento perfeito de todas as funcionalidades do framework sem necessidade de workarounds ou configurações complexas. O ecosistema Next.js moderno (App Router, Server Actions, Streaming) funciona sem adaptações.

A configuração de variáveis de ambiente para conexão com Supabase é simplificada através do dashboard do Vercel. O deploy automático a partir do GitHub permite workflow de desenvolvimento profissional com CI/CD integrado. As funcionalidades de preview para cada pull request facilitam a revisão de código e testes antes da produção.

O plano gratuito do Vercel é suficiente para as necessidades iniciais do projeto, com bandwidth de 100GB mensal e serverless functions com 100GB-horas. O escalonamento para planos pagos é tranquilo quando necessário, sem necessidade de migração.

---

## Checklist de Implementação

### Fase 1: Configuração de Credenciais e Variáveis de Ambiente

As seguintes tarefas devem ser executadas para configurar corretamente as credenciais e variáveis de ambiente necessárias para o funcionamento do ecossistema.

A primeira tarefa é configurar as variáveis de ambiente do Supabase no frontend Next.js, criando o arquivo .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY. A segunda tarefa é configurar as variáveis de ambiente das Edge Functions no dashboard do Supabase, incluindo MY_SUPABASE_URL, MY_SUPABASE_SERVICE_ROLE_KEY, TELEGRAM_BOT_TOKEN e OPENAI_API_KEY.

A terceira tarefa é configurar o webhook do Telegram para apontar para a Edge Function telegram-webhook deployada. A quarta tarefa é verificar a conexão do banco de dados testando as credenciais e executando um ping no projeto Supabase.

### Fase 2: Migração e Estrutura do Banco de Dados

As seguintes tarefas devem ser executadas para configurar a estrutura do banco de dados no Supabase.

A primeira tarefa é executar todas as migrações SQL presentes na pasta supabase/migrations, criando as tabelas user_profiles, commands, jobs, job_events, tasks e calendar_events. A segunda tarefa é verificar a criação das extensões pg_net e PGMQ no banco de dados.

A terceira tarefa é criar as funções RPC necessárias para manipulação da fila PGMQ, incluindo push_intent_job, pop_intent_job_from_queue e archive_intent_job. A quarta tarefa é configurar as políticas Row Level Security em todas as tabelas conforme documentado nas migrações.

A quinta tarefa é criar o usuário administrador inicial no Supabase Auth com o email roberth.naninne@gmail.com para acesso ao dashboard. A sexta tarefa é testar a inserção e recuperação de dados em todas as tabelas.

### Fase 3: Deploy e Configuração das Edge Functions

As seguintes tarefas devem ser executadas para deployar e configurar as Edge Functions do Supabase.

A primeira tarefa é fazer o deploy da Edge Function telegram-webhook através do Supabase CLI ou dashboard. A segunda tarefa é fazer o deploy da Edge Function process-intent através do Supabase CLI ou dashboard.

A terceira tarefa é configurar o webhook do Telegram usando o URL da Edge Function telegram-webhook. A quarta tarefa é testar o recebimento de mensagens enviando uma mensagem de teste para o bot do Telegram.

A quinta tarefa é verificar o processamento de intents conferindo se os jobs são criados corretamente na tabela jobs. A sexta tarefa é testar a resposta do bot confirmando que o usuário recebe feedback da mensagem processada.

### Fase 4: Deploy do Frontend Web

As seguintes tarefas devem ser executadas para deployar a aplicação web Next.js.

A primeira tarefa é conectar o repositório GitHub ao Vercel para deploy automático. A segunda tarefa é configurar as variáveis de ambiente no dashboard do Vercel, incluindo NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.

A terceira tarefa é executar o build inicial e verificar se não há erros de compilação. A quarta tarefa é configurar o domínio personalizado se desejado (opcional).

A quinta tarefa é testar o login com Magic Link enviando um email de teste. A sexta tarefa é verificar o dashboard confirmando a exibição correta de métricas e dados.

### Fase 5: Integração com OpenAI e Processamento de Intenções

As seguintes tarefas devem ser executadas para configurar o processamento de intenções com OpenAI GPT.

A primeira tarefa é verificar a configuração da variável OPENAI_API_KEY nas Edge Functions. A segunda tarefa é testar a integração com OpenAI enviando uma mensagem simples ao bot.

A terceira tarefa é verificar o processamento de intents analisando os logs da Edge Function process-intent. A quarta tarefa é testar a criação de tarefas enviando mensagens como criar tarefa ou preciso fazer algo.

A quinta tarefa é testar a criação de eventos enviando mensagens como criar evento ou agendar reunião. A sexta tarefa é verificar as respostas do bot confirmando que são contextuais e naturais.

### Fase 6: Validação e Testes Finais

As seguintes tarefas devem ser executadas para validar o funcionamento completo do ecossistema.

A primeira tarefa é realizar teste end-to-end enviando uma mensagem completa ao Telegram e verificando todo o fluxo. A segunda tarefa é verificar a criação correta de tarefas e eventos no banco de dados.

A terceira tarefa é testar o dashboard web verificando a visualização de tarefas, jobs e eventos. A quarta tarefa é verificar a persistência de sessão e autenticação no frontend.

A quinta tarefa é testar a resistência a falhas simulando erros e verificando a auditoria em job_events. A sexta tarefa é documentar qualquer ajuste necessário e aplicar melhorias identificadas durante os testes.

---

## Próximos Passos

Este documento serve como referência completa para a implementação do Mundo Roberth.0.1. Recomenda-se seguir o checklist na ordem apresentada, executando cada fase completamente antes de avançar para a próxima.

Após a implementação completa, o ecossistema estará operacional com o bot do Telegram processando mensagens através de inteligência artificial OpenAI, o banco de dados storing todas as informações de forma estruturada e segura, a aplicação web servindo como dashboard administrativo para monitoramento e gestão, e filas de processamento garantindo confiabilidade mesmo sob alta carga.

---

*Documento elaborado como parte do projeto Mundo Roberth.0.1*
*Autor: MiniMax Agent*
*Data: 13 de março de 2026*