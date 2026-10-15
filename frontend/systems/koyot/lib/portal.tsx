'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const KoyotPortalContext = createContext<HTMLElement | null | undefined>(
  undefined
);

export function KoyotPortalProvider({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <KoyotPortalContext.Provider value={container}>
      {children}
      <div ref={setContainer} data-koyot-portal="" />
    </KoyotPortalContext.Provider>
  );
}

let fallback: HTMLElement | null = null;

function fallbackContainer() {
  if (fallback && fallback.isConnected) return fallback;
  fallback = document.createElement('div');
  fallback.className = 'koyot lime';
  fallback.setAttribute('data-system', 'koyot');
  fallback.setAttribute('data-koyot-portal', 'fallback');
  document.body.appendChild(fallback);
  return fallback;
}

export function useKoyotPortal() {
  const scoped = useContext(KoyotPortalContext);
  const [own, setOwn] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (scoped === undefined) setOwn(fallbackContainer());
  }, [scoped]);
  return scoped === undefined ? own : scoped;
}

export const LimePortalProvider = KoyotPortalProvider;
export const useLimePortal = useKoyotPortal;
