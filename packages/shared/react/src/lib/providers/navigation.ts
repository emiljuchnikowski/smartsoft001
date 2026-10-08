import type { ComponentType, ReactNode } from 'react';

export interface ISmartLinkProps {
  href: string;
  className?: string;
  children?: ReactNode;
  'aria-current'?: 'page' | undefined;
  onClick?: (event: { preventDefault(): void }) => void;
}

/**
 * How the components move between pages. The library does not depend on a
 * router: give `SmartProvider` an adapter for the one the application uses
 * (React Router, Next.js, ...). The default one drives `window.history`.
 */
export interface ISmartNavigation {
  navigate(url: string, options?: { replace?: boolean }): void;
  back(): void;
  /** The current path and query string. */
  getCurrentUrl(): string;
  /** Calls `listener` with the new URL after every navigation. */
  subscribe(listener: (url: string) => void): () => void;
  /**
   * Renders internal links (e.g. React Router's `Link`). Without it the
   * components render a plain `<a href>`.
   */
  linkComponent?: ComponentType<ISmartLinkProps>;
}

/** Navigation through `window.history`, for applications without a router. */
export function createHistoryNavigation(): ISmartNavigation {
  const listeners = new Set<(url: string) => void>();
  const current = () =>
    typeof window === 'undefined'
      ? '/'
      : window.location.pathname + window.location.search;
  const emit = () => {
    const url = current();

    for (const listener of [...listeners]) listener(url);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', emit);
  }

  return {
    navigate(url, options) {
      if (typeof window === 'undefined') return;

      if (options?.replace) window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);

      emit();
    },
    back() {
      if (typeof window !== 'undefined') window.history.back();
    },
    getCurrentUrl: current,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
