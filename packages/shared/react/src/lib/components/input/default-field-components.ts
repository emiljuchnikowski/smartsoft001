import type { ComponentType } from 'react';

import { FieldTypeDef } from '@smartsoft001/models';

/**
 * The field component of every `FieldType`, by type. Built on first use
 * rather than at module load: the `object` and `array` fields render a form,
 * which renders inputs, and a map built while those modules are still loading
 * would hold `undefined` for them.
 */
let defaults: Partial<Record<FieldTypeDef, ComponentType<any>>> | null = null;

export function getDefaultInputFieldComponents(): Partial<
  Record<FieldTypeDef, ComponentType<any>>
> {
  defaults ??= {};

  return defaults;
}
