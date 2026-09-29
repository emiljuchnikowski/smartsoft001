import { NgComponentOutlet } from '@angular/common';
import {
  afterRenderEffect,
  OutputRef,
  OutputRefSubscription,
  Signal,
} from '@angular/core';

/** Where a forwarded value goes: a wrapper output, or a wrapper model. */
export type OutletOutputTarget =
  { emit(value: never): void } | { set(value: never): void };

/**
 * Re-emits the outputs of the component an `NgComponentOutlet` renders.
 *
 * The wrappers render a custom implementation registered through their
 * `*_STANDARD_COMPONENT_TOKEN` with `NgComponentOutlet`, which passes inputs
 * only: without this, the wrapper's outputs stay silent as soon as a custom
 * implementation replaces the standard one. Each key of `targets` names an
 * output (or a model) of the rendered component; its value is the wrapper
 * output to emit, or the wrapper model to set. Outputs the rendered component
 * does not have are skipped. Call it in an injection context, typically the
 * wrapper's constructor. Declare the query as a class field
 * (`private readonly outlet = viewChild(NgComponentOutlet)`) and pass it in:
 * Angular only recognises signal queries declared as fields.
 */
export function forwardOutletOutputs(
  outlet: Signal<NgComponentOutlet | undefined>,
  targets: Record<string, OutletOutputTarget>,
): void {
  // After render, not a plain effect: the query can resolve before the outlet
  // has created its component, and `componentInstance` is not a signal, so a
  // plain effect would read null once and never run again.
  afterRenderEffect((onCleanup) => {
    const instance = outlet()?.componentInstance as Record<
      string,
      unknown
    > | null;

    if (!instance) return;

    const subscriptions: OutputRefSubscription[] = [];

    for (const [name, target] of Object.entries(targets)) {
      const source = instance[name] as Partial<OutputRef<never>> | undefined;

      if (typeof source?.subscribe !== 'function') continue;

      subscriptions.push(
        source.subscribe((value) =>
          'emit' in target ? target.emit(value) : target.set(value),
        ),
      );
    }

    onCleanup(() => subscriptions.forEach((sub) => sub.unsubscribe()));
  });
}
