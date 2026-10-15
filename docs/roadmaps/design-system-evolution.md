# Evolução do sistema de design do Koyot

Proposta de **15/10/2026**, derivada da [análise do benchmark](../research/shadcndesign-benchmark-2026-10-15.md). Este documento é um backlog proposto; nenhuma funcionalidade abaixo foi implementada nesta pesquisa.

## Resultado esperado

O designer deve conseguir definir uma marca, editar componentes e aplicações, conferir o resultado e distribuir código funcional com a mesma identidade. Agentes devem operar esse mesmo modelo com alterações identificáveis, validadas e reversíveis.

As prioridades abaixo são sequenciais por dependência, não estimativas de calendário. Esforço é relativo ao checkout atual.

## Fase 0 — Garantir que o exportador entrega o sistema editado

### KDS-01 — Fonte única para preview e exportação

**Prioridade:** P0. **Esforço:** grande. **Entrada:** `shadcnRegistryGenerator.ts`, `systems/koyot`, catálogo e renderer.

Adotar uma implementação canônica de componentes. A escolha inicial recomendada é consolidar Base UI já usada no preview. Suporte a Radix pode ser um adapter futuro, com contrato e validação próprios. Substituir o fallback genérico por implementações reais ou declarar explicitamente “exportação indisponível”.

Começar por Button, Input e Dialog como fatia vertical: ação, formulário e overlay exercitam requisitos diferentes. Empacotar subexports, utilitários, provider de portais, estilos de escopo, fontes e dependências necessárias.

**Aceite:** instalar cada item em um projeto Vite limpo; verificar API, renderização, estados e interação por teclado. Dialog abre, fecha, administra foco e preserva o tema no portal. A comparação deve usar o mesmo conjunto de tokens e overrides do editor. Sem substitutos genéricos apresentados como componente funcional.

### KDS-02 — Um resolver e um contrato CSS

**Prioridade:** P0. **Esforço:** médio/grande. **Depende:** contrato de componentes de KDS-01.

Reutilizar `getUnifiedDesignMetrics` ou seu sucessor em todos os destinos. Eliminar cálculos duplicados de alturas, raio e tipografia. Definir convenção única para cores CSS completas, aliases e mapeamentos Tailwind v4. Resolver a colisão de `--accent` entre semântica shadcn e semântica Koyot por adapter ou namespace explícito.

**Aceite:** preview, CSS copiado e registry produzem valores equivalentes em claro/escuro. Um ajuste posterior de token no consumidor atualiza todos os componentes que o referenciam. O CSS não contém declarações conflitantes e a skill gerada referencia somente arquivos instalados.

### KDS-03 — Documento versionado e cobertura declarada

**Prioridade:** P0. **Esforço:** médio. **Entrada:** `BrandTokens`, `GuidelinePage`, persistência e SDK.

Introduzir versão explícita do schema e migrações a partir do estado v2 do navegador. Distinguir identidade da marca, fundamentos de UI, conteúdo editorial, regras de componentes e composição de páginas. Validar documentos carregados e manter recuperação do original em caso de erro.

Catalogar cada componente por suporte a preview, exportação, partes, variantes, estados e temas. Alinhar `BlockRenderProps` com o renderer. Declarar licença, origem e dependências dos assets/implementações distribuídos.

**Aceite:** abrir um documento antigo preserva dados ou informa o que não pôde migrar; componentes sem cobertura suficiente não recebem status de exportação completa. O SDK possui contrato único e rejeita IDs duplicados ou inválidos.

## Fase 1 — Editar com escopo, reversão e qualidade

### KDS-04 — Regras por escopo e herança

**Prioridade:** P1. **Esforço:** grande. **Depende:** KDS-03.

Separar regras do componente das customizações de instância. Representar `componentId`, `partId`, variante, tamanho, estado, modo e breakpoint como eixos explícitos. Não usar rótulos de demonstração como identificador da API do componente.

Cada campo mostra valor efetivo, origem e ação para retornar à herança. Resolver precedência de modo determinístico e documentá-la antes de acrescentar combinações. Preservar `base + overrides`; evitar persistir todos os valores derivados como cópias.

**Aceite:** editar Button/outline/hover não altera Button/primary/default. Uma exceção de um bloco não se torna regra global por ser o último bloco percorrido. Reset remove a exceção e volta a acompanhar a origem correta.

### KDS-05 — Comandos e histórico transacional

**Prioridade:** P1. **Esforço:** grande. **Depende:** KDS-03; integrar escopos de KDS-04.

Criar uma API de comandos usada pelo Studio, presets, Character Pad, importador e agentes. Cada lote possui ID, origem, revisão base, patches, inversas, data e resumo. A unidade de histórico pode conter várias alterações; gestos contínuos são agrupados.

Reaproveitar componentes de interface já presentes, como `ActionReceipt`, para o resumo do lote. O callback visual de Undo deve chamar o histórico do documento, sem manter um segundo mecanismo independente.

Modelo conceitual, ainda não um schema implementado:

```ts
type ChangeSet = {
  id: string;
  systemId: string;
  baseRevision: number;
  actor: { kind: 'human' | 'agent' | 'import'; id: string };
  operations: BrandOperation[];
  inverseOperations: BrandOperation[];
  status: 'proposed' | 'applied' | 'rejected' | 'undone';
};
```

**Aceite:** uma alteração de IA em múltiplos tokens é desfeita como lote. Se houver edições posteriores sobre os mesmos caminhos, Undo detecta conflito ou aplica inversa segura; nunca restaura um snapshot apagando trabalho posterior. Falhas não deixam mudanças parciais dentro de um lote que prometeu aplicação integral.

### KDS-06 — Relatório de contraste e matriz de controles

**Prioridade:** P1. **Esforço:** médio. **Depende:** KDS-02.

Integrar os utilitários existentes. Comparar candidatos de foreground em vez de usar apenas um limiar de luminância. Classificar combinações pelo tamanho/peso do texto e contexto; compor transparências antes de calcular. Guardar precisão para decidir aprovação e arredondar somente na interface.

Listar pares reprovados com componente, estado, modo e tokens envolvidos. Gradientes, imagens ou fundos sem resolução suficiente devem aparecer como “revisão necessária”. Sugerir troca de texto, variante semântica acessível ou ajuste de superfície; não alterar automaticamente a cor institucional bloqueada.

Mostrar Button/Input/Select/Combobox lado a lado, com alturas herdadas e exceções explícitas. Expor tokens de foco já existentes, depois ampliar forma/espessura/offset quando houver necessidade.

**Aceite:** o exemplo `#808080` não seleciona branco para texto comum. Mudanças são auditadas nos modos suportados. Erros de contraste não são apresentados como certificação WCAG completa. Os mesmos valores de controle aparecem no preview e no projeto instalado. [Referência de contraste textual](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

### KDS-07 — Brand Policies executáveis

**Prioridade:** P1. **Esforço:** grande. **Depende:** KDS-04 e KDS-05.

Modelar proteção de tokens de marca separadamente de permissão para restilizar uma parte. Definir categorias e escopos apropriados ao Koyot; as sete categorias do benchmark são ponto de partida, não obrigação de formato.

O comando de agente é validado no serviço de domínio. O agente não modifica a própria política para contornar bloqueios; alterações de policy passam por fluxo autorizado do responsável. Alterações humanas podem ter regras diferentes, com autoria registrada.

Exportar policy versionada e implementar um consumidor real. Validar por AST as formas suportadas de `className`, `cva` e composição; expressões não analisáveis devem ser reportadas como tal. Evitar um regex que prometa governança completa. Código de componentes/ícones e gráficos pode precisar de exceções com escopo, justificativa e origem.

**Aceite:** a mesma operação bloqueada falha no editor e na entrada de agente. Um pedido misto tem comportamento definido para lote integral. No projeto consumidor, comando de lint retorna erro reproduzível com arquivo, regra, escopo e alternativa permitida. Exportar JSON sem linter não conta como enforcement.

Não presumir que nosso formato será compatível com `@shadcn/lint`; estudar o contrato oficial e provar a interoperabilidade antes de anunciar suporte.

## Fase 2 — Distribuição estável e agentes externos

### KDS-08 — Releases persistidas e instalação verificável

**Prioridade:** P1/P2. **Esforço:** grande. **Depende:** KDS-01 a KDS-03.

Separar registry de desenvolvimento e release publicada. Substituir o `Map` como fonte de publicação por armazenamento durável com sistema, versão, manifesto, hash e compatibilidade. Edições de uma marca não sobrescrevem itens de outra. Consolidar a sincronização duplicada hoje existente no contexto e no modal.

Publicação compila e valida um snapshot; o comando estável resolve uma release identificada e permite fixação de versão. Mostrar arquivos envolvidos na atualização e distinguir falha de salvamento, sincronização e publicação.

**Aceite:** reiniciar o backend preserva releases. Arrastar um controle não altera a release publicada. O consumidor instala o snapshot esperado. Antes de expor hospedagem compartilhada, incluir identidade e autorização nas escritas de registry; a rota local atual não é um serviço multicliente pronto.

### KDS-09 — MCP incremental

**Prioridade:** P2. **Esforço:** médio após o núcleo. **Depende:** KDS-03; escrita depende de KDS-05 e KDS-07.

Primeiro conjunto proposto: `list_brand_systems`, `read_brand_system`, `read_tokens`, `read_component`, `read_policy`, `audit_contrast`, `get_install_manifest`.

Segundo conjunto: `propose_changes`, `apply_changes`, `get_changes`, `undo_changes`. Contratos incluem revisão base, IDs estáveis, erro estruturado e identificador de lote. As ferramentas não recebem acesso genérico ao filesystem ou shell do usuário.

**Aceite:** agente externo consegue responder quais tokens e componentes usar, ler limites e obter instruções de instalação. Na escrita, respeita políticas e produz um lote reversível visível no Studio. Não precisa de 29 ferramentas para demonstrar valor.

### KDS-10 — Skills geradas a partir do contrato

**Prioridade:** P2. **Esforço:** médio. **Depende:** exportação validada e policy real.

Evoluir `generateBrandSkillMd`, sem recriar o mecanismo. Gerar instruções a partir do manifesto da release: setup correto, componentes disponíveis, tokens, exceções, comandos de validação e limitações conhecidas.

Workflows próprios sugeridos: aplicar identidade, criar bloco, montar página e verificar conformidade. A descoberta dos componentes pode ocorrer sob demanda; não enviar todo o catálogo em cada interação.

**Aceite:** uma skill recém-instalada funciona sem imports ausentes ou regras herdadas indevidamente de Lime. Inclui versão do contrato, exemplos permitidos e caminho de verificação. Instruções permanecem complementares à validação executável.

## Fase 3 — Composição e entrada de sistemas existentes

### KDS-11 — Slots tipados, receitas e prévias reais

**Prioridade:** P2/P3. **Esforço:** grande. **Depende:** SDK de KDS-03 e escopos de KDS-04.

Adicionar slots de conteúdo nomeados ao SDK, com tipos aceitos, cardinalidade e defaults. Um marcador `data-slot` de inspeção não substitui esse contrato. Manter instância ligada ao componente ao trocar conteúdo.

Receitas iniciais: apresentação de identidade, guideline editorial, landing page e tela de produto. Compartilhar estilos semânticos de título, texto, superfície e espaçamento. Preservar pranchetas proporcionais para apresentação e fornecer viewport real para aplicações responsivas; reduzir escala de uma prancheta não testa reflow.

**Aceite:** trocar conteúdo de uma aplicação mantém vínculos com tokens. O layout responsivo funciona em larguras reais selecionadas e se comporta igualmente após instalação. Texto longo respeita largura de leitura e fluxo editorial.

### KDS-12 — Importação com relatório de perdas

**Prioridade:** P3. **Esforço:** grande. **Depende:** schema, comandos e resolver.

Começar por JSON de tokens e subconjunto declarado de `globals.css`. Parsear dados, sem executar scripts ou buscar URLs referenciadas durante a leitura. Apresentar valores novos, alterados, preservados e não reconhecidos; resolver referências sem assumir suporte universal de CSS.

**Aceite:** antes de aplicar, é possível inspecionar o diff e as perdas. Aplicar cria um único lote reversível. Tokens desconhecidos não desaparecem silenciosamente. A ampliação para Figma deve publicar uma matriz do que sincroniza, em quais direções e com quais dependências.

### KDS-13 — Assets, revisão compartilhada e colaboração

**Prioridade:** P3. **Esforço:** grande. **Depende:** persistência e releases.

Ampliar os logos pré-definidos com assets de marca próprios, sanitização SVG e metadados de origem. Adicionar compartilhamento somente leitura, revogável, para uma versão explícita ou rascunho vivo claramente identificado. Fork é cópia com origem registrada, sem prometer sincronização automática.

Para múltiplas abas ou pessoas, iniciar com revisão base e detecção de conflito; edição simultânea completa vem depois de medir demanda. Evitar publicação ou sync Figma bidirecional antes de haver controle de versões e relatório de conflitos.

**Aceite:** visitante não altera o documento; link revogado deixa de funcionar. Duas edições concorrentes não sobrescrevem silenciosamente a mesma propriedade. Assets distribuídos possuem direitos e proveniência registrados.

## Critérios para escolher a próxima entrega

### Frente transversal — KDS-14: atualização incremental e observabilidade

**Prioridade:** P1/P2, guiada por medição. **Esforço:** médio. **Depende:** fronteiras estáveis do resolver e do compilador.

Consolidar sincronização, calcular dependências entre tokens/regras e componentes e evitar gerar todos os itens do registry a cada ajuste local. Manter o feedback visual imediato e desacoplar compilação de distribuição. Registrar falhas de persistência hoje silenciosas e mostrar estado de salvamento confiável.

**Aceite:** medir tempo entre gesto e pintura, duração da compilação, volume enviado e quantidade de componentes invalidados. Uma mudança local não recompila itens sem dependência dela. Ajustes globais continuam atualizando todos os consumidores afetados. Definir metas a partir dessas medições; não copiar números de performance anunciados por outro produto.

### Matriz de verificação

| Critério | Evidência de conclusão |
| --- | --- |
| Fidelidade | Mesmo componente, tokens e escopos no canvas e no consumidor. |
| Funcionalidade | Interações e teclado preservados no código instalado. |
| Recuperação | Lote identificável, undo seguro e erro acionável. |
| Governança | Política validada na mutação e no projeto consumidor. |
| Distribuição | Release persistente e manifesto reprodutível. |
| Clareza | Cobertura incompleta e perdas de importação ficam visíveis. |

A primeira entrega recomendada é **KDS-01 + KDS-02 em Button/Input/Dialog**, com o mínimo de KDS-03 necessário para declarar cobertura. Isso produz um caminho completo demonstrável e fornece base para o restante do roadmap.
