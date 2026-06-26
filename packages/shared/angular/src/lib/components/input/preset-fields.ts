import { Type } from '@angular/core';

import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { InputAttachmentPresetComponent } from './attachment/preset/preset.component';
import { InputBaseComponent } from './base/base.component';
import { InputCheckPresetComponent } from './check/preset/preset.component';
import { InputCurrencyPresetComponent } from './currency/preset/preset.component';
import { InputDatePresetComponent } from './date/preset/preset.component';
import { InputDateRangePresetComponent } from './date-range/preset/preset.component';
import { InputDateWithEditPresetComponent } from './date-with-edit/preset/preset.component';
import { InputEmailPresetComponent } from './email/preset/preset.component';
import { InputEnumPresetComponent } from './enum/preset/preset.component';
import { InputFilePresetComponent } from './file/preset/preset.component';
import { InputFloatPresetComponent } from './float/preset/preset.component';
import { InputImagePresetComponent } from './image/preset/preset.component';
import { InputIntPresetComponent } from './int/preset/preset.component';
import { InputIntsPresetComponent } from './ints/preset/preset.component';
import { InputLogoPresetComponent } from './logo/preset/preset.component';
import { InputLongTextPresetComponent } from './long-text/preset/preset.component';
import { InputNipPresetComponent } from './nip/preset/preset.component';
import { InputPasswordPresetComponent } from './password/preset/preset.component';
import { InputPeselPresetComponent } from './pesel/preset/preset.component';
import { InputPhoneNumberPresetComponent } from './phone-number/preset/preset.component';
import { InputPhoneNumberPlPresetComponent } from './phone-number-pl/preset/preset.component';
import { InputRadioPresetComponent } from './radio/preset/preset.component';
import { InputStringsPresetComponent } from './strings/preset/preset.component';
import { InputTextPresetComponent } from './text/preset/preset.component';

/**
 * Complete map of the Preline-styled input field presets (FRA-226), keyed by
 * `FieldType`. Provide it for `INPUT_FIELD_COMPONENTS_TOKEN` to render every
 * `<smart-input>` with the Preline look:
 *
 * ```ts
 * providers: [
 *   { provide: INPUT_FIELD_COMPONENTS_TOKEN, useValue: INPUT_PRESET_FIELD_COMPONENTS },
 * ];
 * ```
 *
 * Spread it to override only some types, e.g.
 * `{ ...INPUT_PRESET_FIELD_COMPONENTS, [FieldType.text]: MyText }`.
 *
 * Note: the validation-message preset `InputErrorPresetComponent` is not a
 * `FieldType` and is therefore not part of this map (use its selector directly).
 */
export const INPUT_PRESET_FIELD_COMPONENTS: Partial<
  Record<FieldTypeDef, Type<InputBaseComponent<unknown>>>
> = {
  [FieldType.text]: InputTextPresetComponent,
  [FieldType.longText]: InputLongTextPresetComponent,
  [FieldType.email]: InputEmailPresetComponent,
  [FieldType.currency]: InputCurrencyPresetComponent,
  [FieldType.int]: InputIntPresetComponent,
  [FieldType.ints]: InputIntsPresetComponent,
  [FieldType.float]: InputFloatPresetComponent,
  [FieldType.nip]: InputNipPresetComponent,
  [FieldType.pesel]: InputPeselPresetComponent,
  [FieldType.phoneNumber]: InputPhoneNumberPresetComponent,
  [FieldType.phoneNumberPl]: InputPhoneNumberPlPresetComponent,
  [FieldType.password]: InputPasswordPresetComponent,
  [FieldType.enum]: InputEnumPresetComponent,
  [FieldType.radio]: InputRadioPresetComponent,
  [FieldType.check]: InputCheckPresetComponent,
  [FieldType.strings]: InputStringsPresetComponent,
  [FieldType.date]: InputDatePresetComponent,
  [FieldType.dateRange]: InputDateRangePresetComponent,
  [FieldType.dateWithEdit]: InputDateWithEditPresetComponent,
  [FieldType.file]: InputFilePresetComponent,
  [FieldType.attachment]: InputAttachmentPresetComponent,
  [FieldType.image]: InputImagePresetComponent,
  [FieldType.logo]: InputLogoPresetComponent,
};
