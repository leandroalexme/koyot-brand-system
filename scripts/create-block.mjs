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
  npm run create:block -- --name "PackagingMockup" --category "mockups"
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
  `Mockup visual e editorial de ${rawName}, reativo aos tokens de design.`;

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
import { getReadableTextColor } from '../../utils/styleUtils';

export default defineBlock({
  id: '${slug}',
  title: '${rawName}',
  category: '${category}' as any,
  description: '${description}',
  defaultLayout: '${layout}' as any,
  variants: ['Default', 'Brand Surface', 'Dark'] as const,
  subElements: [
    { id: 'headline', label: 'Headline Principal', category: 'Typography' },
    { id: 'subtext', label: 'Texto Descritivo', category: 'Typography' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const isBrandSurface = activeVariant === 'Brand Surface';
    const isDarkMode = activeVariant === 'Dark' || isDark;

    const brandColor = tokens.primaryColor;
    const accentColor = tokens.accentColor || brandColor;

    // Fundo do Bloco: Branco puro, fundo sutil de token ou superfície escura (Zero sombras)
    const bgColor = isBrandSurface
      ? accentColor
      : isDarkMode
      ? '#09090b'
      : '#ffffff';

    const textColor = isBrandSurface
      ? getReadableTextColor(accentColor)
      : isDarkMode
      ? '#f4f4f5'
      : '#09090b';

    const subtleTextColor = isBrandSurface
      ? \`\${textColor}99\`
      : isDarkMode
      ? '#a1a1aa'
      : '#71717a';

    const borderColor = isBrandSurface
      ? \`\${textColor}20\`
      : isDarkMode
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(0,0,0,0.06)';

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
        className="w-full h-full flex flex-col justify-between p-8 sm:p-10 rounded-[24px] overflow-hidden select-none transition-colors duration-200 border border-border/40"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: \`\${Math.max(20, tokens.radiusPx + 4)}px\`,
        }}
      >
        {/* Topo Sutil Editorial (Sem badges de debug) */}
        <div
          className="flex items-center justify-between pb-6 border-b text-[10px] font-mono tracking-[0.2em] uppercase"
          style={{ borderColor, color: subtleTextColor }}
        >
          <span>{tokens.brandName} // ${rawName}</span>
          <span className="font-semibold" style={{ color: isBrandSurface ? textColor : brandColor }}>
            Editorial Showcase
          </span>
        </div>

        {/* Conteúdo Central Direto na Prancheta (Sem card-in-card, sem sombras) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('headline');
          }}
          className={\`my-auto py-8 cursor-pointer transition-all \${
            selectedSubElementId === 'headline' ? 'opacity-80' : ''
          }\`}
        >
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
            style={headingStyle}
          >
            {tokens.brandName}
          </h2>

          <p
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.('subtext');
            }}
            className="text-sm sm:text-base mt-3 max-w-md leading-relaxed"
            style={{ ...bodyStyle, color: subtleTextColor }}
          >
            ${description}
          </p>
        </div>

        {/* Rodapé Tipográfico Limpo */}
        <div
          className="flex items-center justify-between pt-6 border-t text-[11px] font-mono"
          style={{ borderColor, color: subtleTextColor }}
        >
          <span>TYPOGRAPHY: {tokens.headingFont}</span>
          <span className="uppercase">GRID: {tokens.scale || 'DEFAULT'}</span>
        </div>
      </div>
    );
  },
});
`;

fs.writeFileSync(targetFile, template, 'utf-8');

console.log(`
\x1b[32m✔ Bloco ultra-minimalista criado com sucesso!\x1b[0m
  Arquivo: \x1b[36mfrontend/blocks/${category}/${componentName}.tsx\x1b[0m
  Slug ID: \x1b[33m${slug}\x1b[0m
  Categoria: \x1b[33m${category}\x1b[0m

O bloco foi automaticamente registrado no catálogo e já está pronto para uso no canvas!
`);
