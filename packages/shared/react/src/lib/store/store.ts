import { useCallback, useSyncExternalStore } from 'react';

/**
 * A tiny external store: one value, replaced immutably, observed through
 * `subscribe`. The services that hold UI state (toasts, alerts, modals, menu,
 * app buttons) and the CRUD feature state are built on it, and React reads
 * them with `useStore`, so a change re-renders exactly the components that
 * read it, the way a signal or an NgRx selector did in the Angular library.
 */
export class SmartStore<T> {
  private state: T;
  private readonly listeners = new Set<() => void>();

  constructor(initial: T) {
    this.state = initial;
  }

  get(): T {
    return this.state;
  }

  set(next: T): void {
    if (Object.is(next, this.state)) return;

    this.state = next;

    for (const listener of [...this.listeners]) listener();
  }

  update(updater: (current: T) => T): void {
    this.set(updater(this.state));
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };
}

/** Reads `store` (or a slice of it) and re-renders when it changes. */
export function useStore<T>(store: SmartStore<T>): T;
export function useStore<T, S>(
  store: SmartStore<T>,
  selector: (state: T) => S,
): S;
export function useStore<T, S>(
  store: SmartStore<T>,
  selector?: (state: T) => S,
): T | S {
  const getSnapshot = useCallback(
    () => (selector ? selector(store.get()) : store.get()),
    [store, selector],
  );

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
