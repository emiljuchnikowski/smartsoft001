import { Type } from '@angular/core';

import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { DetailAttachmentPresetComponent } from './attachment/preset/preset.component';
import { DetailBaseComponent } from './base/base.component';
import { DetailEnumPresetComponent } from './enum/preset/preset.component';
import { DetailImagePresetComponent } from './image/preset/preset.component';

/**
 * Preline-styled detail field presets (FRA-238), keyed by `FieldType`.
 * Provide it for `DETAIL_FIELD_COMPONENTS_TOKEN` to swap the covered fields:
 *
 * ```ts
 * providers: [
 *   { provide: DETAIL_FIELD_COMPONENTS_TOKEN, useValue: DETAIL_PRESET_FIELD_COMPONENTS },
 * ];
 * ```
 *
 * The map is partial on purpose — only enum, image and attachment ship a
 * preset; all other field types keep their standard components via the
 * `baseMap` merge in `DetailComponent`.
 */
export const DETAIL_PRESET_FIELD_COMPONENTS: Partial<
  Record<FieldTypeDef, Type<DetailBaseComponent<any>>>
> = {
  [FieldType.enum]: DetailEnumPresetComponent,
  [FieldType.image]: DetailImagePresetComponent,
  [FieldType.attachment]: DetailAttachmentPresetComponent,
};
