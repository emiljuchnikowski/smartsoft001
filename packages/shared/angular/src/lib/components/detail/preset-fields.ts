import { Type } from '@angular/core';

import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { DetailAddressPresetComponent } from './address/preset/preset.component';
import { DetailArrayPresetComponent } from './array/preset/preset.component';
import { DetailAttachmentPresetComponent } from './attachment/preset/preset.component';
import { DetailBaseComponent } from './base/base.component';
import { DetailColorPresetComponent } from './color/preset/preset.component';
import { DetailDateRangePresetComponent } from './date-range/preset/preset.component';
import { DetailEmailPresetComponent } from './email/preset/preset.component';
import { DetailEnumPresetComponent } from './enum/preset/preset.component';
import { DetailFlagPresetComponent } from './flag/preset/preset.component';
import { DetailImagePresetComponent } from './image/preset/preset.component';
import { DetailLogoPresetComponent } from './logo/preset/preset.component';
import { DetailObjectPresetComponent } from './object/preset/preset.component';
import { DetailPdfPresetComponent } from './pdf/preset/preset.component';
import { DetailPhoneNumberPlPresetComponent } from './phone-number-pl/preset/preset.component';
import { DetailTextPresetComponent } from './text/preset/preset.component';
import { DetailVideoPresetComponent } from './video/preset/preset.component';

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
 * The map is partial on purpose — field types without an entry keep their
 * standard components via the `baseMap` merge in `DetailComponent`. Note that
 * registering `text` here does not change the fallback for unmapped types:
 * the map is keyed per `FieldType`, so unknown types still fall back to the
 * standard `DetailTextComponent`.
 */
export const DETAIL_PRESET_FIELD_COMPONENTS: Partial<
  Record<FieldTypeDef, Type<DetailBaseComponent<any>>>
> = {
  [FieldType.email]: DetailEmailPresetComponent,
  [FieldType.enum]: DetailEnumPresetComponent,
  [FieldType.flag]: DetailFlagPresetComponent,
  [FieldType.color]: DetailColorPresetComponent,
  [FieldType.address]: DetailAddressPresetComponent,
  [FieldType.dateRange]: DetailDateRangePresetComponent,
  [FieldType.phoneNumberPl]: DetailPhoneNumberPlPresetComponent,
  [FieldType.logo]: DetailLogoPresetComponent,
  [FieldType.image]: DetailImagePresetComponent,
  [FieldType.video]: DetailVideoPresetComponent,
  [FieldType.attachment]: DetailAttachmentPresetComponent,
  [FieldType.pdf]: DetailPdfPresetComponent,
  [FieldType.text]: DetailTextPresetComponent,
  [FieldType.object]: DetailObjectPresetComponent,
  [FieldType.array]: DetailArrayPresetComponent,
};
