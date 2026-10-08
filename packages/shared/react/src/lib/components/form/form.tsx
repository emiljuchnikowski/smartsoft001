import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

import { SmartFormBaseProps, SmartFormProps } from './form.types';
import { SmartFormStandard } from './standard/form-standard';
import { SmartUniqueProvider } from '../../factories/form/form.factory';
import { useModelForm } from '../../factories/form/use-model-form';
import { SmartFormGroup } from '../../forms/form-group';
import { IFormOptions } from '../../models';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Set inside a `SmartForm`, so a form nested in it (an `object` or `array`
 * field) does not render a `<form>` inside a `<form>`, which HTML forbids.
 */
const SmartFormNestingContext = createContext(false);

type SmartFormOutputs<T> = Pick<
  SmartFormProps<T>,
  'onValueChange' | 'onValuePartialChange' | 'onValidChange'
>;

/**
 * The Angular `registerChanges`: after every change of `form` emits its
 * validity, its value and the values of its dirty controls (`*Confirm` left
 * out), then runs one update so the current state is emitted at once. Only the
 * form currently rendered emits; the callbacks of the latest render are used.
 */
function useRegisterChanges<T>(
  form: SmartFormGroup | null,
  outputs: SmartFormOutputs<T>,
): void {
  const latest = useRef(outputs);

  useEffect(() => {
    latest.current = outputs;
  });

  useEffect(() => {
    if (!form) return undefined;

    const subscription = form.valueChanges.subscribe(() => {
      latest.current.onValidChange?.(form.valid);
      latest.current.onValueChange?.(form.value as T);

      const partialModel: Record<string, unknown> = {};

      Object.keys(form.controls)
        .filter((key) => !key.endsWith('Confirm') && form.controls[key].dirty)
        .forEach((key) => {
          partialModel[key] = form.controls[key].value;
        });

      latest.current.onValuePartialChange?.(partialModel as Partial<T>);
    });

    form.updateValueAndValidity();

    return () => subscription.unsubscribe();
  }, [form]);
}

/**
 * The Angular `loading$` subscription: the form is disabled while `loading`
 * is `true` and enabled again once it is `false`. Without `loading` the form
 * is left alone.
 */
function useLoading(
  form: SmartFormGroup | null,
  loading: boolean | undefined,
): void {
  useEffect(() => {
    if (!form || loading === undefined) return;

    if (loading) form.disable();
    else if (form.disabled) form.enable();
  }, [form, loading]);
}

/**
 * `<smart-form>`: the form of `options.model`, built by the form factory for
 * `options.mode` (`'create'` by default) with `options.uniqueProvider`, or
 * `options.control` when given. Renders the body registered as
 * `components.form` on `SmartProvider` (the Angular
 * `FORM_STANDARD_COMPONENT_TOKEN`), `SmartFormStandard` by default.
 *
 * Submitting the form or releasing Enter inside it emits `onInvokeSubmit`
 * with the form value. `options.treeLevel` defaults to 1 and is set as the
 * `tree-level` / `data-tree-level` attribute of the root element. A form
 * rendered inside another one (an `object` or `array` field) renders a
 * `<div>` instead of a nested `<form>`; its Enter key and its submission
 * reach the outer form.
 *
 * The export / import buttons of the Angular template are commented out
 * there and not ported.
 */
export function SmartForm<T>(props: SmartFormProps<T>) {
  const {
    options,
    className,
    onInvokeSubmit,
    onValueChange,
    onValuePartialChange,
    onValidChange,
  } = props;
  const control = options.control as SmartFormGroup | undefined;
  const built = useModelForm(options.model, {
    mode: options.mode ?? 'create',
    uniqueProvider: options.uniqueProvider as SmartUniqueProvider | undefined,
    control,
  });
  const form = control ?? built;
  const nested = useContext(SmartFormNestingContext);
  const Component = useSmartComponent<SmartFormBaseProps<T>>(
    'form',
    SmartFormStandard,
  );

  // The Angular wrapper set `options.treeLevel = 1` when it was not given.
  const bodyOptions = useMemo<IFormOptions<T>>(
    () => (options.treeLevel ? options : { ...options, treeLevel: 1 }),
    [options],
  );
  const treeLevel = bodyOptions.treeLevel as number;

  useRegisterChanges(form, {
    onValueChange,
    onValuePartialChange,
    onValidChange,
  });
  useLoading(form, options.loading);

  if (!form) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onInvokeSubmit?.(form.value);
  };

  const onKeyUp = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') onInvokeSubmit?.(form.value);
  };

  const body = (
    <SmartFormNestingContext.Provider value={true}>
      <Component
        options={bodyOptions}
        form={form}
        className={className}
        onInvokeSubmit={onInvokeSubmit}
      />
    </SmartFormNestingContext.Provider>
  );

  if (nested) {
    return (
      <div tree-level={treeLevel} data-tree-level={treeLevel} onKeyUp={onKeyUp}>
        {body}
      </div>
    );
  }

  return (
    <form
      tree-level={treeLevel}
      data-tree-level={treeLevel}
      onSubmit={onSubmit}
      onKeyUp={onKeyUp}
    >
      {body}
    </form>
  );
}
