import { reflectComponentType, Type } from '@angular/core';

/**
 * The inputs a wrapper hands to `NgComponentOutlet`, keyed the way the
 * rendered component declares them.
 *
 * `NgComponentOutlet` sets inputs through `ComponentRef.setInput`, which finds
 * an input by its public (template) name. The base classes declare
 * `cssClass = input('', { alias: 'class' })`, so the public name of that input
 * is `class`, while the presets override it without the alias and keep
 * `cssClass`. A wrapper that always passes `cssClass` would leave a custom
 * implementation extending the base without its classes (and log NG0303 in
 * dev mode). This resolves every key, written as the property name, to the
 * public name the rendered component uses, and leaves out the inputs the
 * component does not declare, so a custom implementation may implement only
 * the inputs it needs.
 *
 * `null` (no component registered) returns the inputs unchanged.
 */
export function outletInputs(
  component: Type<unknown> | null | undefined,
  inputs: Record<string, unknown>,
): Record<string, unknown> {
  const declared = component ? reflectComponentType(component)?.inputs : null;

  if (!declared) return inputs;

  const publicName = new Map<string, string>();

  for (const { propName, templateName } of declared) {
    publicName.set(propName, templateName);
    publicName.set(templateName, templateName);
  }

  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(inputs)) {
    const name = publicName.get(key);

    if (name) resolved[name] = value;
  }

  return resolved;
}
