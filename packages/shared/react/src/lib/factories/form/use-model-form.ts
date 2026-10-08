import { useEffect, useRef, useState } from 'react';

import { SmartUniqueProvider } from './form.factory';
import { SmartFormGroup } from '../../forms/form-group';
import { useFormFactory } from '../../providers/hooks';

export interface IUseModelFormOptions {
  mode?: 'create' | 'update' | 'multiUpdate' | string;
  uniqueProvider?: SmartUniqueProvider;
  /** A form built elsewhere; when set, no form is built from the model. */
  control?: SmartFormGroup | null;
}

/**
 * The form the factory builds for `model`, rebuilt when the model or the
 * mode changes. `null` until the first build settles. A build that settles
 * after a newer one started is dropped.
 */
export function useModelForm<T>(
  model: T | null | undefined,
  options: IUseModelFormOptions = {},
): SmartFormGroup | null {
  const factory = useFormFactory();
  const { mode, control } = options;
  const uniqueProvider = useRef(options.uniqueProvider);
  const [form, setForm] = useState<SmartFormGroup | null>(control ?? null);

  useEffect(() => {
    uniqueProvider.current = options.uniqueProvider;
  });

  useEffect(() => {
    if (control) {
      setForm(control);
      return undefined;
    }

    if (!model) {
      setForm(null);
      return undefined;
    }

    let current = true;

    factory
      .create(model, {
        mode: mode ?? 'create',
        uniqueProvider: uniqueProvider.current
          ? (values) => uniqueProvider.current!(values)
          : undefined,
      })
      .then((result) => {
        if (current) setForm(result);
      });

    return () => {
      current = false;
    };
  }, [factory, model, mode, control]);

  return form;
}
