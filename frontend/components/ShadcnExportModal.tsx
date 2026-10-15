import React, { useState, useEffect } from 'react';
import {
  BrandTokens,
  SubElementStyleOverrides,
} from '../types';
import {
  ShadcnPrimitiveId,
  SHADCN_PRIMITIVES_CATALOG,
  generatePrimitiveTsxCode,
  generateBrandGlobalsCss,
  generateBrandSkillMd,
  buildShadcnRegistryItem,
} from '../utils/shadcnRegistryGenerator';
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode2,
  Palette,
  Braces,
  Sparkles,
} from 'lucide-react';

interface ShadcnExportModalProps {
  primitiveId: ShadcnPrimitiveId | 'all';
  tokens: BrandTokens;
  allPrimitiveOverrides: Record<
    string,
    Record<string, SubElementStyleOverrides>
  >;
  onClose: () => void;
  onChangePrimitiveId: (next: ShadcnPrimitiveId | 'all') => void;
}

export const ShadcnExportModal: React.FC<ShadcnExportModalProps> = ({
  primitiveId,
  tokens,
  allPrimitiveOverrides,
  onClose,
  onChangePrimitiveId,
}) => {
  const [pkgManager, setPkgManager] = useState<'npx' | 'pnpm' | 'bunx'>('npx');
  const [activeTab, setActiveTab] = useState<'tsx' | 'css' | 'skill' | 'json'>(
    'tsx'
  );
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [registrySynced, setRegistrySynced] = useState(false);

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:5174';

  const registryUrl = `${origin}/r/${primitiveId}.json`;

  const cliPrefix =
    pkgManager === 'pnpm'
      ? 'pnpm dlx shadcn@latest add'
      : pkgManager === 'bunx'
      ? 'bunx --bun shadcn@latest add'
      : 'npx shadcn@latest add';

  const cliCommand = `${cliPrefix} "${registryUrl}"`;

  const selectedMeta =
    primitiveId === 'all'
      ? null
      : SHADCN_PRIMITIVES_CATALOG.find((m) => m.id === primitiveId) ||
        SHADCN_PRIMITIVES_CATALOG[0];

  const tsxCode =
    primitiveId === 'all'
      ? generatePrimitiveTsxCode(
          'button',
          tokens,
          allPrimitiveOverrides['button'] || {}
        )
      : generatePrimitiveTsxCode(
          primitiveId,
          tokens,
          allPrimitiveOverrides[primitiveId] || {}
        );

  const globalsCss = generateBrandGlobalsCss(tokens);
  const skillMd = generateBrandSkillMd(tokens);
  const registryJsonObj = buildShadcnRegistryItem(
    primitiveId,
    tokens,
    allPrimitiveOverrides
  );
  const registryJsonString = JSON.stringify(registryJsonObj, null, 2);

  // Sync live registry items to backend `/r/sync` whenever modal opens or tokens/overrides change
  useEffect(() => {
    let cancelled = false;
    const syncToBackend = async () => {
      try {
        const itemsPayload: Record<string, any> = {
          all: buildShadcnRegistryItem('all', tokens, allPrimitiveOverrides),
        };
        for (const item of SHADCN_PRIMITIVES_CATALOG) {
          itemsPayload[item.id] = buildShadcnRegistryItem(
            item.id,
            tokens,
            allPrimitiveOverrides
          );
        }
        const res = await fetch('/r/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsPayload }),
        });
        if (res.ok && !cancelled) {
          setRegistrySynced(true);
        }
      } catch {
        // ignore if offline
      }
    };
    syncToBackend();
    return () => {
      cancelled = true;
    };
  }, [tokens, allPrimitiveOverrides]);

  const displayedCode =
    activeTab === 'tsx'
      ? tsxCode
      : activeTab === 'css'
      ? globalsCss
      : activeTab === 'skill'
      ? skillMd
      : registryJsonString;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 1600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1600);
  };

  const handleDownloadFile = () => {
    const filename =
      activeTab === 'tsx'
        ? `${primitiveId === 'all' ? 'button' : primitiveId}.tsx`
        : activeTab === 'css'
        ? 'tokens.css'
        : activeTab === 'skill'
        ? 'SKILL.md'
        : `${primitiveId}-registry.json`;

    const blob = new Blob([displayedCode], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111113] text-white border border-white/10 rounded-[28px] max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: tokens.primaryColor }}
            >
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white truncate">
                  {primitiveId === 'all'
                    ? `${tokens.brandName} — Complete Shadcn Registry`
                    : `Install Personalized ${selectedMeta?.name}`}
                </h3>
                {registrySynced && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Registry Live
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                Instale via CLI oficial do shadcn/ui ou copie o código-fonte `.tsx` e `globals.css`
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={primitiveId}
              onChange={(e) => onChangePrimitiveId(e.target.value as any)}
              className="h-8 px-2.5 rounded-xl bg-[#1E1E22] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All 20 Primitives (Full System)</option>
              {SHADCN_PRIMITIVES_CATALOG.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.id}.tsx)
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1E1E22] hover:bg-[#2A2A30] text-zinc-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CLI Installation Box */}
        <div className="px-6 pt-5 pb-4 bg-[#161619] border-b border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#222226] p-1 rounded-xl">
              {(['npx', 'pnpm', 'bunx'] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPkgManager(pm)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                    pkgManager === pm
                      ? 'bg-[#36363C] text-white font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-zinc-400">
              Injeta <code className="text-zinc-200">cssVars</code> + cria{' '}
              <code className="text-zinc-200">
                components/ui/{primitiveId === 'all' ? '*.tsx' : `${primitiveId}.tsx`}
              </code>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-[#0C0C0E] border border-white/10 rounded-2xl px-4 py-3">
            <code className="text-xs font-mono text-emerald-400 truncate select-all">
              {cliCommand}
            </code>
            <button
              type="button"
              onClick={handleCopyCli}
              className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium flex items-center gap-1.5 shrink-0 transition"
            >
              {copiedCli ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy CLI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* File Tabs Bar */}
        <div className="px-6 py-2.5 bg-[#141417] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('tsx')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ${
                activeTab === 'tsx'
                  ? 'bg-[#2A2A30] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>
                components/ui/{primitiveId === 'all' ? 'button' : primitiveId}.tsx
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ${
                activeTab === 'css'
                  ? 'bg-[#2A2A30] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>tokens.css</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('skill')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ${
                activeTab === 'skill'
                  ? 'bg-[#2A2A30] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SKILL.md</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition ${
                activeTab === 'json'
                  ? 'bg-[#2A2A30] text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Braces className="w-3.5 h-3.5" />
              <span>registry-item.json</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-[#222227] hover:bg-[#2C2C32] text-xs text-zinc-200 flex items-center gap-1.5 transition"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadFile}
              className="px-3 py-1.5 rounded-xl bg-[#222227] hover:bg-[#2C2C32] text-xs text-zinc-200 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0B0B0D] font-mono text-xs leading-relaxed text-zinc-300">
          <pre className="whitespace-pre-wrap break-words">{displayedCode}</pre>
        </div>
      </div>
    </div>
  );
};
