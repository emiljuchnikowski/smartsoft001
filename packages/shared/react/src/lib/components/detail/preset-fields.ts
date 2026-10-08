import { FieldType } from '@smartsoft001/models';

import { SmartDetailAddressPreset } from './address/preset/detail-address-preset';
import { SmartDetailArrayPreset } from './array/preset/detail-array-preset';
import { SmartDetailAttachmentPreset } from './attachment/preset/detail-attachment-preset';
import { SmartDetailColorPreset } from './color/preset/detail-color-preset';
import { SmartDetailDateRangePreset } from './date-range/preset/detail-date-range-preset';
import { SmartDetailFieldComponents } from './default-field-components';
import { SmartDetailEmailPreset } from './email/preset/detail-email-preset';
import { SmartDetailEnumPreset } from './enum/preset/detail-enum-preset';
import { SmartDetailFlagPreset } from './flag/preset/detail-flag-preset';
import { SmartDetailImagePreset } from './image/preset/detail-image-preset';
import { SmartDetailLogoPreset } from './logo/preset/detail-logo-preset';
import { SmartDetailObjectPreset } from './object/preset/detail-object-preset';
import { SmartDetailPdfPreset } from './pdf/preset/detail-pdf-preset';
import { SmartDetailPhoneNumberPlPreset } from './phone-number-pl/preset/detail-phone-number-pl-preset';
import { SmartDetailTextPreset } from './text/preset/detail-text-preset';
import { SmartDetailVideoPreset } from './video/preset/detail-video-preset';

/**
 * The preset detail components, keyed by `FieldType`. Register the map as
 * `detailFieldComponents` on `SmartProvider` (the Angular
 * `DETAIL_FIELD_COMPONENTS_TOKEN`) to give every detail the preset look:
 *
 * ```tsx
 * <SmartProvider detailFieldComponents={DETAIL_PRESET_FIELD_COMPONENTS}>
 * ```
 *
 * Field types without an entry keep their standard component, and a type
 * missing from every map still falls back to `SmartDetailText`.
 */
export const DETAIL_PRESET_FIELD_COMPONENTS: SmartDetailFieldComponents = {
  [FieldType.email]: SmartDetailEmailPreset,
  [FieldType.enum]: SmartDetailEnumPreset,
  [FieldType.flag]: SmartDetailFlagPreset,
  [FieldType.color]: SmartDetailColorPreset,
  [FieldType.address]: SmartDetailAddressPreset,
  [FieldType.dateRange]: SmartDetailDateRangePreset,
  [FieldType.phoneNumberPl]: SmartDetailPhoneNumberPlPreset,
  [FieldType.logo]: SmartDetailLogoPreset,
  [FieldType.image]: SmartDetailImagePreset,
  [FieldType.video]: SmartDetailVideoPreset,
  [FieldType.attachment]: SmartDetailAttachmentPreset,
  [FieldType.pdf]: SmartDetailPdfPreset,
  [FieldType.text]: SmartDetailTextPreset,
  [FieldType.object]: SmartDetailObjectPreset,
  [FieldType.array]: SmartDetailArrayPreset,
};
