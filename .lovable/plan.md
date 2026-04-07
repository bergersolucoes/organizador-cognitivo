

# Organizador Cognitivo — Plano de Implementação

## Visão Geral
Ferramenta de autogoverno, reflexão e organização cognitiva inspirada em estoicismo prático. Landing page pública + aplicação autenticada completa com 10+ módulos, assistente de IA e PWA.

---

## Fase 1: Fundação (Design System, Auth, Banco, Landing Page)

### Design System Premium
- Paleta sóbria: grafite, areia, off-white, azul profundo, verde acinzentado, cobre discreto
- Tema dark e light (ambos refinados)
- Tipografia elegante, espaçamento generoso, cards sofisticados, sombras suaves
- Componentes base reutilizáveis com estética contemplativa

### Landing Page Pública
- Hero com nome, subtítulo e CTAs
- Seção "Para quem é" (8 perfis de dor)
- Seção "O que você encontra" (10 módulos visuais)
- Seção "Como funciona" (7 etapas)
- Seção Assistente Estoico
- Seção Benefícios
- Seção Privacidade
- FAQ completo (9 perguntas)
- CTA final + Rodapé com aviso ético

### Autenticação
- Cadastro, login, logout, recuperação de senha
- Proteção de rotas privadas
- Perfil de usuário

### Banco de Dados (Lovable Cloud)
Tabelas com RLS, UUIDs, timestamps, soft delete:
- `profiles`, `user_settings`, `tags`
- `journal_entries`, `journal_entry_tags`
- `nightly_reviews`, `decisions`, `decision_options`
- `control_exercises`, `triggers`, `virtues_log`
- `relationship_reflections`, `mood_logs`
- `chat_conversations`, `chat_messages`

### PWA
- Manifest com ícones e splash screen
- Instalável no celular
- Layout responsivo premium mobile-first

---

## Fase 2: Módulos Principais

### Dashboard
- Resumo do dia/semana com cards elegantes
- Humor, clareza, ansiedade percebida
- Decisões pendentes, gatilhos recentes
- Atalhos rápidos (registro, revisão, decisão, chat)
- Gráficos de padrões ao longo do tempo

### Diário Guiado (módulo central)
- Formulário completo em seções colapsáveis (25+ campos)
- 15 tipos de registro
- Versão "registro rápido"
- Rascunhos, histórico, busca, filtros
- Tags personalizáveis

### Revisão Noturna
- Fluxo guiado com 13 perguntas reflexivas
- Checklist + texto livre
- Humor final, aprendizado, compromisso
- Calendário de revisões

### Decisões Difíceis
- Formulário completo (25+ campos analíticos)
- Status: aberta → maturando → decidida → revisando → encerrada
- Linha do tempo, notas, vínculos com diário

---

## Fase 3: Módulos Complementares + IA

### Controle x Não Controle
- Exercício visual rápido de separação
- Fatos, suposições, medos, ações, aceitação
- Vinculável a diário ou decisão

### Gatilhos e Impulsos
- Registro com 12+ campos
- Mapa de gatilhos recorrentes
- Tendências por categoria, emoção, frequência

### Virtudes e Conduta
- 4 virtudes cardinais com descrições práticas
- Registro diário de virtude testada
- Autoavaliação e progresso

### Relações e Conflitos
- Análise de vínculos, atritos, expectativas
- 16 campos estruturados
- Conduta ideal e aprendizado

### Padrões e Histórico
- Calendário de registros
- Gráficos: humor, ansiedade, intensidade emocional
- Filtros por período, categoria, emoção, tag, pessoa
- Timeline visual

### Assistente Estoico
- Chat com streaming via Edge Function
- Lovable AI como backend (LOVABLE_API_KEY)
- System prompt filosófico-prático detalhado
- Modos: reflexão, análise, decisão, controle, conflito, socrático
- Contexto do app (últimos registros, decisões, gatilhos)
- Toggle: contexto automático, modo direto/exploratório
- Botões de ações rápidas (8 sugestões pré-definidas)
- Histórico de conversas (criar, renomear, excluir)

### Onboarding
- 5 perguntas elegantes sobre uso, dificuldade, foco
- Salvar em preferências do usuário

### Preferências
- Tema, nome, objetivo, tom/modo do assistente
- Contexto automático sim/não
- Estrutura para exportação futura

### UX Avançado
- Command palette / atalhos rápidos
- Empty states inteligentes
- Loading states com skeletons
- Toasts discretos

---

## Edge Functions
- `chat` — Assistente estoico com streaming via Lovable AI
- `chat-context` — Busca contexto do usuário para enriquecer conversas

## Notas Técnicas
- Toda persistência no banco (zero localStorage para dados do usuário)
- RLS em todas as tabelas (usuário só acessa seus dados)
- Código organizado por domínio/feature
- Português do Brasil em toda a interface
- Arquitetura pronta para evolução comercial

