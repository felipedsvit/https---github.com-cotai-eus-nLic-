# Plano de Desenvolvimento: Portal do Fornecedor PNCP

## 1. Visão Geral e Estratégia

O objetivo é criar uma aplicação web que sirva como uma central de ferramentas robusta, rápida e confiável para fornecedores que interagem com o Portal Nacional de Contratações Públicas (PNCP).

O desenvolvimento será realizado em uma única fase, já contemplando integração direta com as APIs do PNCP e persistência de todos os dados recebidos em banco de dados próprio. Todo dado retornado pelas APIs será armazenado integralmente, garantindo rastreabilidade, performance e possibilidade de consultas avançadas.

---

## 2. Arquitetura e Tecnologias

- **Frontend:** Next.js (React) com TypeScript.
- **Estilização:** Tailwind CSS.
- **Backend (BFF):** API Routes do Next.js para intermediar a comunicação com a API do PNCP e persistir os dados recebidos no banco de dados.
- **Banco de Dados:** PostgreSQL (ou similar), para armazenar todos os dados recebidos das APIs.
- **Worker de Sincronização:** Serviço de background responsável por consultar periodicamente as APIs do PNCP, armazenar todos os dados recebidos e traduzir códigos para valores textuais (ex: Modalidade, Situação).

---

## 3. Detalhamento dos Módulos

A aplicação será organizada em três abas, cada uma baseada em um endpoint do manual:

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

## 4. Dados de Resposta das APIs (a serem persistidos)

Todos os dados retornados pelas APIs devem ser armazenados no banco de dados, incluindo os campos obrigatórios e recomendados pelo manual. Para garantir rastreabilidade e consultas avançadas, os seguintes campos devem ser obrigatoriamente persistidos para cada módulo:

### API 6.3 – Histórico de Contratações

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

**Observação:**  
O backend deve armazenar integralmente todos os dados recebidos da resposta da API, incluindo os campos do vetor `data` e os metadados de paginação (`totalRegistros`, `totalPaginas`, `numeroPagina`, `paginasRestantes`, `empty`).  
Os campos de cada contratação a serem persistidos devem seguir os IDs definidos no manual (ex: 2, 3, 7, 12, 13, 14, 15, 16.1, 16.2, 16.3, 17, 25.1, 25.2, 26.1).

### API 6.4 – Oportunidades Abertas

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

**Observação:**  
O backend deve armazenar integralmente todos os dados recebidos da resposta da API, incluindo os campos do vetor `data` e os metadados de paginação (`totalRegistros`, `totalPaginas`, `numeroPagina`, `paginasRestantes`, `empty`).  
Os campos de cada contratação a serem persistidos devem seguir os IDs definidos no manual (ex: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 1.9, 1.16, 1.17).

> **Recomendação:** Além desses campos, recomenda-se armazenar todos os demais campos retornados no vetor `data` para garantir flexibilidade futura e aderência total ao manual.

- **totalRegistros:** Total de registros encontrados
- **totalPaginas:** Total de páginas necessárias para a obtenção de todos os registros
- **numeroPagina:** Número da página que a consulta foi realizada
- **paginasRestantes:** Total de páginas restantes
- **empty:** Indicador se o atributo data está vazio

### API 6.5 – Consulta de Atas de Registro de Preço

**Parâmetros de entrada obrigatórios e opcionais:**

- **dataInicial** (Data, obrigatório): Data inicial do período a ser consultado no formato AAAAMMDD.
- **dataFinal** (Data, obrigatório): Data final do período a ser consultado no formato AAAAMMDD.
- **idUsuario** (Inteiro, opcional): Identificador do sistema usuário que publicou a ata.
- **cnpj** (String, opcional): CNPJ do órgão originário da contratação.
- **codigoUnidadeAdministrativa** (String, opcional): Código da Unidade Administrativa do órgão originário da contratação.
- **pagina** (Inteiro, obrigatório): Número da página que se deseja obter os dados.
- **tamanhoPagina** (Inteiro, opcional): Tamanho da página de resultados (até 500 registros).

**Observação:**  
O backend deve armazenar integralmente todos os dados recebidos da resposta da API, incluindo os campos do vetor `data` e os metadados de paginação (`totalRegistros`, `totalPaginas`, `numeroPagina`, `paginasRestantes`, `empty`).  
Os campos de cada ata a serem persistidos devem seguir os IDs definidos no manual (caso especificados) e recomenda-se armazenar todos os demais campos retornados no vetor `data` para garantir flexibilidade futura e aderência total ao manual.

- **totalRegistros:** Total de registros encontrados
- **totalPaginas:** Total de páginas necessárias para a obtenção de todos os registros
- **numeroPagina:** Número da página que a consulta foi realizada
- **paginasRestantes:** Total de páginas restantes
- **empty:** Indicador se o atributo data está vazio

---

## 5. Pontos de Atenção e Detalhes Técnicos

- **Formatação de Datas:** Todos os campos de data devem ser enviados no formato AAAAMMDD, conforme o manual.
- **Paginação:** As APIs retornam dados paginados. O app deve permitir navegação entre páginas e ajustar o tamanho da página (até 500 registros).
- **Tabelas de Domínio:** Modalidade, Modo de Disputa, Situação, etc., devem ser carregadas conforme o manual para garantir consistência dos filtros e tradução dos códigos.
- **Tradução de Códigos:** Sempre que possível, exibir o valor textual dos códigos usando as tabelas de domínio do manual.
- **Filtros Opcionais:** Permitir ao usuário refinar as buscas usando os filtros opcionais disponíveis em cada endpoint.
- **Tratamento de Erros:** Exibir mensagens claras para códigos de erro HTTP (400, 422, 500, etc.).
- **Persistência Completa:** Todos os dados recebidos das APIs devem ser armazenados integralmente no banco de dados, inclusive os metadados de paginação e status.

---

## 6. Referências

- Manual das APIs PNCP (consultar sempre que houver dúvida sobre parâmetros, domínios ou campos de retorno).
- [Documentação Técnica PNCP](https://pncp.gov.br/api/consulta/swagger-ui/index.html)

---

### 6.4.1 - Observação Importante

Além do serviço "6.4. Serviço Consultar Contratações com Período de Recebimento de Propostas em Aberto", o Portal Nacional de Contratações Públicas (PNCP) disponibiliza uma série de outras funcionalidades via API que permitem consultas detalhadas sobre contratações.

**Exemplos de serviços complementares disponíveis:**

- 6.3.5. Consultar uma Contratação
- 6.3.8. Consultar Todos Documentos de uma Contratação
- 6.3.13. Consultar Itens de uma Contratação
- 6.3.14. Consultar Item de uma Contratação
- 6.3.17. Consultar Resultados de Item de uma Contratação
- 6.3.18. Consultar um Resultado específico de Item de uma Contratação
- 6.3.19. Consultar Histórico da Contratação
- 6.3.22. Consultar Imagens de um Item de Contratação

**Recomendação:**  
Para garantir que o app possa evoluir e oferecer funcionalidades avançadas, recomenda-se considerar a integração futura com esses serviços adicionais, conforme detalhado no Manual de Integração do PNCP (disponível em www.gov.br). Isso permitirá consultas mais completas, acesso a documentos, itens, resultados e histórico das contratações, ampliando o valor entregue ao usuário.

---

**Resumo:**  
Este plano garante que todos os dados recebidos das APIs 6.3, 6.4 e 6.5 do PNCP sejam armazenados integralmente no banco de dados, permitindo consultas avançadas, rastreabilidade e evitando perda de informações importantes para o usuário