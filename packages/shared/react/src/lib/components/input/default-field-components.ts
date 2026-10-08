import type { ComponentType } from 'react';

import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { SmartInputAddress } from './address/input-address';
import { SmartInputArray } from './array/input-array';
import { SmartInputAttachment } from './attachment/input-attachment';
import { SmartInputCheck } from './check/input-check';
import { SmartInputColor } from './color/input-color';
import { SmartInputCurrency } from './currency/input-currency';
import { SmartInputDate } from './date/input-date';
import { SmartInputDateRange } from './date-range/input-date-range';
import { SmartInputDateWithEdit } from './date-with-edit/input-date-with-edit';
import { SmartInputEmail } from './email/input-email';
import { SmartInputEnum } from './enum/input-enum';
import { SmartInputFile } from './file/input-file';
import { SmartInputFlag } from './flag/input-flag';
import { SmartInputFloat } from './float/input-float';
import { SmartInputImage } from './image/input-image';
import { SmartInputInt } from './int/input-int';
import { SmartInputInts } from './ints/input-ints';
import { SmartInputLogo } from './logo/input-logo';
import { SmartInputLongText } from './long-text/input-long-text';
import { SmartInputNip } from './nip/input-nip';
import { SmartInputObject } from './object/input-object';
import { SmartInputPassword } from './password/input-password';
import { SmartInputPdf } from './pdf/input-pdf';
import { SmartInputPesel } from './pesel/input-pesel';
import { SmartInputPhoneNumber } from './phone-number/input-phone-number';
import { SmartInputPhoneNumberPl } from './phone-number-pl/input-phone-number-pl';
import { SmartInputRadio } from './radio/input-radio';
import { SmartInputStrings } from './strings/input-strings';
import { SmartInputText } from './text/input-text';
import { SmartInputVideo } from './video/input-video';

/**
 * The field component of every `FieldType`, by type: the map
 * `<SmartInput>` falls back to (the Angular `baseMap` of `InputComponent`).
 * Built on first use rather than at module load: the `object` and `array`
 * fields render a form, which renders inputs, and a map built while those
 * modules are still loading would hold `undefined` for them.
 */
let defaults: Partial<Record<FieldTypeDef, ComponentType<any>>> | null = null;

export function getDefaultInputFieldComponents(): Partial<
  Record<FieldTypeDef, ComponentType<any>>
> {
  defaults ??= {
    [FieldType.text]: SmartInputText,
    [FieldType.longText]: SmartInputLongText,
    [FieldType.email]: SmartInputEmail,
    [FieldType.currency]: SmartInputCurrency,
    [FieldType.int]: SmartInputInt,
    [FieldType.ints]: SmartInputInts,
    [FieldType.float]: SmartInputFloat,
    [FieldType.nip]: SmartInputNip,
    [FieldType.pesel]: SmartInputPesel,
    [FieldType.phoneNumber]: SmartInputPhoneNumber,
    [FieldType.phoneNumberPl]: SmartInputPhoneNumberPl,
    [FieldType.password]: SmartInputPassword,
    [FieldType.enum]: SmartInputEnum,
    [FieldType.radio]: SmartInputRadio,
    [FieldType.check]: SmartInputCheck,
    [FieldType.strings]: SmartInputStrings,
    [FieldType.date]: SmartInputDate,
    [FieldType.dateRange]: SmartInputDateRange,
    [FieldType.dateWithEdit]: SmartInputDateWithEdit,
    [FieldType.file]: SmartInputFile,
    [FieldType.attachment]: SmartInputAttachment,
    [FieldType.image]: SmartInputImage,
    [FieldType.logo]: SmartInputLogo,
    [FieldType.color]: SmartInputColor,
    [FieldType.object]: SmartInputObject,
    [FieldType.address]: SmartInputAddress,
    [FieldType.flag]: SmartInputFlag,
    [FieldType.pdf]: SmartInputPdf,
    [FieldType.video]: SmartInputVideo,
    [FieldType.array]: SmartInputArray,
  };

  return defaults;
}
