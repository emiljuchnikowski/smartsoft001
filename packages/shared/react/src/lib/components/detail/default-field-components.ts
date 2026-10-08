import type { ComponentType } from 'react';

import { FieldType, FieldTypeDef } from '@smartsoft001/models';

import { SmartDetailAddress } from './address/detail-address';
import { SmartDetailArray } from './array/detail-array';
import { SmartDetailAttachment } from './attachment/detail-attachment';
import { SmartDetailColor } from './color/detail-color';
import { SmartDetailDateRange } from './date-range/detail-date-range';
import { SmartDetailFieldProps } from './detail.types';
import { SmartDetailEmail } from './email/detail-email';
import { SmartDetailEnum } from './enum/detail-enum';
import { SmartDetailFlag } from './flag/detail-flag';
import { SmartDetailImage } from './image/detail-image';
import { SmartDetailLogo } from './logo/detail-logo';
import { SmartDetailObject } from './object/detail-object';
import { SmartDetailPdf } from './pdf/detail-pdf';
import { SmartDetailPhoneNumberPl } from './phone-number-pl/detail-phone-number-pl';
import { SmartDetailText } from './text/detail-text';
import { SmartDetailVideo } from './video/detail-video';

export type SmartDetailFieldComponents = Partial<
  Record<FieldTypeDef, ComponentType<SmartDetailFieldProps<any>>>
>;

let defaults: SmartDetailFieldComponents | null = null;

/**
 * The detail component of every `FieldType` (the Angular `baseMap` of
 * `DetailComponent`). Built on first use rather than at module load: the
 * `object` and `array` details render `<SmartDetails>`, which renders details
 * again, and a map built while those modules are still loading would hold
 * `undefined` for them.
 */
export function getDefaultDetailFieldComponents(): SmartDetailFieldComponents {
  defaults ??= {
    [FieldType.email]: SmartDetailEmail,
    [FieldType.flag]: SmartDetailFlag,
    [FieldType.enum]: SmartDetailEnum,
    [FieldType.address]: SmartDetailAddress,
    [FieldType.object]: SmartDetailObject,
    [FieldType.color]: SmartDetailColor,
    [FieldType.logo]: SmartDetailLogo,
    [FieldType.array]: SmartDetailArray,
    [FieldType.pdf]: SmartDetailPdf,
    [FieldType.video]: SmartDetailVideo,
    [FieldType.attachment]: SmartDetailAttachment,
    [FieldType.dateRange]: SmartDetailDateRange,
    [FieldType.image]: SmartDetailImage,
    [FieldType.phoneNumberPl]: SmartDetailPhoneNumberPl,
    [FieldType.text]: SmartDetailText,
  };

  return defaults;
}
