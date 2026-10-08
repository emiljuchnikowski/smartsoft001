import type { ComponentType } from 'react';

import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { SmartInputAddressPreset } from './address/preset/input-address-preset';
import { SmartInputArrayPreset } from './array/preset/input-array-preset';
import { SmartInputAttachmentPreset } from './attachment/preset/input-attachment-preset';
import { SmartInputCheckPreset } from './check/preset/input-check-preset';
import { SmartInputColorPreset } from './color/preset/input-color-preset';
import { SmartInputCurrencyPreset } from './currency/preset/input-currency-preset';
import { SmartInputDatePreset } from './date/preset/input-date-preset';
import { SmartInputDateRangePreset } from './date-range/preset/input-date-range-preset';
import { SmartInputDateWithEditPreset } from './date-with-edit/preset/input-date-with-edit-preset';
import { SmartInputEmailPreset } from './email/preset/input-email-preset';
import { SmartInputEnumPreset } from './enum/preset/input-enum-preset';
import { SmartInputFilePreset } from './file/preset/input-file-preset';
import { SmartInputFlagPreset } from './flag/preset/input-flag-preset';
import { SmartInputFloatPreset } from './float/preset/input-float-preset';
import { SmartInputImagePreset } from './image/preset/input-image-preset';
import { SmartInputIntPreset } from './int/preset/input-int-preset';
import { SmartInputIntsPreset } from './ints/preset/input-ints-preset';
import { SmartInputLogoPreset } from './logo/preset/input-logo-preset';
import { SmartInputLongTextPreset } from './long-text/preset/input-long-text-preset';
import { SmartInputNipPreset } from './nip/preset/input-nip-preset';
import { SmartInputObjectPreset } from './object/preset/input-object-preset';
import { SmartInputPasswordPreset } from './password/preset/input-password-preset';
import { SmartInputPdfPreset } from './pdf/preset/input-pdf-preset';
import { SmartInputPeselPreset } from './pesel/preset/input-pesel-preset';
import { SmartInputPhoneNumberPlPreset } from './phone-number-pl/preset/input-phone-number-pl-preset';
import { SmartInputPhoneNumberPreset } from './phone-number/preset/input-phone-number-preset';
import { SmartInputRadioPreset } from './radio/preset/input-radio-preset';
import { SmartInputStringsPreset } from './strings/preset/input-strings-preset';
import { SmartInputTextPreset } from './text/preset/input-text-preset';
import { SmartInputVideoPreset } from './video/preset/input-video-preset';

/**
 * The Preline-styled field presets, by `FieldType` (the Angular
 * `INPUT_PRESET_FIELD_COMPONENTS`). Pass it as `inputFieldComponents` to
 * `SmartProvider` to render every `<SmartInput>` with the preset look, or
 * spread it to override only some types:
 * `{ ...INPUT_PRESET_FIELD_COMPONENTS, [FieldType.text]: MyText }`.
 *
 * The validation-message preset `SmartInputErrorPreset` is not a field type;
 * register it as `components['input-error']`.
 */
export const INPUT_PRESET_FIELD_COMPONENTS: Partial<
  Record<FieldTypeDef, ComponentType<any>>
> = {
  [FieldType.text]: SmartInputTextPreset,
  [FieldType.longText]: SmartInputLongTextPreset,
  [FieldType.email]: SmartInputEmailPreset,
  [FieldType.currency]: SmartInputCurrencyPreset,
  [FieldType.int]: SmartInputIntPreset,
  [FieldType.ints]: SmartInputIntsPreset,
  [FieldType.float]: SmartInputFloatPreset,
  [FieldType.nip]: SmartInputNipPreset,
  [FieldType.pesel]: SmartInputPeselPreset,
  [FieldType.phoneNumber]: SmartInputPhoneNumberPreset,
  [FieldType.phoneNumberPl]: SmartInputPhoneNumberPlPreset,
  [FieldType.password]: SmartInputPasswordPreset,
  [FieldType.enum]: SmartInputEnumPreset,
  [FieldType.radio]: SmartInputRadioPreset,
  [FieldType.check]: SmartInputCheckPreset,
  [FieldType.strings]: SmartInputStringsPreset,
  [FieldType.date]: SmartInputDatePreset,
  [FieldType.dateRange]: SmartInputDateRangePreset,
  [FieldType.dateWithEdit]: SmartInputDateWithEditPreset,
  [FieldType.file]: SmartInputFilePreset,
  [FieldType.attachment]: SmartInputAttachmentPreset,
  [FieldType.image]: SmartInputImagePreset,
  [FieldType.logo]: SmartInputLogoPreset,
  [FieldType.color]: SmartInputColorPreset,
  [FieldType.object]: SmartInputObjectPreset,
  [FieldType.address]: SmartInputAddressPreset,
  [FieldType.flag]: SmartInputFlagPreset,
  [FieldType.pdf]: SmartInputPdfPreset,
  [FieldType.video]: SmartInputVideoPreset,
  [FieldType.array]: SmartInputArrayPreset,
};
