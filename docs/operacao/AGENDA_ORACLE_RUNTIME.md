# ORÁCULO DA AGENDA (WEB DASHBOARD)

## Visão Geral
O Oráculo da Agenda é a interface visual para os eventos agendados pela inteligência do Mundo Roberth.0.1. Localizada em `/agenda`, esta página oferece uma visão cronológica e organizada dos compromissos do reino.

## Estrutura da Página `/agenda`
- **Leitura Segura**: Os dados são extraídos diretamente da tabela `calendar_events` via Server-Side Rendering (SSR), respeitando as políticas de RLS e a sessão do administrador.
- **Agrupamento por Dia**: Os eventos são agrupados automaticamente em seções por data (ex: "segunda-feira, 15 de março").
- **Visualização Cronológica**: Os compromissos são ordenados do mais próximo para o mais distante.

## Tratamento de Timezone
- **Padrão**: O sistema utiliza `America/Sao_Paulo` (Brasília) como fuso horário oficial.
- **Formatação**: As datas e horas são formatadas usando `toLocaleDateString` e `toLocaleTimeString` com o locale `pt-BR` para garantir consistência com a entrada via Telegram.

## Identificação Visual
- **Dia Todo**: Eventos marcados como "Dia Todo" recebem um destaque simplificado na barra lateral do card.
- **Timed Events**: Eventos com horário marcado exibem o horário de início em destaque e um brilho sutil no card para indicar sensibilidade temporal.
- **Status**: Indicadores visuais mostram se o evento está confirmado, tentativo ou cancelado.

## Resumo no Dashboard
A página inicial do Palácio agora conta com um widget de **Próximos Compromissos**, exibindo os 3 eventos mais imediatos para uma consulta rápida logo no acesso.

## Limitações Técnicas
- **Somente Leitura**: Atualmente, a agenda é puramente visual. Para cancelar ou alterar um evento, é necessário utilizar o SQL Editor ou aguardar a Sprint de Governança Avançada.
- **Visualização de Lista**: Não há visualização de grade (mensal/semanal) nesta fase inicial.

## Próximos Passos
- Implementar edição de eventos diretamente na agenda.
- Adicionar detecção visual de conflitos de horário.
- Integrar com provedores externos (vcal/ics) para exportação.
