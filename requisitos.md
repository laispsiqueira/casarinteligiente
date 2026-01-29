# Requisitos e Regras de Negócio - Casar Inteligente

Este documento consolida todas as regras, comportamentos e padrões visuais do aplicativo. Deve ser atualizado a cada nova solicitação ou alteração de regra.

## 1. Interface e Experiência do Usuário (UI/UX)
- **Temas**: Suporte a modo claro (Light Mode) e modo escuro (Dark Mode).
- **Contraste Dinâmico**: Ao alternar entre temas, textos brancos devem tornar-se pretos e vice-versa, garantindo que todas as informações permaneçam visíveis e legíveis.
- **Identidade Visual**: Uso das cores Marrom (#402005) e Laranja (#ED8932). Tipografia: Playfair Display para títulos e Plus Jakarta Sans para corpo.
- **Componentes Glassmorphism**: Uso de fundos semitransparentes com desfoque (backdrop-blur) em painéis e modais.
- **Arquitetura de Código**: Utilização de POO (Programação Orientada a Objetos) para serviços e centralização de lógica em componentes compartilhados (PageHeader) para reduzir redundância.

## 2. Estrutura de Navegação (Sidebar)
- **Menu Lateral**:
  - Item "Estúdio de Design" renomeado para "Descreva o seu sonho".
  - Remoção da aba de "Configurações" do fluxo principal de navegação.
  - **Perfil e Login**: Todas as informações do usuário (Avatar, Nome, E-mail e Papel) e o botão de logout consolidados no rodapé do menu lateral.
  - **Marca no Topo**: O topo do menu agora exibe exclusivamente a logomarca e o branding "Casar Inteligente".
- **Visibilidade por Perfil**: Implementada através de uma classe `PermissionManager` para garantir consistência em toda a aplicação.
  - **Assessores**: Não possuem acesso à aba "Gestão & Clientes".

## 3. Página: Descreva o seu sonho
- **Cabeçalho**: Unificado através do componente `PageHeader`.
- **Guia de Prompt**: Exibição de card de ajuda estratégico.
- **Layout de Entrada**: Barra de texto e botão com tamanho padrão e minimalista.

## 4. Chat com a Vanessa (Consultoria)
- **Multimodalidade**: Processamento centralizado de imagens e áudios via `GeminiService`.
- **Áudio**: Gravação direta e transcrição automática para resposta contextual.
- **Sincronização**: Extração inteligente de tarefas para o "Meu Planejamento".

## 5. Funcionalidades de Dados e Gestão
- **Exportação**: Utilitário `exportToCSV` centralizado.
- **Persistência**: Camada de serviço `PersistenceService` unifica LocalStorage e IndexedDB, seguindo padrões de Singleton.
- **Gestão de Perfis**: Administradores podem gerenciar usuários e faturamento global. Assessores focam na gestão individual via Dashboard.

## 6. Tecnologia e Segurança
- **IA**: Modelos Gemini 3 e 2.5 integrados em uma classe de serviço unificada.
- **Privacidade**: Sessão ativa visível no rodapé do menu.
