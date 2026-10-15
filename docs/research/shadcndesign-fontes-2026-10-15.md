# Inventário das fontes — shadcndesign

Consulta em **15/10/2026**. Este inventário acompanha a [análise crítica](./shadcndesign-benchmark-2026-10-15.md). As anotações são paráfrases curtas; as páginas originais continuam sendo a referência.

## Cobertura e método

Foram percorridos o [índice oficial](https://www.shadcndesign.com/docs), seus **40 destinos de documentação/licenciamento**, os **quatro artigos solicitados** e **um artigo complementar** necessário para atualizar o benchmark. Links externos citados pelas páginas, catálogos individuais de componentes, Academy, páginas comerciais e todo o histórico do blog não foram integralmente percorridos.

A consulta utilizou texto público extraído das páginas e resultados oficiais indexados. Falhas de abertura direta foram contornadas por links internos, referências já abertas e busca no domínio. A página Share foi recuperada por resultado indexado antigo; a atualização de 11/10 prevalece nos pontos alterados. Nenhum teste autenticado do serviço ou inspeção de recursos pagos foi feito.

## Documentação: Figma Kit

| ID | Fonte | Ponto aproveitável para o Koyot |
| --- | --- | --- |
| D01 | [Getting started](https://www.shadcndesign.com/docs/getting-started) | Onboarding progressivo e escolha prévia de bibliotecas para reduzir peso. |
| D02 | [Styles](https://www.shadcndesign.com/docs/styles) | Separar estrutura, tema de marca e modo claro/escuro. |
| D03 | [Variables](https://www.shadcndesign.com/docs/variables) | Camadas de primitivas, semântica e componentes; referências com origem rastreável e identificação de versão. |
| D04 | [Typeset](https://www.shadcndesign.com/docs/typeset) | Prosa como sistema: medida de leitura, fluxo vertical e escala independente. |
| D05 | [Theming](https://www.shadcndesign.com/docs/theming) | Aplicar marca nos tokens centrais e preservar composição; suportar múltiplas marcas. |
| D06 | [Components](https://www.shadcndesign.com/docs/components) | Slots, propriedades expostas e correspondência entre variáveis e implementação. |
| D07 | [Icons](https://www.shadcndesign.com/docs/icons) | Escolha explícita da biblioteca; consistência de grade, imports e metadados. |
| D08 | [Development](https://www.shadcndesign.com/docs/development) | Handoff de tokens e componentes em vez de especificações visuais isoladas. |
| D09 | [Updates](https://www.shadcndesign.com/docs/updates) | Migração seletiva preserva customizações; versão de kit não é atualização automática do arquivo Figma. |

## Documentação: Registry

| ID | Fonte | Ponto aproveitável para o Koyot |
| --- | --- | --- |
| D10 | [Pro Blocks](https://www.shadcndesign.com/docs/pro-blocks) | Registry escolhe implementação Radix/Base UI pelo estilo do consumidor; compatibilidade precisa ser declarada. |
| D11 | [Templates](https://www.shadcndesign.com/docs/templates) | Templates possuem requisitos próprios; a página declara ausência de variantes Base UI nesse produto. |
| D12 | [Themes](https://www.shadcndesign.com/docs/themes) | Distribuir tema separado de componentes; declarar carregamento de fontes necessário. |

## Documentação: Plugin

| ID | Fonte | Ponto aproveitável para o Koyot |
| --- | --- | --- |
| D13 | [Introduction](https://www.shadcndesign.com/docs/plugin) | Detectar estrutura e versão automaticamente, com override explícito quando necessário. |
| D14 | [Generate code](https://www.shadcndesign.com/docs/generating-code) | Destino inclui framework, biblioteca e formato; gerar fragmentos modulares facilita verificação. |
| D15 | [Manage variables](https://www.shadcndesign.com/docs/variables-management) | Import/export bidirecional; exportação completa ou apenas alterações; detecção de defaults por versão. |
| D16 | [Plugin Typeset](https://www.shadcndesign.com/docs/plugin-typeset) | Transformações determinísticas de tokens não precisam de geração por IA. |
| D17 | [Select and install Pro Blocks](https://www.shadcndesign.com/docs/plugin-pro-blocks) | Seleção de elemento resolve identidade do bloco e comando de instalação. |
| D18 | [Security](https://www.shadcndesign.com/docs/plugin-security) | Documentar dados enviados, retenção e limites de acesso por produto. |

O texto de Security trata do plugin e de seu backend. Ele não deve ser generalizado para o DS Manager: o agente do DS Manager possui outro fluxo de credenciais, descrito em sua própria documentação. As afirmações de segurança são declarações do fornecedor, sem auditoria independente nesta pesquisa.

## Documentação: Skills

| ID | Fonte | Ponto aproveitável para o Koyot |
| --- | --- | --- |
| D19 | [Agent Skills](https://www.shadcndesign.com/docs/agent-skills) | Dez workflows agrupados em design, conversão e blocos; setup, seleção, composição e verificação são tarefas distintas. |

Os nomes antigos `generate-code` e `import-variables` foram substituídos por `shadcn-design-figma-to-code` e `shadcn-design-import-style`. As skills comerciais em si não foram baixadas: esta análise considera suas descrições públicas, não uma auditoria das instruções internas.

## Documentação: DS Manager

| ID | Fonte | Ponto aproveitável para o Koyot |
| --- | --- | --- |
| D20 | [DS Manager](https://www.shadcndesign.com/docs/ds-manager) | Modelo integrado de edição, preview, registry e consumo. |
| D21 | [Quickstart](https://www.shadcndesign.com/docs/ds-manager-quickstart) | Jornada curta até instalação; importação CSS apresenta diff e itens não aproveitados. |
| D22 | [Interface tour](https://www.shadcndesign.com/docs/ds-manager-interface) | Busca por exports, árvore de partes, feedback de salvamento e atalhos contextuais. |
| D23 | [Styles and icons](https://www.shadcndesign.com/docs/ds-manager-styles-icons) | Preservar overrides ao trocar estilo e avisar quais deixam de se aplicar. |
| D24 | [Colors and tokens](https://www.shadcndesign.com/docs/ds-manager-colors) | Pares claro/escuro, nomes validados, contraste contextual, custom colors e gradients. |
| D25 | [Typography](https://www.shadcndesign.com/docs/ds-manager-typography) | Papéis de fonte, URLs/uploads e entrega de fonte diferenciada por origem. Recuperada por indexação oficial. |
| D26 | [Radius, spacing and shadow](https://www.shadcndesign.com/docs/ds-manager-radius-spacing-shadow) | Seed, escala derivada, override local e retorno à herança. |
| D27 | [Controls](https://www.shadcndesign.com/docs/ds-manager-controls) | Família de alturas, foco global e exceções sinalizadas. |
| D28 | [Brand](https://www.shadcndesign.com/docs/ds-manager-brand) | Logo, símbolo e favicon com preview contextual e sanitização SVG. Recuperada por indexação oficial. |
| D29 | [Editing components](https://www.shadcndesign.com/docs/ds-manager-components) | Parte selecionada, regra responsável pelo valor e visibilidade de alterações. |
| D30 | [Variants and states](https://www.shadcndesign.com/docs/ds-manager-variants) | Eixos estruturados; variantes novas são exportadas como API real do componente. |
| D31 | [Breakpoints](https://www.shadcndesign.com/docs/ds-manager-breakpoints) | Preview em largura real, herança entre tamanhos e reset ao valor herdado. |
| D32 | [Custom components](https://www.shadcndesign.com/docs/ds-manager-custom-components) | Checks antes de aceitar código; drafts ficam fora da publicação. |
| D33 | [ProBlocks](https://www.shadcndesign.com/docs/ds-manager-problocks) | Estilos compartilhados de seção e especializações locais; blocos usam componentes do próprio sistema. |
| D34 | [Design agent](https://www.shadcndesign.com/docs/ds-manager-agent) | Agente atua no modelo editável, recebe seleção contextual e apresenta resumo reversível. |
| D35 | [MCP server](https://www.shadcndesign.com/docs/ds-manager-mcp) | API de domínio para agentes externos, inspeção textual e revisões para fluxos definidos. |
| D36 | [Lint locks](https://www.shadcndesign.com/docs/ds-manager-lint) | Policy, níveis de severidade, herança e feedback reproduzível de bloqueios. |
| D37 | [Publish and install](https://www.shadcndesign.com/docs/ds-manager-publish) | Edição e release são estados distintos; publicação incrementa versão. |
| D38 | [Share links and forks](https://www.shadcndesign.com/docs/ds-manager-share) | Visualização somente leitura, revogação de link e fork independente. Texto indexado anterior à atualização de 11/10. |
| D39 | [Plans and limits](https://www.shadcndesign.com/docs/ds-manager-plans) | Separar capacidades, consumo de IA e continuidade de sistemas já publicados. |

A descrição pública de Typography recuperada estava menos atualizada que o artigo de Controls, que também documenta expansão da escala tipográfica. Para compartilhamento, a documentação indexada ainda omitia custom components; o artigo de 11/10 confirma sua inclusão. Esses conflitos estão tratados pela cronologia abaixo.

## Documentação: licenciamento

| ID | Fonte | Ponto relevante |
| --- | --- | --- |
| D40 | [Licensing agreement](https://www.shadcndesign.com/licensing) | Restrições de redistribuição e de uso de DS Manager/outputs em ferramenta concorrente; não confundir com MIT do shadcn/ui. |

## Artigos solicitados e complemento

| ID | Artigo e data publicada | Contribuição para a análise |
| --- | --- | --- |
| B01 | [Agent Skills and Figma Slots — 12/03/2026](https://www.shadcndesign.com/blog/agent-skills-and-figma-slots-update) | Slots preservam instâncias; workflows de design/código passaram a fazer parte do ecossistema. |
| B02 | [DS Manager launch — 29/09/2026](https://www.shadcndesign.com/blog/shadcn-ui-design-system-manager) | Tese do produto: editar vendo o resultado e instalar o sistema. |
| B03 | [ProBlocks, Lint and custom components — 04/10/2026](https://www.shadcndesign.com/blog/shadcn-design-system-blocks-lint-custom-components) | Marco de 205 blocos, governança e componentes próprios. |
| B04 | [Application/e-commerce, Controls and import — 11/10/2026](https://www.shadcndesign.com/blog/shadcn-app-ecommerce-blocks-controls-theme-import) | Complemento: 337 blocos, Controls, importação com review e compartilhamento ampliado. |
| B05 | [DS Manager MCP server — 15/10/2026](https://www.shadcndesign.com/blog/ds-manager-mcp-server) | Agentes externos, integração Figma por conexão do agente e handoff de instalação. |

## Correções temporais e ressalvas

1. **Catálogo:** 205/24 categorias descreve o lançamento dos blocos; 337/48 categorias é a informação mais recente consultada. São recortes temporais diferentes.
2. **Oferta Lifetime:** anúncios antigos mostram venda; a documentação atual diz que não está mais à venda. Não usar preço antigo para orientar decisão de compra.
3. **Compartilhamento:** custom components aparecem no fluxo atualizado, exceto drafts; a versão indexada mais antiga da página Share ainda dizia que não apareciam.
4. **Modelos de IA:** listas mudam entre artigos e docs. Não foram usadas como critério de arquitetura nem recomendação de contratação.
5. **Performance:** o artigo de 04/10 relata redução de latência do canvas. É medição declarada pelo fornecedor, sem reprodução nesta pesquisa.
6. **Limites de edição:** locks de componentes padrão não equivalem a governança universal de todos os blocos e tokens.
7. **Propriedade de código:** “ser baseado em shadcn/ui” não torna todo o conteúdo comercial redistribuível.

## Fontes técnicas complementares

- [W3C: WCAG 2.2 — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): limiares por contexto e comparação sem arredondamento.
- [W3C: WCAG 2.2 — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): contraste de informação visual em componentes e gráficos; não confundir com contraste de texto.

## Materiais do outro agente

- Texto colado: `/Users/leandroalex/.codex/attachments/2eac78cd-1046-4b12-91a2-6877323ea571/Texto colado.txt`.
- Relatório: `/Users/leandroalex/.gemini/antigravity/brain/eff7405b-2d36-48a7-90f9-28a10f9d1d1c/benchmarking-shadcndesign-koyot.md`.

Os dois foram lidos como análises de terceiros e confrontados com fontes oficiais e código local. Não foram tratados como prova da implementação atual do Koyot.
