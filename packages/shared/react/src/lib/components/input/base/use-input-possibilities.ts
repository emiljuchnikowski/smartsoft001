import { useEffect, useState } from 'react';

import { SmartPossibility } from '../../../models';
import { useSmart } from '../../../providers/smart-context';
import { SmartInputFieldProps } from '../input.types';

/**
 * The options of a field with possibilities (the Angular
 * `InputPossibilitiesBaseComponent`): the ones the model possibilities
 * provider returns, asked again 500 ms after the form's value last changed so
 * they can depend on other fields, or else the ones in the input options.
 * `null` when there are none; the field then falls back to its model's
 * `possibilities`.
 */
export function useInputPossibilities<T = any>({
  options,
}: SmartInputFieldProps<T>): SmartPossibility[] | null {
  const provider = useSmart().modelPossibilitiesProvider;
  const control = options?.control ?? null;
  const fieldKey = options?.fieldKey;
  const model = options?.model;
  const [fromProvider, setFromProvider] = useState<SmartPossibility[] | null>(
    null,
  );

  useEffect(() => {
    if (!provider || !control || !fieldKey) return undefined;

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const refresh = () => {
      Promise.resolve(
        provider.get({
          type: (model as { constructor?: unknown } | undefined)?.constructor,
          key: fieldKey,
          instance: control.parent?.value,
        }),
      ).then((result) => {
        if (active && result) setFromProvider(result);
      });
    };

    refresh();

    const subscription = control.parent?.valueChanges.subscribe(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(refresh, 500);
    });

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      subscription?.unsubscribe();
    };
  }, [provider, control, fieldKey, model]);

  return fromProvider ?? options?.possibilities ?? null;
}
