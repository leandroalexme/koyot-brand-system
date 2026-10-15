#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Helper to parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    name: '',
    category: 'mockups',
    layout: '2-col-50-50',
    description: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--name' || arg === '-n') {
      params.name = args[++i];
    } else if (arg === '--category' || arg === '-c') {
      params.category = args[++i];
    } else if (arg === '--layout' || arg === '-l') {
      params.layout = args[++i];
    } else if (arg === '--description' || arg === '-d') {
      params.description = args[++i];
    }
  }

  return params;
}

const params = parseArgs();

if (!params.name) {
  console.log(`
\x1b[35m[Koyot Block Scaffolder]\x1b[0m
Uso:
  npm run create:block -- --name "NomeDoBloco" [opções]

Opções:
  --category, -c    Categoria do bloco ('identity', 'typography', 'color', 'mockups', 'applications', 'rules', 'data') [padrão: 'mockups']
  --layout, -l      Layout inicial ('full', '2-col-50-50', '2-col-66-33', '3-col-33-33-33') [padrão: '2-col-50-50']
  --description, -d Descrição do bloco [opcional]

Exemplo:
  npm run create:block -- --name "BillboardMockup" --category "mockups"
`);
  process.exit(1);
}

// Format Name and Slug
const rawName = params.name.trim();
const componentName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const slug = rawName
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

const category = params.category.toLowerCase();
const layout = params.layout;
const description =
  params.description ||
  `Bloco de apresentação de marca para ${rawName}, reativo aos tokens de design.`;

const targetDir = path.join(rootDir, 'frontend', 'blocks', category);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, `${componentName}.tsx`);

if (fs.existsSync(targetFile)) {
  console.error(`\x1b[31m[Erro] O arquivo já existe em: ${targetFile}\x1b[0m`);
  process.exit(1);
}

const template = `import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getFontClass, getReadableTextColor } from '../../utils/styleUtils';
import { Sparkles, ArrowRight } from 'lucide-react';

export default defineBlock({
  id: '${slug}',
  title: '${rawName}',
  category: '${category}' as any,
  description: '${description}',
  defaultLayout: '${layout}' as any,
  variants: ['Default', 'Minimal'] as const,
  subElements: [
    { id: 'card', label: 'Card Container', category: 'Surfaces' },
    { id: 'headline', label: 'Título / Headline', category: 'Typography' },
    { id: 'badge', label: 'Pílula de Destaque', category: 'Badges' },
    { id: 'action', label: 'Botão de Ação', category: 'Actions' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const isMinimal = activeVariant === 'Minimal';
    const readableText = getReadableTextColor(tokens.primaryColor);

    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 600,
      letterSpacing: \`\${tokens.letterSpacingEm || -0.02}em\`,
    };

    const bodyStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    return (
      <div
        className="w-full h-full flex flex-col justify-between p-7 rounded-[24px] bg-card border border-border/70 overflow-hidden select-none relative group transition-all"
        style={{
          borderRadius: \`\${Math.max(16, tokens.radiusPx + 4)}px\`,
        }}
      >
        {/* Header do Bloco */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('badge');
              }}
              className={\`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all cursor-pointer \${
                selectedSubElementId === 'badge'
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }\`}
              style={{
                backgroundColor: tokens.primaryColor,
                color: readableText,
              }}
            >
              ${rawName}
            </span>
          </div>

          <span className="text-xs font-mono text-muted-foreground/80 px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
            {activeVariant}
          </span>
        </div>

        {/* Corpo do Bloco */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('card');
          }}
          className={\`my-auto p-6 rounded-[18px] bg-muted/30 border border-border/40 transition-all cursor-pointer relative overflow-hidden \${
            selectedSubElementId === 'card'
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              : ''
          }\`}
        >
          <h3
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.('headline');
            }}
            className={\`text-xl tracking-tight text-foreground transition-all \${
              selectedSubElementId === 'headline'
                ? 'underline decoration-primary decoration-2 underline-offset-4'
                : ''
            }\`}
            style={headingStyle}
          >
            {isMinimal ? '${rawName}' : tokens.brandName}
          </h3>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2" style={bodyStyle}>
            ${description}
          </p>

          {!isMinimal && (
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('action');
                }}
                className={\`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm \${
                  selectedSubElementId === 'action'
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : ''
                }\`}
                style={{
                  backgroundColor: tokens.primaryColor,
                  color: readableText,
                  borderRadius: \`\${tokens.radiusPx}px\`,
                }}
              >
                <span>Explorar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Rodapé do Bloco */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40 z-10">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Preset: {tokens.presetId}</span>
          </div>
          <span className="font-mono text-[11px]">Raio: {tokens.radiusPx}px</span>
        </div>
      </div>
    );
  },
});
`;

fs.writeFileSync(targetFile, template, 'utf-8');

console.log(`
\x1b[32m✔ Bloco criado com sucesso!\x1b[0m
  Arquivo: \x1b[36mfrontend/blocks/${category}/${componentName}.tsx\x1b[0m
  Slug ID: \x1b[33m${slug}\x1b[0m
  Categoria: \x1b[33m${category}\x1b[0m

O bloco foi automaticamente registrado no catálogo e já está pronto para uso no canvas!
`);
