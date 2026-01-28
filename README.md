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

## 🔐 Perfis de Acesso e Regras de Negócio

O sistema opera sob uma hierarquia rígida de permissões para garantir a privacidade dos dados e o funil de vendas:

### 1. Noivo Free
- **Foco**: Experimentação e Atração.
- **Acesso**: Apenas à **Consultoria Vanessa**. Todas as outras abas de ferramentas são ocultas para incentivar o upgrade de plano.

### 2. Noivo+
- **Foco**: Planejamento Completo.
- **Acesso**: Consultoria, Estúdio de Design, Planejamento, Convidados e Fornecedores.
- **Relacionamento**: Pode ser vinculado a um Assessor para acompanhamento compartilhado.

### 3. Assessor (Profissional)
- **Foco**: Gestão de Clientes.
- **Acesso**: Todas as ferramentas de planejamento + **Painel de Noivos (Dashboard)**.
- **Vínculo**: Possui uma visão filtrada "Meus Noivos", onde enxerga apenas os casais vinculados ao seu ID.

### 4. Administrador (Gestão Global)
- **Foco**: Controle da Plataforma.
- **Acesso**: Visão total e irrestrita de todos os módulos.
- **Faturamento**: Acesso exclusivo ao fluxo de caixa global do App.
- **Gestão de Usuários**: Painel para monitorar todos os cadastros e gerenciar vínculos.

---

## 🚀 Funcionalidades Especiais

### 🕵️‍♂️ Sistema de Personificação (Logar Como)
O Administrador possui a ferramenta de **Impersonation**, permitindo:
- Acessar o dashboard com a visão exata de qualquer usuário (Noivo ou Assessor).
- Identificar erros de configuração ou prestar suporte técnico direto na conta do usuário.
- Um banner de segurança indica quando o modo de visualização está ativo, permitindo o retorno imediato ao perfil Admin.

### 📊 Painel de Noivos (Dashboard)
Ferramenta analítica que transforma tarefas e RSVPs em indicadores de saúde do evento (KPIs), disponível para Assessores e Noivos+.

---

## 📋 Requisitos do Sistema (User Stories)

| Épico | User Story | Descrição | Status |
| :--- | :--- | :--- | :--- |
| **1. Consultoria** | **Conversa Grounded** | Chat com Vanessa usando Google Search para dados reais. | ✅ |
| **2. Design** | **Estúdio de IA** | Geração de imagens e inspirações técnicas com Gemini Image. | ✅ |
| **3. Governança** | **Perfis & Regras** | Hierarquia entre Noivos, Assessores e Admins. | ✅ |
| **4. Admin** | **Logar Como** | Capacidade do Admin de "entrar" na conta de outros usuários. | ✅ |
| **5. Financeiro** | **Faturamento** | Controle de transações e planos mensais no painel Admin. | ✅ |

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, Tailwind CSS.
- **Context API**: Gerenciamento de estado global e lógica de personificação.
- **Inteligência Artificial**:
  - `gemini-3-flash-preview`: Chat rápido e lógica de tarefas.
  - `gemini-3-pro-preview`: Pesquisa complexa e profunda de fornecedores.
  - `gemini-2.5-flash-image`: Geração de inspirações visuais de alta qualidade.
- **Persistência**: IndexedDB (via `services/db.ts`) para dados offline e locais.

---
*Documentação atualizada para o sistema de gestão Casar Inteligente - Simplifier.*