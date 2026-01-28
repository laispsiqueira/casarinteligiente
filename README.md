# Casar Inteligente | Inteligência para o seu Casamento

Bem-vindo ao repositório do **Casar Inteligente**, uma plataforma de planejamento de casamentos focada em clareza, critério e segurança, liderada pela consultora de IA, Vanessa.

---

## 🎨 Manual de Marca & Persona

### Vanessa (A Consultora)
Vanessa não é apenas uma IA; ela é a personificação da elegância e maturidade.
- **Tom de Voz**: Calmo, Firme, Respeitoso, Didático e Adulto.
- **Promessa**: Oferecer segurança antes de qualquer gasto ou decisão.
- **Diferencial**: Acolhimento psicológico aliado à organização técnica.

### Identidade Visual
- **Primária**: Marrom Escuro (`#402005`) - Transmite solidez e maturidade.
- **Destaque**: Laranja (`#ED8932`) - Transmite energia e criatividade controlada.
- **Tipografia**: *Playfair Display* (Títulos) e *Plus Jakarta Sans* (Corpo).

---

## 📋 Requisitos do Sistema (User Stories)

| Épico | User Story | Descrição | Critérios de Aceite |
| :--- | :--- | :--- | :--- |
| **1. Consultoria Vanessa** | **1.1 Conversa Estruturada** | Como noiva, quero conversar com a Vanessa para obter clareza. | Respostas maduras, busca web real e citações de fontes. |
| | **1.2 Análise Visual** | Como noiva, quero enviar fotos para análise de critério. | Upload de imagem funcional e feedback estético da IA. |
| **2. Planejamento** | **2.1 Geração de Roteiro** | Como noiva, quero roteiros personalizados por IA. | Geração de tarefas com categoria e persistência na lista. |
| **3. Fornecedores** | **3.1 Busca Grounded** | Como noiva, quero buscar fornecedores validados. | Uso de Gemini Pro com Google Search e links reais. |
| **4. Convidados** | **4.1 Gestão de RSVP** | Como noiva, quero gerenciar convidados e WhatsApp. | Contador de convidados e simulação de notificação. |

---

## 📁 Estrutura de Arquivos

### Configurações
- `index.html`: Estilos globais (Tailwind), fontes e cores da marca.
- `metadata.json`: Informações de permissão e metadados da aplicação.
- `index.tsx`: Ponto de entrada do React e montagem do DOM.

### Lógica e Tipagem
- `types.ts`: Definições de interfaces (Mensagens, Tarefas, Convidados) para segurança de código.
- `services/gemini.ts`: Core da Vanessa. Integração com Google Gemini (Flash, Pro, Imagen).

### Componentes de Interface (UI)
- `App.tsx`: Orquestrador principal de estado e navegação entre módulos.
- `components/Sidebar.tsx`: Navegação lateral com identidade visual proprietária.
- `components/ChatSection.tsx`: Interface de consultoria com histórico e upload.
- `components/PlannerSection.tsx`: Sistema de checklist com sugestões de IA.
- `components/SupplierSection.tsx`: Buscador de mercado com Google Search Grounding.
- `components/GuestSection.tsx`: Painel de RSVP e automação de contato.
- `components/ImageSection.tsx`: Estúdio para materialização de conceitos visuais.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, Tailwind CSS.
- **Iconografia**: Lucide React.
- **Inteligência Artificial**:
  - `gemini-3-flash-preview`: Chat rápido e tarefas.
  - `gemini-3-pro-preview`: Pesquisa complexa de fornecedores.
  - `gemini-2.5-flash-image`: Geração de inspirações visuais.

---
*Documentação gerada para o projeto Casar Inteligente - Simplifier.*