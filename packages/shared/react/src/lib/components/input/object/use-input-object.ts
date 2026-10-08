import { useMemo } from 'react';

import { IFormOptions } from '../../../models';
import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';

/**
 * What the object field variants share: the input base and the options of the
 * nested form, one tree level deeper, bound to the field's group and to the
 * field's value on the model.
 */
export function useInputObject<T, TChild = unknown>(
  props: SmartInputFieldProps<T>,
) {
  const input = useInput(props);
  const { treeLevel, mode, control, model, fieldKey } = input;

  const childOptions = useMemo<IFormOptions<TChild> | null>(
    () =>
      control
        ? {
            treeLevel: treeLevel + 1,
            mode,
            control,
            model: (model as Record<string, unknown> | undefined)?.[
              fieldKey
            ] as TChild,
            show: true,
          }
        : null,
    [treeLevel, mode, control, model, fieldKey],
  );

  return { ...input, childOptions };
}
