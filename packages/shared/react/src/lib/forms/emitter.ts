export interface SmartSubscription {
  unsubscribe(): void;
}

/**
 * A minimal synchronous event source with the `subscribe` shape of an RxJS
 * observable, so code ported from the Angular library (`valueChanges`,
 * `statusChanges`) keeps reading the same way without pulling RxJS in.
 */
export class SmartEmitter<T> {
  private readonly listeners = new Set<(value: T) => void>();

  get observed(): boolean {
    return this.listeners.size > 0;
  }

  subscribe(listener: (value: T) => void): SmartSubscription {
    this.listeners.add(listener);

    return {
      unsubscribe: () => {
        this.listeners.delete(listener);
      },
    };
  }

  emit(value: T): void {
    // A listener may subscribe or unsubscribe others while it runs (the form
    // factory adds and removes controls from inside `valueChanges`), so the
    // emission iterates over the set as it was when the event started.
    for (const listener of [...this.listeners]) {
      listener(value);
    }
  }
}
