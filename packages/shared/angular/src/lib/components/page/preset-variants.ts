import { Type } from '@angular/core';

import { SmartPageVariant } from '../../models';
import { PageBaseComponent } from './base/base.component';
import { PagePresetComponent } from './preset/preset.component';

/**
 * Styled page variant preset (FRA-331), keyed by `SmartPageVariant`.
 * Provide it for `PAGE_VARIANT_COMPONENTS_TOKEN` to register the `'preset'`
 * variant alongside the built-in `'standard'`:
 *
 * ```ts
 * providers: [
 *   { provide: PAGE_VARIANT_COMPONENTS_TOKEN, useValue: PAGE_PRESET_VARIANT_COMPONENTS },
 * ];
 * ```
 *
 * The map is partial on purpose — it only adds `'preset'`; the built-in
 * `'standard'` variant keeps its component via the `baseMap` merge in
 * `PageComponent`.
 */
export const PAGE_PRESET_VARIANT_COMPONENTS: Partial<
  Record<SmartPageVariant, Type<PageBaseComponent>>
> = {
  preset: PagePresetComponent,
};
