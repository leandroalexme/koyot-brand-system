import React, { useState, useMemo } from 'react';
import { useBrandSystem } from '../../context/BrandSystemContext';
import { getUnifiedBlockCatalog } from '../../sdk/specimen';
import { BlockCategory, ColumnLayout, BlockType } from '../../types';
import {
  Search,
  X,
  Sparkles,
  Type,
  Palette,
  Layers,
  ShieldAlert,
  FileText,
  Layout,
  Plus,
} from 'lucide-react';

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  identity: 'Identity Block',
  typography: 'Typography Block',
  color: 'Color Block',
  applications: 'Applications Block',
  rules: 'Rules Block',
  content: 'Content Block',
  frame: 'Frame Block',
};

const CATEGORY_ICONS: Record<BlockCategory, React.ComponentType<{ className?: string }>> = {
  identity: Sparkles,
  typography: Type,
  color: Palette,
  applications: Layers,
  rules: ShieldAlert,
  content: FileText,
  frame: Layout,
};

export const AddBlockModal: React.FC = () => {
  const { addBlockModalOpen, setAddBlockModalOpen, handleAddNewRow } =
    useBrandSystem();
  const [selectedCategory, setSelectedCategory] = useState<
    BlockCategory | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCatalog = useMemo(() => {
    return getUnifiedBlockCatalog().filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  if (!addBlockModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
              Adicionar Bloco à Bento Grid
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Escolha uma categoria e insira como 1 Coluna (largura total) ou 2 Colunas (50/50).
            </p>
          </div>
          <button
            onClick={() => setAddBlockModalOpen(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar bloco por nome ou descrição..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 focus:outline-none transition"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              'all',
              'identity',
              'typography',
              'color',
              'applications',
              'rules',
              'content',
              'frame',
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs capitalize transition flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60'
              }`}
            >
              {cat !== 'all' && (
                React.createElement(CATEGORY_ICONS[cat], {
                  className: 'w-3 h-3',
                })
              )}
              <span>{cat === 'all' ? 'Todos os Blocos' : cat}</span>
            </button>
          ))}
        </div>

        {/* Grid of Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredCatalog.map((item) => {
            const Icon = CATEGORY_ICONS[item.category] || Sparkles;
            return (
              <div
                key={item.type}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100/90 dark:hover:bg-zinc-800 transition border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                    <Icon className="w-3 h-3" />
                    <span>{CATEGORY_LABELS[item.category]}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mt-1">
                    {item.label}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-200/40 dark:border-zinc-700/40">
                  <button
                    onClick={() => handleAddNewRow('1-col', item.type)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 text-xs font-medium transition"
                  >
                    1 Coluna
                  </button>
                  <button
                    onClick={() => handleAddNewRow('2-col-50-50', item.type)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600 border border-zinc-200/80 dark:border-zinc-600 text-xs font-medium transition"
                  >
                    2 Colunas
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
