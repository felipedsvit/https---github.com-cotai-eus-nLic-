# Plano de Desenvolvimento Atualizado: Portal do Fornecedor PNCP

## 1. Status Atual da Aplicação

### ✅ **Infraestrutura Implementada (Funcionando)**
- **Arquitetura:** Next.js 15 com App Router + TypeScript
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Docker:** Multi-container (app, postgres, worker)
- **APIs:** Todas as 3 APIs PNCP funcionando corretamente
  - `/api/contratacoes/oportunidades` (API 6.4) ✅
  - `/api/contratacoes/historico` (API 6.3) ✅
  - `/api/contratacoes/atas` (API 6.5) ✅
- **Domínios:** APIs funcionando `/api/domain/modalidades` ✅

### ✅ **Frontend Atual**
- **Componentes:** shadcn/ui implementados (cards, tabs, buttons, inputs, select)
- **Layout:** Dashboard com 3 módulos em tabs
- **Tipografia:** Inter font (Google Fonts)
- **Estilização:** Tailwind CSS v4 com CSS variables para temas

---

## 2. Plano de Modernização e Melhorias

### **Fase 1: Design System e Tema Escuro/Claro**

#### **2.1 Configuração do Sistema de Temas**
- **Atualizar Tailwind Config:**
  - Implementar estratégia `dark:` class
  - Definir cores customizadas para modo claro/escuro
  - Configurar CSS variables para switching dinâmico

- **Paleta de Cores Moderna:**
  ```css
  /* Modo Claro */
  --background: #f7f9fb;
  --card: #ffffff;
  --text-primary: #222222;
  --blue-primary: #2563eb;
  --border: #e5e7eb;
  
  /* Modo Escuro */
  --background-dark: #18181b;
  --card-dark: #23232a;
  --text-primary-dark: #f3f4f6;
  --blue-primary-dark: #60a5fa;
  --border-dark: #27272a;
  ```

#### **2.2 Componentes de Tema**
- **ThemeProvider:** Context para gerenciar estado do tema
- **ThemeToggle:** Switch elegante no header
- **LocalStorage:** Persistir preferência do usuário
- **System Detection:** Detectar tema do SO automaticamente

#### **2.3 Reestruturação do Layout**
- **Sidebar Fixa:** Navegação lateral moderna com ícones
- **Header Aprimorado:** Logo, breadcrumbs, theme toggle, user info
- **Cards Redesenhados:** Bordas arredondadas, sombras suaves, hover effects
- **Microinterações:** Animações sutis em botões e cards

### **Fase 2: Componentes UI Avançados**

#### **2.4 Componentes Adicionais**
- **Loading States:** Skeletons para carregamento de dados
- **Data Tables:** Tabelas avançadas com sorting, filtering
- **Pagination:** Navegação de páginas aprimorada
- **Export Buttons:** PDF, Excel, CSV com ícones modernos
- **Search Components:** Busca avançada com filtros collapse
- **Toast Notifications:** Feedback visual para ações
- **Modal/Dialog:** Para exibir detalhes completos

#### **2.5 Ícones Modernos**
- **Integração Heroicons:** Ícones consistentes e modernos
- **Lucide React:** Alternativa com mais variedade
- **Ícones por Módulo:**
  - Oportunidades: `📋 ClipboardDocumentListIcon`
  - Histórico: `📊 ChartBarIcon`
  - Atas: `📑 DocumentTextIcon`

### **Fase 3: Funcionalidades Avançadas**

#### **2.6 Sistema de Busca Inteligente**
- **Busca Local:** Filtros no frontend para dados carregados
- **Filtros Avançados:** Collapsible panels com múltiplos critérios
- **Saved Searches:** Salvar consultas frequentes
- **Quick Filters:** Filtros rápidos (7 dias, 30 dias, etc.)

#### **2.7 Gestão de Dados**
- **Favoritos:** Marcar contratações importantes
- **Comparar:** Comparar múltiplas contratações
- **Histórico de Consultas:** Log das buscas realizadas
- **Exportação Avançada:** Múltiplos formatos com customização

#### **2.8 Dashboard Analytics**
- **Métricas Visuais:** Gráficos com charts.js ou recharts
- **Estatísticas:** Resumos dos dados consultados
- **Tendências:** Análise temporal das contratações
- **Widgets:** Cards informativos no dashboard

### **Fase 4: Performance e UX**

#### **2.9 Otimizações**
- **Lazy Loading:** Carregamento sob demanda
- **Virtual Scrolling:** Para listas grandes
- **Caching:** Cache inteligente de consultas
- **Debouncing:** Otimizar inputs de busca

#### **2.10 Acessibilidade**
- **ARIA Labels:** Todos os componentes acessíveis
- **Keyboard Navigation:** Navegação completa por teclado
- **Screen Reader:** Compatibilidade total
- **Contrast Ratios:** Manter > 4.5:1 em ambos os temas

### **Fase 5: Funcionalidades Futuras**

#### **2.11 APIs Complementares**
- **Detalhes da Contratação:** Implementar API 6.3.5
- **Documentos:** API 6.3.8 para downloads
- **Itens:** APIs 6.3.13-6.3.14 para detalhes
- **Imagens:** API 6.3.22 para visualização

#### **2.12 Features Avançadas**
- **Notificações:** Alertas para novas oportunidades
- **Relatórios:** Geração de relatórios customizados
- **API Própria:** Endpoints para integrações externas
- **Mobile App:** PWA para dispositivos móveis

---

## 3. Priorização de Implementação

### **Sprint 1 (Alta Prioridade)**
1. Sistema de tema claro/escuro completo
2. Redesign dos componentes existentes
3. Sidebar navigation moderna
4. Microinterações e animações

### **Sprint 2 (Média Prioridade)**
1. Componentes UI avançados
2. Sistema de busca inteligente
3. Loading states e skeleton
4. Export functionality

### **Sprint 3 (Baixa Prioridade)**
1. Dashboard analytics
2. Performance optimizations
3. Acessibilidade completa
4. Features avançadas

---

## 4. Detalhamento dos Módulos (Funcionalidades Atuais)

### Módulo I: Oportunidades Abertas (API 6.4)
- **Busca:** Formulário com os seguintes campos:
    - "Data Final" (obrigatório, pré-preenchido com a data atual, formato AAAAMMDD)
    - "Modalidade" (obrigatório, conforme tabela de domínio)
    - Filtros opcionais: `uf`, `cnpj`, palavra-chave (busca local), `codigoMunicipioIbge`, `codigoUnidadeAdministrativa`, `idUsuario`
    - "Página" (obrigatório), tamanho de página ajustável (até 500)
- **Domínios:** Modalidade de Contratação (manual 5.2), Modo de Disputa (manual 5.3), Situação da Contratação (manual 5.5)
- **Observação:** Exibir campos relevantes do retorno, como número de controle PNCP, objeto da contratação, modalidade, datas de abertura/encerramento, órgão, etc.

### Módulo II: Histórico de Contratações (API 6.3)
- **Busca:** Formulário com os seguintes campos:
    - "Data Inicial" e "Data Final" (obrigatórios, pré-preenchidos, formato AAAAMMDD)
    - "Modalidade" (obrigatório, conforme tabela de domínio)
    - Filtros opcionais: `codigoModoDisputa`, `uf`, `codigoMunicipioIbge`, `cnpj`, `codigoUnidadeAdministrativa`, `idUsuario`, palavra-chave (busca local)
    - "Página" (obrigatório), tamanho de página ajustável (até 500)
- **Domínios:** Modalidade de Contratação, Modo de Disputa, Situação da Contratação
- **Observação:** Exibir campos relevantes do retorno, como número de controle PNCP, objeto, modalidade, órgão, datas, etc.

### Módulo III: Consulta de Atas de Preço (API 6.5)
- **Busca:** Formulário com os seguintes campos:
    - "Data Inicial" e "Data Final" (obrigatórios, pré-preenchidos, formato AAAAMMDD)
    - Filtros opcionais: `idUsuario`, `cnpj`, `codigoUnidadeAdministrativa`
    - "Página" (obrigatório), tamanho de página ajustável (até 500)
- **Observação:** Exibir campos relevantes do retorno, como número de controle da ata, objeto, órgão, datas de vigência, etc.

---

## 5. Considerações Técnicas

### **Dependências Necessárias**
```json
{
  "next-themes": "^0.2.1",
  "@heroicons/react": "^2.0.0",
  "recharts": "^2.8.0",
  "framer-motion": "^10.16.0",
  "react-hook-form": "^7.45.0",
  "zod": "^3.22.0",
  "jspdf": "^2.5.1",
  "xlsx": "^0.18.5"
}
```

### **Estrutura de Pastas Atualizada**
```
src/
├── app/
├── components/
│   ├── ui/          # Componentes base
│   ├── modules/     # Módulos específicos
│   ├── layout/      # Layout components
│   └── theme/       # Theme components
├── lib/
├── types/
└── styles/
```

### **Configurações Docker**
- Manter configuração atual (funcionando)
- Adicionar variáveis de ambiente para features
- Otimizar build para produção

---

## 6. Dados de Resposta das APIs (Persistência Atual)

### API 6.3 – Histórico de Contratações ✅
**Parâmetros de entrada obrigatórios e opcionais:**
- **dataInicial** (Data, obrigatório): Data inicial do período a ser consultado no formato AAAAMMDD.
- **dataFinal** (Data, obrigatório): Data final do período a ser consultado no formato AAAAMMDD.
- **codigoModalidadeContratacao** (Inteiro, obrigatório): Código da tabela de domínio referente à Modalidade da Contratação.
- **codigoModoDisputa** (Inteiro, opcional): Código da tabela de domínio referente ao Modo de Disputa.
- **uf** (String, opcional): Sigla da Unidade Federativa referente à Unidade Administrativa do órgão.
- **codigoMunicipioIbge** (String, opcional): Código IBGE do Município da Unidade Administrativa.
- **cnpj** (String, opcional): CNPJ do órgão originário da contratação.
- **codigoUnidadeAdministrativa** (String, opcional): Código da Unidade Administrativa do órgão originário da contratação.
- **idUsuario** (Inteiro, opcional): Identificador do sistema usuário que publicou a contratação.
- **pagina** (Inteiro, obrigatório): Número da página que se deseja obter os dados.

### API 6.4 – Oportunidades Abertas ✅
**Parâmetros de entrada obrigatórios e opcionais:**
- **dataFinal** (Data, obrigatório): Data final do período a ser consultado no formato AAAAMMDD.
- **codigoModalidadeContratacao** (Inteiro, obrigatório): Código da tabela de domínio Modalidade da Contratação.
- **uf** (String, opcional): Sigla da Unidade Federativa referente à Unidade Administrativa do órgão.
- **codigoMunicipioIbge** (String, opcional): Código IBGE do Município da Unidade Administrativa.
- **cnpj** (String, opcional): CNPJ do órgão originário da contratação.
- **codigoUnidadeAdministrativa** (String, opcional): Código da Unidade Administrativa do órgão originário da contratação.
- **idUsuario** (Inteiro, opcional): Identificador do sistema usuário que publicou a contratação.
- **pagina** (Inteiro, obrigatório): Número da página que se deseja obter os dados.
- **tamanhoPagina** (Inteiro, opcional): Tamanho da página de resultados (até 500 registros).

### API 6.5 – Consulta de Atas de Registro de Preço ✅
**Parâmetros de entrada obrigatórios e opcionais:**
- **dataInicial** (Data, obrigatório): Data inicial do período a ser consultado no formato AAAAMMDD.
- **dataFinal** (Data, obrigatório): Data final do período a ser consultado no formato AAAAMMDD.
- **idUsuario** (Inteiro, opcional): Identificador do sistema usuário que publicou a ata.
- **cnpj** (String, opcional): CNPJ do órgão originário da contratação.
- **codigoUnidadeAdministrativa** (String, opcional): Código da Unidade Administrativa do órgão originário da contratação.
- **pagina** (Inteiro, obrigatório): Número da página que se deseja obter os dados.
- **tamanhoPagina** (Inteiro, opcional): Tamanho da página de resultados (até 500 registros).

**Observação:** O backend armazena integralmente todos os dados recebidos das APIs, incluindo metadados de paginação (`totalRegistros`, `totalPaginas`, `numeroPagina`, `paginasRestantes`, `empty`).

---

## 7. Pontos de Atenção e Detalhes Técnicos

- **Formatação de Datas:** Todos os campos de data são enviados no formato AAAAMMDD, conforme o manual.
- **Paginação:** As APIs retornam dados paginados. O app permite navegação entre páginas e ajustar o tamanho da página (até 500 registros).
- **Tabelas de Domínio:** Modalidade, Modo de Disputa, Situação, etc., são carregadas conforme o manual para garantir consistência dos filtros e tradução dos códigos.
- **Tradução de Códigos:** Os valores textuais dos códigos são exibidos usando as tabelas de domínio do manual.
- **Filtros Opcionais:** O usuário pode refinar as buscas usando os filtros opcionais disponíveis em cada endpoint.
- **Tratamento de Erros:** Mensagens claras são exibidas para códigos de erro HTTP (400, 422, 500, etc.).
- **Persistência Completa:** Todos os dados recebidos das APIs são armazenados integralmente no banco de dados, inclusive os metadados de paginação e status.

---

## 8. Resultados Esperados

### **Visual**
- Interface moderna e profissional
- Suporte completo a tema claro/escuro
- Experiência fluida e responsiva
- Animações sutis e elegantes

### **Funcional**
- Performance otimizada
- Acessibilidade completa
- Features avançadas de busca
- Exportação e análise de dados

### **Técnico**
- Código maintível e escalável
- Testes automatizados
- Documentação completa
- APIs preparadas para expansão

---

## 9. Referências

- Manual das APIs PNCP (consultar sempre que houver dúvida sobre parâmetros, domínios ou campos de retorno).
- [Documentação Técnica PNCP](https://pncp.gov.br/api/consulta/swagger-ui/index.html)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js Themes](https://github.com/pacocoursey/next-themes)
- [Heroicons](https://heroicons.com/)

---

**Resumo:**  
Este plano atualizado mantém toda a funcionalidade atual (que está funcionando perfeitamente) e adiciona camadas de modernização e novas features de forma incremental e estruturada, focando em design moderno, acessibilidade e experiência do usuário.