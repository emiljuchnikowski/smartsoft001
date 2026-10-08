export interface SmartSubscription {
  unsubscribe(): void;
}

/**
 * A minimal synchronous event source: `subscribe` returns a handle with
 * `unsubscribe()`, and `emit` calls every listener in turn. The controls'
 * `valueChanges`, `statusChanges` and `changes` are built on it, so the forms
 * need no reactive-streams library.
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
